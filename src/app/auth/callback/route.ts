// app/auth/callback/route.ts
// Supabase redirects here after the user clicks the magic link.
// Exchanges the one-time code for a session and sets the cookie.
// Then redirects to /dashboard (or the original destination).

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // If there's no code something went wrong with the magic link
  if (!code) {
    console.error('[auth/callback] No code in URL')
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — safe to ignore,
            // middleware will refresh the session on the next request.
          }
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error.message)
    return NextResponse.redirect(`${origin}/auth/login?error=exchange_failed`)
  }

  // Redirect to /dashboard or wherever the user was trying to go
  // Only allow relative paths to prevent open redirect attacks
  const redirectTo = next.startsWith('/') ? next : '/dashboard'
  return NextResponse.redirect(`${origin}${redirectTo}`)
}