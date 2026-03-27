// app/api/guests/route.ts
// GET  /api/guests  → list via get_my_guests() RPC
// POST /api/guests  → create via create_guest() RPC

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_my_guests')

  if (error) {
    console.error('[GET /api/guests]', error.message)
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  let body: { name: string; phone: string; email?: string; passes: number }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, phone, passes, email = '' } = body

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: 'name and phone are required' }, { status: 400 })
  }

  if (!Number.isInteger(passes) || passes < 1 || passes > 20) {
    return NextResponse.json({ error: 'passes must be an integer between 1 and 20' }, { status: 400 })
  }

  const token = 'tok_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('create_guest', {
    p_name:   name.trim(),
    p_phone:  phone.replace(/\D/g, ''),
    p_email:  email.trim(),
    p_passes: passes,
    p_token:  token,
    p_color:  color,
  })

  if (error) {
    console.error('[POST /api/guests]', error.message)
    console.log(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }

  // rpc returns an array for table-returning functions
  const guest = Array.isArray(data) ? data[0] : data
  return NextResponse.json(guest, { status: 201 })
}

const COLORS = [
  '#C9A96E','#A0896A','#B8956A','#C4A882',
  '#9A7A5A','#8B7355','#BFA882','#A08060',
]