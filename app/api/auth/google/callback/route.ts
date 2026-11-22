import { NextRequest, NextResponse } from 'next/server'
import {
  createSessionToken,
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

const redirectWithError = (request: NextRequest, reason: string) => {
  const response = NextResponse.redirect(
    new URL(`/?auth=error&reason=${reason}`, request.url),
  )
  response.cookies.delete(OAUTH_STATE_COOKIE)
  return response
}

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const storedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value
  const oauthError = request.nextUrl.searchParams.get('error')

  if (!clientId || !clientSecret) {
    return redirectWithError(request, 'google_not_configured')
  }

  if (oauthError) {
    return redirectWithError(request, 'google_cancelled')
  }

  if (!code || !state || !storedState || state !== storedState) {
    return redirectWithError(request, 'google_state_invalid')
  }

  if (!verifyOAuthState(storedState)) {
    return redirectWithError(request, 'google_state_invalid')
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
    return redirectWithError(request, 'google_exchange_failed')
  }

  const token = (await tokenResponse.json()) as GoogleTokenResponse
  if (!token.access_token) {
    return redirectWithError(request, 'google_exchange_failed')
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
    return redirectWithError(request, 'google_profile_failed')
  }

  const profile = (await profileResponse.json()) as GoogleProfile
  if (!profile.sub || !profile.email) {
    return redirectWithError(request, 'google_profile_failed')
  }

  const email = profile.email.trim().toLowerCase()
  const name = profile.name?.trim() || email.split('@')[0]
  const response = NextResponse.redirect(new URL('/?auth=success', request.url))

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
  return response
}
