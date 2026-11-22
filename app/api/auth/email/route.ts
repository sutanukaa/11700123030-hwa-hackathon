import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createEmailCredential,
  createEmailUser,
  createSessionToken,
  setEmailCredentialCookie,
  setSessionCookie,
  verifyEmailCredential,
} from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const requestSchema = z.object({
  mode: z.enum(['signin', 'register']),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
})

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Please enter a valid email and password.' },
      { status: 400 },
    )
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Use a valid email address and a password of at least 8 characters.' },
      { status: 400 },
    )
  }

  const email = parsed.data.email.trim().toLowerCase()
  const { mode, password } = parsed.data

  if (mode === 'register') {
    const credential = createEmailCredential(request, email, password)
    const user = createEmailUser(email)
    const response = NextResponse.json({ user })

    setEmailCredentialCookie(response, credential)
    setSessionCookie(response, createSessionToken(user))
    return response
  }

  if (!verifyEmailCredential(request, email, password)) {
    return NextResponse.json(
      {
        error:
          'We could not find a matching email account in this browser. Create an account or continue with Google.',
      },
      { status: 401 },
    )
  }

  const user = createEmailUser(email)
  const response = NextResponse.json({ user })
  setSessionCookie(response, createSessionToken(user))
  return response
}
