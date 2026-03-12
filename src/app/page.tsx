// app/page.tsx — Server Component
// Middleware has already validated the token before this runs.
// Guest data arrives via request headers set by middleware.
import { headers } from 'next/headers'
import WeddingClient from '@/components/WeddingClient'

export default async function WeddingPage() {
  const h = await headers()
  const name   = h.get('x-guest-name')
  const passes = parseInt(h.get('x-guest-passes') ?? '1', 10)

  // If somehow reached without middleware headers, send to locked
  // (middleware should handle this before we get here)
  if (!name) return null

  return <WeddingClient guest={{ name, passes }} />
}