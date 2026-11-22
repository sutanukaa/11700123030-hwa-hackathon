import { NextRequest, NextResponse } from 'next/server'
import {
  clearSessionCookie,
  getSessionUser,
} from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

const noStoreHeaders = {
  'Cache-Control': 'no-store',
}

export async function GET(request: NextRequest) {
  const user = getSessionUser(request)
  return NextResponse.json({ user }, { headers: noStoreHeaders })
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true },
    { headers: noStoreHeaders },
  )
  clearSessionCookie(response)
  return response
}
