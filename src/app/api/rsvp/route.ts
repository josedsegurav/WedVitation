// app/api/rsvp/route.ts
//
// POST /api/rsvp
// Body: { token, name, attending: 'yes' | 'no', message? }
//
// Flow:
//   1. Look up guest by token (server client — bypasses RLS)
//   2. Insert row into rsvp_responses
//   3. The trg_sync_guest_status trigger (schema.sql) automatically
//      updates guests.status to 'confirmed' or 'declined'
//   4. Dashboard reads guests.status → shows updated state
//
// The dashboard does NOT need a separate refresh call —
// next time it loads it reads the updated status from Supabase.

import { NextResponse }    from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // ── 1. Parse body ────────────────────────────────────────────
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

  if (!token || !name || !attending) {
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

  // ── 2. Resolve guest by token ────────────────────────────────
  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select('id, wedding_id, name, status')
    .eq('token', token)
    .is('deleted_at', null)
    .single()

  if (guestError || !guest) {
    console.error('[rsvp] guest lookup failed:', guestError?.message)
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  }

  // ── 3. Insert RSVP response ───────────────────────────────────
  // The trg_sync_guest_status trigger fires AFTER INSERT and:
  //   a) marks all previous responses as is_latest = false
  //   b) updates guests.status to 'confirmed' | 'declined'
  const { error: insertError } = await supabase
    .from('rsvp_responses')
    .insert({
      guest_id:       guest.id,
      wedding_id:     guest.wedding_id,
      attending:      attending,          // 'yes' | 'no'
      message:        message.trim(),
      submitted_name: name.trim(),
      is_latest:      true,
    })

  if (insertError) {
    console.error('[rsvp] insert failed:', insertError.message)
    return NextResponse.json(
      { error: 'Failed to save RSVP. Please try again.' },
      { status: 500 }
    )
  }

  // ── 4. Return the resolved status so the client can show it ──
  const newStatus = attending === 'yes' ? 'confirmed' : 'declined'

  return NextResponse.json({
    ok:         true,
    guestName:  guest.name,
    status:     newStatus,   // 'confirmed' | 'declined'
    attending,
  })
}