// app/api/wedding/setup/route.ts
//
// POST /api/wedding/setup
//
// Creates a new wedding row, links the authenticated user as owner,
// and returns the new wedding id.
//
// Body: {
//   bride_name, groom_name, wedding_date,
//   ceremony_venue, ceremony_address, ceremony_time,
//   reception_venue, reception_address, reception_time
// }

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Must be authenticated
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    bride_name:        string
    groom_name:        string
    wedding_date:      string
    ceremony_venue:    string
    ceremony_address:  string
    ceremony_time:     string
    reception_venue:   string
    reception_address: string
    reception_time:    string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    bride_name, groom_name, wedding_date,
    ceremony_venue, ceremony_address, ceremony_time = '11:00',
    reception_venue, reception_address = '', reception_time = '15:00',
  } = body

  // Basic validation
  if (!bride_name?.trim())    return NextResponse.json({ error: 'bride_name is required' },    { status: 400 })
  if (!groom_name?.trim())    return NextResponse.json({ error: 'groom_name is required' },    { status: 400 })
  if (!wedding_date?.trim())  return NextResponse.json({ error: 'wedding_date is required' },  { status: 400 })
  if (!ceremony_venue?.trim()) return NextResponse.json({ error: 'ceremony_venue is required' }, { status: 400 })
  if (!ceremony_address?.trim()) return NextResponse.json({ error: 'ceremony_address is required' }, { status: 400 })
  if (!reception_venue?.trim()) return NextResponse.json({ error: 'reception_venue is required' }, { status: 400 })

  const coupleNames = `${bride_name.trim()} & ${groom_name.trim()}`
  const monogram    = `${bride_name.trim()[0]} & ${groom_name.trim()[0]}`

  // Build a default WhatsApp template
  const waTemplate = `Hello {name}! 🌸\n\nWe joyfully invite you to our wedding, ${coupleNames}.\n\nYou have {passes} pass(es) reserved.\n\nKindly confirm your attendance here:\n{link}\n\nWith love ❤️`

  // ── Insert the wedding row ─────────────────────────────────
  // Uses the security-definer RPC so the anon key can write to `weddings`.
  // If you don't have this RPC yet, see the SQL migration below.
  const { data: weddingData, error: weddingError } = await supabase.rpc('create_wedding', {
    p_bride_name:        bride_name.trim(),
    p_groom_name:        groom_name.trim(),
    p_couple_names:      coupleNames,
    p_monogram:          monogram,
    p_wedding_date:      wedding_date,
    p_ceremony_venue:    ceremony_venue.trim(),
    p_ceremony_address:  ceremony_address.trim(),
    p_ceremony_time:     ceremony_time,
    p_reception_venue:   reception_venue.trim(),
    p_reception_address: reception_address.trim(),
    p_reception_time:    reception_time,
    p_wa_template:       waTemplate,
  })

  if (weddingError) {
    console.error('[POST /api/wedding/setup] rpc error:', weddingError.message)
    return NextResponse.json({ error: weddingError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, weddingId: weddingData }, { status: 201 })
}