import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto'
import type { NextRequest, NextResponse } from 'next/server'
import type { AuthProvider, AuthUser } from '@/types/auth'

export const SESSION_COOKIE = 'canopy_session'
export const EMAIL_CREDENTIAL_COOKIE = 'canopy_email_credential'
export const OAUTH_STATE_COOKIE = 'canopy_oauth_state'

const SESSION_MAX_AGE = 60 * 60 * 24 * 30
const EMAIL_CREDENTIAL_MAX_AGE = 60 * 60 * 24 * 365
const OAUTH_STATE_MAX_AGE = 60 * 10

interface SessionPayload extends AuthUser {
  exp: number
}

interface EmailCredentialRecord {
  salt: string
  hash: string
  createdAt: number
}

interface EmailCredentialPayload {
  accounts: Record<string, EmailCredentialRecord>
  exp: number
}

interface OAuthStatePayload {
  nonce: string
  exp: number
}

const getSigningKey = () => {
  const secret = process.env.AUTH_SECRET || process.env.GOOGLE_CLIENT_SECRET
  if (!secret) return null

  return createHash('sha256').update(`canopy-auth-v1:${secret}`).digest()
}

const encodePayload = (payload: unknown) =>
  Buffer.from(JSON.stringify(payload)).toString('base64url')

const signPayload = (payload: unknown) => {
  const key = getSigningKey()
  if (!key) throw new Error('Authentication is not configured')

  const body = encodePayload(payload)
  const signature = createHmac('sha256', key).update(body).digest('base64url')
  return `${body}.${signature}`
}

const verifyPayload = <T,>(token: string | undefined): T | null => {
  if (!token) return null

  const key = getSigningKey()
  if (!key) return null

  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  const expectedSignature = createHmac('sha256', key)
    .update(body)
    .digest('base64url')
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}

const secureCookie = process.env.NODE_ENV === 'production'

const cookieOptions = {
  httpOnly: true,
  secure: secureCookie,
  sameSite: 'lax' as const,
  path: '/',
}

const isAuthProvider = (value: unknown): value is AuthProvider =>
  value === 'email' || value === 'google'

export const createSessionToken = (user: AuthUser) =>
  signPayload({
    ...user,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  } satisfies SessionPayload)

export const getSessionUser = (request: NextRequest): AuthUser | null => {
  const payload = verifyPayload<SessionPayload>(
    request.cookies.get(SESSION_COOKIE)?.value,
  )
  if (!payload || payload.exp <= Date.now()) return null
  if (!payload.id || !payload.email || !payload.name || !isAuthProvider(payload.provider)) {
    return null
  }

  return {
    id: payload.id,
    email: payload.email,
    name: payload.name,
    provider: payload.provider,
    ...(payload.picture ? { picture: payload.picture } : {}),
  }
}

export const setSessionCookie = (response: NextResponse, token: string) => {
  response.cookies.set(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: SESSION_MAX_AGE,
  })
}

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set(SESSION_COOKIE, '', {
    ...cookieOptions,
    maxAge: 0,
  })
}

const getEmailAccounts = (request: NextRequest) => {
  const payload = verifyPayload<EmailCredentialPayload>(
    request.cookies.get(EMAIL_CREDENTIAL_COOKIE)?.value,
  )
  if (!payload || payload.exp <= Date.now() || !payload.accounts) return {}
  return payload.accounts
}

export const createEmailCredential = (
  request: NextRequest,
  email: string,
  password: string,
) => {
  const accounts = { ...getEmailAccounts(request) }
  const salt = randomBytes(16).toString('base64url')
  const hash = scryptSync(password, salt, 64).toString('base64url')

  accounts[email] = {
    salt,
    hash,
    createdAt: Date.now(),
  }

  return signPayload({
    accounts,
    exp: Date.now() + EMAIL_CREDENTIAL_MAX_AGE * 1000,
  } satisfies EmailCredentialPayload)
}

export const verifyEmailCredential = (
  request: NextRequest,
  email: string,
  password: string,
) => {
  const record = getEmailAccounts(request)[email]
  if (!record) return false

  const expectedHash = Buffer.from(record.hash, 'base64url')
  const actualHash = scryptSync(password, record.salt, 64)
  if (expectedHash.length !== actualHash.length) return false

  return timingSafeEqual(expectedHash, actualHash)
}

export const setEmailCredentialCookie = (
  response: NextResponse,
  token: string,
) => {
  response.cookies.set(EMAIL_CREDENTIAL_COOKIE, token, {
    ...cookieOptions,
    maxAge: EMAIL_CREDENTIAL_MAX_AGE,
  })
}

export const createEmailUser = (email: string): AuthUser => {
  const name = email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

  return {
    id: createHash('sha256').update(email).digest('hex').slice(0, 24),
    email,
    name: name || 'CANOPY Guest',
    provider: 'email',
  }
}

export const createOAuthState = () =>
  signPayload({
    nonce: randomBytes(24).toString('base64url'),
    exp: Date.now() + OAUTH_STATE_MAX_AGE * 1000,
  } satisfies OAuthStatePayload)

export const verifyOAuthState = (token: string | undefined) => {
  const payload = verifyPayload<OAuthStatePayload>(token)
  if (!payload || payload.exp <= Date.now() || !payload.nonce) return false
  return true
}

export const setOAuthStateCookie = (response: NextResponse, state: string) => {
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    ...cookieOptions,
    maxAge: OAUTH_STATE_MAX_AGE,
  })
}
