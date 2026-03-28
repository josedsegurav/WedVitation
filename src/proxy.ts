import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ── Public routes — no auth required ──────────────────────────
const PUBLIC_PREFIXES = [
  '/locked',
  '/auth',
  '/api/guest',
  '/api/rsvp',
]

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
}

// ── Invitation token gate ─────────────────────────────────────
// Calls the get_guest_by_token() Postgres function via the REST API.
// This function is security definer so it bypasses RLS — safe because
// it only returns name + passes for a matching token.
async function validateInvitationToken(
  token: string
): Promise<{ name: string; passes: number } | null> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_guest_by_token`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'apikey':        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!}`,
      // Prevent Edge/CDN caching — every token check must hit Supabase
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ p_token: token }),
    // Next.js fetch cache — opt out completely
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error('[middleware] token validation failed:', res.status, await res.text())
    return null
  }

  // RPC returns an array for table-returning functions
  const rows = await res.json() as { name: string; passes: number }[]
  return rows?.[0] ?? null
}

// ── Main middleware ────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── A. Invitation token gate — only on / ───────────────────
  if (pathname === '/') {
    const token = request.nextUrl.searchParams.get('token')
    const guest = token ? await validateInvitationToken(token) : null

    if (!guest) {
      const lockedUrl = new URL('/locked', request.url)
      const response  = NextResponse.rewrite(lockedUrl)
      // Prevent caching of locked responses
      response.headers.set('Cache-Control', 'no-store')
      return response
    }

    const response = NextResponse.next()
    response.headers.set('x-guest-name',   guest.name)
    response.headers.set('x-guest-passes', String(guest.passes))
    response.headers.set('Cache-Control',  'no-store')
    return response
  }

  // ── B. Public routes — pass through ────────────────────────
  if (isPublic(pathname)) {
    return NextResponse.next()
  }

  // ── C. Protected routes — session refresh + auth check ─────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not put any code between createServerClient and getClaims()
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\.ico|sitemap\.xml|robots\.txt|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}