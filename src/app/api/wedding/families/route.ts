import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown[]
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const { error } = await supabase.rpc('save_families', { p_families: body })
  if (error) { console.error('[POST /api/wedding/families]', error.message); return NextResponse.json({ error: error.message }, { status: 500 }) }
  return NextResponse.json({ ok: true })
}