import { NextRequest, NextResponse } from 'next/server'
import { createOAuthState, setOAuthStateCookie } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL('/?auth=error&reason=google_not_configured', request.url),
    )
  }

  const callbackUrl = new URL('/api/auth/google/callback', request.nextUrl.origin)
  const state = createOAuthState()
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
  return response
}
