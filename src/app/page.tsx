// app/page.tsx — Server Component
// Middleware validates the token and sets x-guest-name / x-guest-passes headers.
// We use the token to fetch the full wedding data in one RPC call,
// then inject the theme CSS server-side so there is zero flash on load.

export const dynamic = 'force-dynamic'

import { headers }      from 'next/headers'
import WeddingClient    from '@/components/WeddingClient'
import { getPreset, buildThemeCSS, buildFontsUrl } from '@/lib/themes'
import type { WeddingData } from '@/lib/types'

async function fetchWeddingData(token: string): Promise<WeddingData | null> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_wedding_data_by_token`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!}`,
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({ p_token: token }),
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('[fetchWeddingData] RPC failed:', res.status, await res.text())
      return null
    }

    const data = await res.json()
    // RPC returns the JSON object directly (scalar json return type)
    if (!data || !data.wedding) return null
    return data as WeddingData
  } catch (e) {
    console.error('[fetchWeddingData] error:', e)
    return null
  }
}

export default async function WeddingPage() {
  const h      = await headers()
  const name   = h.get('x-guest-name')
  const passes = parseInt(h.get('x-guest-passes') ?? '1', 10)
  const token  = h.get('x-guest-token') ?? ''

  if (!name) return null

  const weddingData = token ? await fetchWeddingData(token) : null

  // Theme — fall back to warm-gold if data fetch failed
  const themeId  = weddingData?.wedding.theme_id ?? 'warm-gold'
  const preset   = getPreset(themeId)
  const themeCSS = buildThemeCSS(preset)
  const fontsUrl = buildFontsUrl(preset)

  return (
    <>
      {/* Override layout default theme with couple's chosen theme — no flash */}
      <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      <style dangerouslySetInnerHTML={{
        __html: `@import url('https://fonts.googleapis.com/css2?${fontsUrl}&display=swap');`
      }} />
      <WeddingClient
        guest={{ name, passes }}
        weddingData={weddingData}
      />
    </>
  )
}