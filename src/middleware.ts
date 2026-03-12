import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── Mock token map — replace with your real DB lookup ─────────
// Middleware runs on the Edge runtime, so use fetch() to call
// your DB API, or use an Edge-compatible client (e.g. Supabase edge client).
//
// Example with Supabase:
//
//   import { createClient } from '@supabase/supabase-js'
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!
//   )
//   const { data: guest } = await supabase
//     .from('guests')
//     .select('name, passes')
//     .eq('token', token)
//     .single()
//
// For now, a static map works fine for testing:
const VALID_TOKENS: Record<string, { name: string; passes: number }> = {
  tok_elena:   { name: 'Elena Moretti',      passes: 2 },
  tok_luca:    { name: 'Luca Bianchi',       passes: 1 },
  tok_giulia:  { name: 'Giulia Ferrara',     passes: 4 },
  tok_sofia:   { name: 'Sofia Ricci',        passes: 3 },
  tok_pietro:  { name: 'Pietro Romano',      passes: 2 },
  tok_vale:    { name: 'Valentina Esposito', passes: 1 },
  tok_andrea:  { name: 'Andrea Colombo',     passes: 2 },
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Only gate the root invitation page — not /dashboard, /api, etc.
  if (pathname !== '/') return NextResponse.next()

  const token = searchParams.get('token')
  const guest = token ? VALID_TOKENS[token] : null

  if (!guest) {
    // Invalid or missing token — rewrite to the locked page
    // (keeps the URL clean, no redirect flash)
    return NextResponse.rewrite(new URL('/locked', request.url))
  }

  // Valid — pass guest data as headers so the page can read them
  // without an additional API round-trip
  const response = NextResponse.next()
  response.headers.set('x-guest-name',   guest.name)
  response.headers.set('x-guest-passes', String(guest.passes))
  return response
}

export const config = {
  // Run on the root page only
  matcher: ['/', '/locked'],
}