// app/page.tsx — Server Component
// Middleware has already validated the token before this runs.
// Guest data arrives via request headers set by middleware.
// Theme is fetched from Supabase and injected as inline CSS — no flash.

import { headers } from 'next/headers'
import WeddingClient from '@/components/WeddingClient'
import { getPreset, buildThemeCSS, buildFontsUrl } from '@/lib/themes'
import { createClient }  from '@/lib/supabase/server'
const supabase = await createClient()

export default async function WeddingPage() {
  const h = await headers()
  const name   = h.get('x-guest-name')
  const passes = parseInt(h.get('x-guest-passes') ?? '1', 10)
  if (!name) return null

  const {data: themeId, error} = await supabase.rpc('get_active_wedding_theme')
  if(error){
    return null
  }
  console.log(themeId)



  // Fetch the wedding's theme and build CSS server-side — no flash
  const preset   = getPreset(themeId)
  const themeCSS = buildThemeCSS(preset)
  const fontsUrl = buildFontsUrl(preset)

  return (
    <>
      {/* Override layout's default theme with the couple's chosen theme */}
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?${fontsUrl}&display=swap`}
      />
      <WeddingClient guest={{ name, passes }} />
    </>
  )
}