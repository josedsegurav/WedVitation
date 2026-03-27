// app/api/guests/[id]/route.ts
// DELETE /api/guests/:id  → soft-delete via delete_guest() RPC

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Missing guest id' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: deleted, error } = await supabase.rpc('delete_guest', {
    p_guest_id: id,
  })

  if (error) {
    console.error('[DELETE /api/guests/:id]', error.message)
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 })
  }

  if (!deleted) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}