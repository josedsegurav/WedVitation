// app/page.tsx — Server Component
// Middleware has already validated the token before this runs.
// Guest data arrives via request headers set by middleware.
// Theme is fetched from Supabase and injected as inline CSS — no flash.

export const dynamic = 'force-dynamic'

import { headers } from 'next/headers'
import WeddingClient from '@/components/WeddingClient'
import { getPreset, buildThemeCSS, buildFontsUrl } from '@/lib/themes'
import { createClient }  from '@/lib/supabase/server'


export default async function WeddingPage() {
  const supabase = await createClient()
  const h = await headers()
  const name = h.get('x-guest-name')
  const passes = parseInt(h.get('x-guest-passes') ?? '1', 10)

  if (!name) return null

  const { data: themeId, error } = await supabase.rpc('get_active_wedding_theme')
  if (error) {
    return null
  }

  const preset = getPreset(themeId)
  const themeCSS = buildThemeCSS(preset)
  const fontsUrl = buildFontsUrl(preset)

  // Inject font link into <head> via Next.js built-in support
  // and override theme CSS inline — no layout flash
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      <style dangerouslySetInnerHTML={{
        __html: `@import url('https://fonts.googleapis.com/css2?${fontsUrl}&display=swap');`
      }} />
      <WeddingClient guest={{ name, passes }} />
    </>
  )
}


