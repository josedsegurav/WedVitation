// app/api/wedding/gallery/route.ts
// POST /api/wedding/gallery         — register a new photo after Storage upload
// PUT  /api/wedding/gallery         — reorder photos

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { label: string; src: string; alt: string }
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { data, error } = await supabase.rpc('save_gallery_photo', {
    p_label: body.label,
    p_src:   body.src,
    p_alt:   body.alt ?? body.label,
  })
  if (error) {
    console.error('[POST /api/wedding/gallery]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, id: data }, { status: 201 })
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let ids: string[]
  try { ids = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { error } = await supabase.rpc('reorder_gallery_photos', { p_ids: ids })
  if (error) {
    console.error('[PUT /api/wedding/gallery]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}