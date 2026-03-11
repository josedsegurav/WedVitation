// app/api/guest/route.ts
// Returns { name, passes } for a given ?token= param.
// Wire `db` to Supabase, Prisma, Firebase, etc.

import { NextResponse } from 'next/server'

// ── Replace with your real DB client ──────────────────────────
// import { db } from '@/lib/db'

// Mock data — matches the dashboard seed
const GUESTS: Record<string, { name: string; passes: number }> = {
  tok_elena:   { name: 'Elena Moretti',      passes: 2 },
  tok_luca:    { name: 'Luca Bianchi',       passes: 1 },
  tok_giulia:  { name: 'Giulia Ferrara',     passes: 4 },
  tok_sofia:   { name: 'Sofia Ricci',        passes: 3 },
  tok_pietro:  { name: 'Pietro Romano',      passes: 2 },
  tok_vale:    { name: 'Valentina Esposito', passes: 1 },
  tok_andrea:  { name: 'Andrea Colombo',     passes: 2 },
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  // ── Real DB lookup ─────────────────────────────────────────
  // const guest = await db.guest.findUnique({
  //   where: { token },
  //   select: { name: true, passes: true },
  // })

  const guest = GUESTS[token] ?? null

  if (!guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  return NextResponse.json(guest)
}