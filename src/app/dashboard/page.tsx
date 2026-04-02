// app/dashboard/page.tsx  — Server Component

import { redirect }      from 'next/navigation'
import { createClient }  from '@/lib/supabase/server'
import DashboardClient   from './DashboardClient'
import WeddingSetupForm  from './WeddingSetupForm'
import type { WeddingData } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/auth/login')

  const { data: weddingId } = await supabase.rpc('get_my_wedding_id')

  if (!weddingId) return <WeddingSetupForm />

  const [guestsResult, weddingResult, detailsResult] = await Promise.all([
    supabase.rpc('get_my_guests'),
    supabase.rpc('get_my_wedding'),
    supabase.rpc('get_my_wedding_details'),
  ])

  const guests  = guestsResult.data ?? []
  const wedding = Array.isArray(weddingResult.data)
    ? weddingResult.data[0]
    : weddingResult.data

  // get_my_wedding_details returns a single json scalar
  const initialData = detailsResult.data as WeddingData | null

  return (
    <DashboardClient
      initialGuests   = {guests}
      coupleName      = {wedding?.couple_names  ?? 'Sofia & Marco'}
      initialTemplate = {wedding?.wa_template   ?? ''}
      initialThemeId  = {wedding?.theme_id      ?? 'warm-gold'}
      initialData     = {initialData}
      baseUrl         = {process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wed-vitation.vercel.app'}
    />
  )
}