// app/api/guest/route.ts
// GET /api/guest?token=tok_xxxx
//
// Uses get_guest_by_token() RPC (security definer) to bypass RLS.
// Called by WeddingClient after middleware has already validated the token.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_guest_by_token', {
    p_token: token,
  })

  if (error) {
    console.error('[GET /api/guest]', error.message)
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  // RPC returns array for table-returning functions
  const guest = Array.isArray(data) ? data[0] : data

  if (!guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  return NextResponse.json({ name: guest.name, passes: guest.passes })
}