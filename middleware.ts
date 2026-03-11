import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const VALID_TOKENS = new Set(['token_abc123', 'token_def456'])

export function middleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token || !VALID_TOKENS.has(token)) {
    return NextResponse.redirect(new URL('/invalid', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: '/' }