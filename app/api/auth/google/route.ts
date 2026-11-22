import { NextRequest, NextResponse } from 'next/server'
import {
  createOAuthState,
  OAUTH_REDIRECT_COOKIE,
  setOAuthStateCookie,
} from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  // Read destination redirect (e.g. /shop)
  const redirectParam = request.nextUrl.searchParams.get('redirect')
  const safeRedirect =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : undefined

  if (!clientId || !clientSecret) {
    const errorUrl = new URL(safeRedirect || '/', request.url)
    errorUrl.searchParams.set('auth', 'error')
    errorUrl.searchParams.set('reason', 'google_not_configured')
    return NextResponse.redirect(errorUrl)
  }

  const callbackUrl = new URL('/api/auth/google/callback', request.nextUrl.origin)
  const state = createOAuthState(safeRedirect)
  const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  authorizationUrl.searchParams.set('client_id', clientId)
  authorizationUrl.searchParams.set('redirect_uri', callbackUrl.toString())
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', 'openid email profile')
  authorizationUrl.searchParams.set('state', state)
  authorizationUrl.searchParams.set('prompt', 'select_account')
  authorizationUrl.searchParams.set('include_granted_scopes', 'true')

  const response = NextResponse.redirect(authorizationUrl)
  setOAuthStateCookie(response, state)

  if (safeRedirect) {
    response.cookies.set(OAUTH_REDIRECT_COOKIE, safeRedirect, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,
    })
  }

  return response
}