import { NextRequest, NextResponse } from 'next/server'
import {
  createSessionToken,
  OAUTH_REDIRECT_COOKIE,
  OAUTH_STATE_COOKIE,
  setSessionCookie,
  verifyOAuthState,
} from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

interface GoogleTokenResponse {
  access_token?: string
}

interface GoogleProfile {
  sub?: string
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
}

const redirectWithError = (request: NextRequest, reason: string, redirectTarget = '/') => {
  const targetUrl = new URL(redirectTarget, request.url)
  targetUrl.searchParams.set('auth', 'error')
  targetUrl.searchParams.set('reason', reason)
  const response = NextResponse.redirect(targetUrl)
  response.cookies.delete(OAUTH_STATE_COOKIE)
  response.cookies.delete(OAUTH_REDIRECT_COOKIE)
  return response
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const storedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value
  const oauthError = request.nextUrl.searchParams.get('error')

  // Retrieve destination redirect target from state or backup cookie
  const cookieRedirect = request.cookies.get(OAUTH_REDIRECT_COOKIE)?.value
  const verifiedState = verifyOAuthState(storedState)

  const resolvedRedirect =
    (verifiedState?.redirect &&
      verifiedState.redirect.startsWith('/') &&
      !verifiedState.redirect.startsWith('//') &&
      verifiedState.redirect) ||
    (cookieRedirect &&
      cookieRedirect.startsWith('/') &&
      !cookieRedirect.startsWith('//') &&
      cookieRedirect) ||
    '/'

  if (!clientId || !clientSecret) {
    return redirectWithError(request, 'google_not_configured', resolvedRedirect)
  }

  if (oauthError) {
    return redirectWithError(request, 'google_cancelled', resolvedRedirect)
  }

  if (!code || !state || !storedState || state !== storedState || !verifiedState) {
    return redirectWithError(request, 'google_state_invalid', resolvedRedirect)
  }

  const callbackUrl = new URL('/api/auth/google/callback', request.nextUrl.origin)
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: callbackUrl.toString(),
    }),
    cache: 'no-store',
  })

  if (!tokenResponse.ok) {
    return redirectWithError(request, 'google_exchange_failed', resolvedRedirect)
  }

  const token = (await tokenResponse.json()) as GoogleTokenResponse
  if (!token.access_token) {
    return redirectWithError(request, 'google_exchange_failed', resolvedRedirect)
  }

  const profileResponse = await fetch(
    'https://openidconnect.googleapis.com/v1/userinfo',
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
      cache: 'no-store',
    },
  )

  if (!profileResponse.ok) {
    return redirectWithError(request, 'google_profile_failed', resolvedRedirect)
  }

  const profile = (await profileResponse.json()) as GoogleProfile
  if (!profile.sub || !profile.email) {
    return redirectWithError(request, 'google_profile_failed', resolvedRedirect)
  }

  const email = profile.email.trim().toLowerCase()
  const name = profile.name?.trim() || email.split('@')[0]

  // Redirect directly to destination (e.g. /shop?auth=success)
  const destinationUrl = new URL(resolvedRedirect, request.url)
  destinationUrl.searchParams.set('auth', 'success')
  const response = NextResponse.redirect(destinationUrl)

  setSessionCookie(
    response,
    createSessionToken({
      id: profile.sub,
      email,
      name,
      provider: 'google',
      ...(profile.picture ? { picture: profile.picture } : {}),
    }),
  )
  response.cookies.delete(OAUTH_STATE_COOKIE)
  response.cookies.delete(OAUTH_REDIRECT_COOKIE)
  return response
}