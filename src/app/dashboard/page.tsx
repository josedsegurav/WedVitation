// app/dashboard/page.tsx  — Server Component

import { redirect }      from 'next/navigation'
import { createClient }  from '@/lib/supabase/server'
import DashboardClient   from './DashboardClient'
import WeddingSetupForm  from './WeddingSetupForm'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  // Resolve wedding
  const { data: weddingId } = await supabase.rpc('get_my_wedding_id')

  // No wedding linked yet — show the onboarding form
  if (!weddingId) {
    return <WeddingSetupForm />
  }

  // Use security-definer functions to bypass RLS with the anon key
  const [guestsResult, weddingResult] = await Promise.all([
    supabase.rpc('get_my_guests'),
    supabase.rpc('get_my_wedding'),
  ])

  const guests  = guestsResult.data  ?? []
  const wedding = Array.isArray(weddingResult.data)
    ? weddingResult.data[0]
    : weddingResult.data

  return (
    <DashboardClient
      initialGuests   = {guests}
      coupleName      = {wedding?.couple_names ?? 'Sofia & Marco'}
      initialTemplate = {wedding?.wa_template  ?? ''}
      initialThemeId  = {wedding?.theme_id     ?? 'warm-gold'}
      baseUrl         = {process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wed-vitation.vercel.app'}
    />
  )
}