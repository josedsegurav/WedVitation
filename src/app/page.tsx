// app/page.tsx — Server Component
// Middleware has already validated the token before this runs.
// Guest data arrives via request headers set by middleware.
// Theme is fetched from Supabase and injected as inline CSS — no flash.

import { headers } from 'next/headers'
import WeddingClient from '@/components/WeddingClient'
import { getPreset, buildThemeCSS, buildFontsUrl } from '@/lib/themes'
import { createClient }  from '@/lib/supabase/server'
const supabase = await createClient()

async function fetchThemeId(): Promise<string> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_active_wedding_theme`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!}`,
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({}),
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('[fetchThemeId] RPC failed:', res.status, await res.text())
      return 'warm-god'
    }

    const data = await res.json()

    // Supabase returns a scalar text as a plain JSON string: "warm-gold"
    // It may also come back as an array ["warm-gold"] depending on version
    if (typeof data === 'string') return data || 'warm-god'
    if (Array.isArray(data))     return (data[0] as string) || 'warm-god'
    return 'warm-god'
  } catch (e) {
    console.error('[fetchThemeId] error:', e)
    return 'warm-god'
  }
}





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