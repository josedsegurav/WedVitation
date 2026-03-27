// app/api/guest/route.ts
// GET /api/guest?token=tok_xxxx
//
// Called by the invitation page (WeddingClient) to get guest data
// after the middleware has already validated the token.
// Uses the server client — the session cookie is not required here
// since guests are never logged in. The anon key + RLS allows
// reading a guest row when the token matches.

import { NextResponse }  from 'next/server'
import { createClient }  from '@/lib/supabase/server'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: guest, error } = await supabase
    .from('guests')
    .select('name, passes')
    .eq('token', token)
    .is('deleted_at', null)
    .single()

  if (error || !guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  return NextResponse.json({ name: guest.name, passes: guest.passes })
}