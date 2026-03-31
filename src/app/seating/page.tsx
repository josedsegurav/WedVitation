// app/seating/page.tsx — Server Component
// 1. Verifies session
// 2. Fetches full seating state via get_my_seating() RPC
// 3. Passes initial data to SeatingClient

import { redirect }     from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SeatingClient    from './SeatingClient'

export default async function SeatingPage() {
  const supabase = await createClient()

  // ── 1. Verify session ──────────────────────────────────────
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  // ── 2. Resolve wedding ─────────────────────────────────────
  const { data: weddingId } = await supabase.rpc('get_my_wedding_id')

  if (!weddingId) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: "'Jost', sans-serif",
        background: 'linear-gradient(160deg, #FAF6F0 0%, #F0E4CA 55%, #EDD9B8 100%)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: '0 24px' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#C9A96E', marginBottom: 12 }}>Setup Required</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem',
            fontWeight: 300, color: '#2C2C2C', lineHeight: 1.5 }}>
            Your account is not linked to a wedding yet.
          </p>
        </div>
      </div>
    )
  }

  // ── 3. Fetch seating state + wedding name ──────────────────
  const [seatingResult, weddingResult] = await Promise.all([
    supabase.rpc('get_my_seating'),
    supabase.rpc('get_my_wedding'),
  ])
console.log(weddingResult.data)
  // get_my_seating returns a single JSON object
  const raw      = seatingResult.data as {
    tables:  { id: string; name: string; seats: number; x: number; y: number }[]
    assign:  Record<string, string[]>
    guests:  { id: string; name: string; passes: number; color: string }[]
  } | null

  const tables     = raw?.tables  ?? []
  const assign     = raw?.assign  ?? {}
  const guests     = raw?.guests  ?? []

  // Unassigned = guests not present in any table's assignment array
  const assignedIds = new Set(Object.values(assign).flat())
  const unassigned  = guests.filter(g => !assignedIds.has(g.id)).map(g => g.id)

  const wedding = Array.isArray(weddingResult.data)
    ? weddingResult.data[0]
    : weddingResult.data

  return (
    <SeatingClient
      initialTables     = {tables}
      initialAssign     = {assign}
      initialGuests     = {guests}
      initialUnassigned = {unassigned}
      coupleName        = {wedding?.couple_names ?? 'Sofia & Marco'}
      venueLabel        = {wedding?.venue_label  ?? 'Banquet Hall'}
    />
  )
}