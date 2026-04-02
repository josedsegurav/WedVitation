// app/api/wedding/gallery/[id]/route.ts
// DELETE /api/wedding/gallery/[id]  — remove photo from DB (Storage handled client-side)
// PATCH  /api/wedding/gallery/[id]  — update photo label

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const { error } = await supabase.rpc('delete_gallery_photo', { p_photo_id: id })
  if (error) {
    console.error('[DELETE /api/wedding/gallery]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  let body: { label: string }
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { error } = await supabase.rpc('update_gallery_photo_label', {
    p_photo_id: id,
    p_label:    body.label,
  })
  if (error) {
    console.error('[PATCH /api/wedding/gallery]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}