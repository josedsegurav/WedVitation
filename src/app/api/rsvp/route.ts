// app/api/rsvp/route.ts
//
// POST /api/rsvp
// Body: { token, name, attending: 'yes' | 'no', message? }
//
// Uses the submit_rsvp() Postgres function (security definer) which:
// - looks up the guest by token (bypasses RLS)
// - inserts the rsvp_response row
// - updates guest.status to confirmed/declined
// - returns { ok, guestName, attending, status }
//
// Guests are never logged in so we use the browser client pattern
// (anon key) — the function itself handles auth via security definer.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  let body: {
    token:     string
    name:      string
    attending: 'yes' | 'no'
    message?:  string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { token, name, attending, message = '' } = body

  if (!token?.trim() || !name?.trim() || !attending) {
    return NextResponse.json(
      { error: 'Missing required fields: token, name, attending' },
      { status: 400 }
    )
  }

  if (attending !== 'yes' && attending !== 'no') {
    return NextResponse.json(
      { error: 'attending must be "yes" or "no"' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('submit_rsvp', {
    p_token:     token.trim(),
    p_name:      name.trim(),
    p_attending: attending,
    p_message:   message.trim(),
  })

  if (error) {
    console.error('[POST /api/rsvp]', error.message)

    if (error.message.includes('invalid_token')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to save RSVP. Please try again.' },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}