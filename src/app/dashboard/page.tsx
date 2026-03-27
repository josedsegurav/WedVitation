// app/dashboard/page.tsx  — Server Component

import { redirect }     from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient  from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  // Resolve wedding
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
            fontWeight: 300, color: '#2C2C2C', marginBottom: 12, lineHeight: 1.5 }}>
            Your account is not linked to a wedding yet.
          </p>
          <p style={{ fontSize: 12, color: '#5C4A2A', opacity: 0.7, lineHeight: 1.6 }}>
            Run the seed insert in Supabase SQL Editor to link your
            user to the wedding row. See the setup guide for details.
          </p>
        </div>
      </div>
    )
  }

  // Use security-definer functions to bypass RLS with the anon key
  const [guestsResult, weddingResult] = await Promise.all([
    supabase.rpc('get_my_guests'),
    supabase
      .from('weddings')
      .select('couple_names, wa_template')
      .eq('id', weddingId)
      .single(),
  ])

  const guests  = guestsResult.data  ?? []
  const wedding = weddingResult.data

  return (
    <DashboardClient
      initialGuests   = {guests}
      coupleName      = {wedding?.couple_names ?? 'Sofia & Marco'}
      initialTemplate = {wedding?.wa_template  ?? ''}
      baseUrl         = {process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wed-vitation.vercel.app'}
    />
  )
}