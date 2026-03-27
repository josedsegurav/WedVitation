'use client'

import { useEffect, useState } from 'react'

// ─── Shape of what the API returns ───────────────────────────
interface GuestData {
  name: string      // "Elena Moretti"
  passes: number    // 2
}

type State =
  | { status: 'loading' }
  | { status: 'ready';   guest: GuestData }
  | { status: 'invalid' }        // token not found
  | { status: 'no-token' }       // no ?token= in URL (dev / direct access)

// ─── How to fetch guest data from your token ─────────────────
//
// Option A — API route (recommended for Next.js)
//   Create: app/api/guest/route.ts
//
//   export async function GET(req: Request) {
//     const token = new URL(req.url).searchParams.get('token')
//     const guest = await db.guest.findUnique({ where: { token } })
//     if (!guest) return Response.json({ error: 'not found' }, { status: 404 })
//     return Response.json({ name: guest.name, passes: guest.passes })
//   }
//
//   Then in this component, fetchGuest calls:
//   fetch(`/api/guest?token=${token}`)
//
// Option B — embed data at build time via middleware
//   In middleware.ts, read the token, look up the guest in DB,
//   and inject it as a cookie or header for the page to consume.
//
// For now, the component uses Option A with a mock fallback.
// ─────────────────────────────────────────────────────────────

const MOCK_GUESTS: Record<string, GuestData> = {
  tok_elena:   { name: 'Elena Moretti',      passes: 2 },
  tok_luca:    { name: 'Luca Bianchi',       passes: 1 },
  tok_giulia:  { name: 'Giulia Ferrara',     passes: 4 },
  tok_sofia:   { name: 'Sofia Ricci',        passes: 3 },
  tok_pietro:  { name: 'Pietro Romano',      passes: 2 },
  tok_vale:    { name: 'Valentina Esposito', passes: 1 },
  tok_andrea:  { name: 'Andrea Colombo',     passes: 2 },
}

async function fetchGuest(token: string): Promise<GuestData | null> {
  try {
    // ── Real call ──────────────────────────────────────────
    // const res = await fetch(`/api/guest?token=${token}`)
    // if (!res.ok) return null
    // return res.json()
    // ──────────────────────────────────────────────────────

    // Mock — remove once API is wired
    await new Promise(r => setTimeout(r, 400))
    return MOCK_GUESTS[token] ?? null
  } catch {
    return null
  }
}

// ─── Greeting copy ────────────────────────────────────────────
function firstName(full: string) {
  return full.split(' ')[0]
}

function passesLine(passes: number) {
  if (passes === 1) return 'Your place has been reserved for you.'
  return `${passes} places have been reserved in your honour.`
}

// ─── Component ────────────────────────────────────────────────
export default function GuestGreeting() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')

    if (!token) {
      setState({ status: 'no-token' })
      return
    }

    fetchGuest(token).then(guest => {
      if (guest) {
        setState({ status: 'ready', guest })
        // slight delay so the envelope opener has time to lift
        setTimeout(() => setVisible(true), 200)
      } else {
        setState({ status: 'invalid' })
      }
    })
  }, [])

  // ── Nothing to show without a token (dev / direct access) ──
  if (state.status === 'no-token' || state.status === 'loading') return null

  // ── Token found but guest doesn't exist ─────────────────────
  if (state.status === 'invalid') {
    return (
      <div style={{
        padding: '48px 24px',
        textAlign: 'center',
        background: 'var(--gradient-footer)',
      }}>
        <p className="font-body uppercase" style={{
          fontSize: 10, letterSpacing: '0.3em', color: 'var(--color-gold)', marginBottom: 12,
        }}>
          Invitation
        </p>
        <p className="font-display italic font-light" style={{
          fontSize: '1.1rem', color: 'var(--color-body)', opacity: 0.7,
        }}>
          This invitation link is not valid or has already been used.
        </p>
      </div>
    )
  }

  // ── Happy path ───────────────────────────────────────────────
  const { guest } = state

  return (
    <section
      style={{
        padding: '72px 24px 56px',
        background: 'var(--gradient-section)',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* Botanical ornament — top */}
        <div style={{ marginBottom: 28, opacity: 0.5 }}>
          <svg width="200" height="24" viewBox="0 0 200 24" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <line x1="0" y1="12" x2="200" y2="12" stroke="var(--color-gold)" strokeWidth="0.6" />
            {[20, 50, 80, 100, 120, 150, 180].map((x, i) => (
              <g key={i} transform={`translate(${x},12)`}>
                <line x1="0" y1="0" x2="0" y2="-8" stroke="var(--color-gold)" strokeWidth="0.8" />
                <path d="M0 -4 Q-4 -7 -2 -10 Q-1 -7 0 -4Z" fill="var(--color-gold)" opacity="0.5" />
                <path d="M0 -4 Q4 -7 2 -10 Q1 -7 0 -4Z"  fill="var(--color-gold)" opacity="0.5" />
                <rect x="-1.5" y="-1.5" width="3" height="3" fill="var(--color-gold)" opacity="0.4" transform="rotate(45)" />
              </g>
            ))}
          </svg>
        </div>

        {/* Eyebrow */}
        <p className="font-body uppercase" style={{
          fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 16,
        }}>
          Dear Guest
        </p>

        {/* Guest name — the centrepiece */}
        <h1
          className="font-script"
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 4rem)',
            lineHeight: 1.1,
            marginBottom: 20,
            background: 'var(--gradient-gold)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {firstName(guest.name)}
        </h1>

        {/* Ornamental rule */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, marginBottom: 20,
        }}>
          <div style={{ width: 56, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)" />
          </svg>
          <div style={{ width: 56, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
        </div>

        {/* Greeting body */}
        <p className="font-display italic font-light" style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          color: 'var(--color-body)',
          lineHeight: 1.8,
          marginBottom: 10,
          opacity: 0.9,
        }}>
          With great joy, we invite you to share in the celebration
          <br />of our wedding day.
        </p>

        {/* Passes line */}
        <p className="font-body" style={{
          fontSize: 12,
          letterSpacing: '0.08em',
          color: 'var(--color-gold-dark)',
          opacity: 0.75,
          marginBottom: 28,
        }}>
          {passesLine(guest.passes)}
        </p>

        {/* Full name (subtle, below first name) */}
        <p className="font-body uppercase" style={{
          fontSize: 9,
          letterSpacing: '0.3em',
          color: 'var(--color-gold)',
          opacity: 0.6,
        }}>
          {guest.name}
        </p>

        {/* Botanical ornament — bottom */}
        <div style={{ marginTop: 28, opacity: 0.5 }}>
          <svg width="200" height="24" viewBox="0 0 200 24" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <line x1="0" y1="12" x2="200" y2="12" stroke="var(--color-gold)" strokeWidth="0.6" />
            {[20, 50, 80, 100, 120, 150, 180].map((x, i) => (
              <g key={i} transform={`translate(${x},12)`}>
                <line x1="0" y1="0" x2="0" y2="8" stroke="var(--color-gold)" strokeWidth="0.8" />
                <path d="M0 4 Q-4 7 -2 10 Q-1 7 0 4Z" fill="var(--color-gold)" opacity="0.5" />
                <path d="M0 4 Q4 7 2 10 Q1 7 0 4Z"  fill="var(--color-gold)" opacity="0.5" />
                <rect x="-1.5" y="-1.5" width="3" height="3" fill="var(--color-gold)" opacity="0.4" transform="rotate(45)" />
              </g>
            ))}
          </svg>
        </div>

      </div>
    </section>
  )
}
