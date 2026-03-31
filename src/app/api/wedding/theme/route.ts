// app/api/wedding/theme/route.ts
// POST /api/wedding/theme  — saves the chosen theme_id to the weddings row

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { theme_id: string }
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { theme_id } = body
  if (!theme_id?.trim()) return NextResponse.json({ error: 'theme_id is required' }, { status: 400 })

  const { error } = await supabase.rpc('save_wedding_theme', { p_theme_id: theme_id })

  if (error) {
    console.error('[POST /api/wedding/theme]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}