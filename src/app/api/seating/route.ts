// app/api/seating/route.ts
// POST /api/seating  → save full seating state via save_seating() RPC

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  let body: {
    tables:     { id: string; name: string; seats: number; x: number; y: number }[]
    assign:     Record<string, string[]>
    unassigned: string[]
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase.rpc('save_seating', {
    p_payload: body,
  })

  if (error) {
    console.error('[POST /api/seating]', error.message)
    return NextResponse.json({ error: 'Failed to save seating' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}