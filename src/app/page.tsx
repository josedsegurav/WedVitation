'use client'

import { useState, useEffect } from 'react'
import EnvelopeOpener from '@/components/EnvelopeOpener'
import HeroSection from '@/components/HeroSection'
import CountdownSection from '@/components/CountdownSection'
import ParentsSection from '@/components/ParentsSection'
import EventSection from '@/components/EventSection'
import DressCodeSection from '@/components/DressCodeSection'
import GallerySection from '@/components/GallerySection'
import ItinerarySection from '@/components/ItinerarySection'
import GiftSection from '@/components/GiftSection'
import RSVPSection from '@/components/RSVPSection'
import FooterSection from '@/components/FooterSection'
import FloatingRSVP from '@/components/FloatingRSVP'
import PetalParticles from '@/components/PetalParticles'

interface GuestData {
  name: string
  passes: number
}

type Stage =
  | 'checking'
  | 'invalid'
  | 'greeting'
  | 'envelope'
  | 'content'

async function fetchGuest(token: string): Promise<GuestData | null> {
  try {
    const res = await fetch(`/api/guest?token=${token}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function firstName(full: string) {
  return full.split(' ')[0]
}

// ── Locked screen (no token / invalid token) ──────────────────
function LockedScreen() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FAF6F0 0%, #F0E4CA 55%, #EDD9B8 100%)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 360, padding: '0 24px' }}>
        <svg width="32" height="38" viewBox="0 0 32 38" fill="none" style={{ margin: '0 auto 20px', display: 'block' }}>
          <rect x="4" y="17" width="24" height="18" rx="2"
            stroke="#C9A96E" strokeWidth="1.3" fill="rgba(201,169,110,0.08)" />
          <path d="M10 17V11a6 6 0 0112 0v6"
            stroke="#C9A96E" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="26" r="2.5" fill="#C9A96E" opacity="0.6" />
          <line x1="16" y1="28" x2="16" y2="31" stroke="#C9A96E" strokeWidth="1.3" strokeLinecap="round" />
        </svg>

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase',
          color: '#C9A96E', marginBottom: 14,
        }}>
          Private Invitation
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 300,
          color: '#2C2C2C', marginBottom: 16, lineHeight: 1.3,
        }}>
          Sofia & Marco
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
          <svg width="8" height="8" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E" />
          </svg>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic', fontWeight: 300,
          fontSize: '1rem', color: '#5C4A2A', lineHeight: 1.7, opacity: 0.75,
        }}>
          This invitation is personal and requires a unique link.
          Please use the link sent to you directly.
        </p>
      </div>
    </div>
  )
}

// ── Personal greeting overlay ─────────────────────────────────
function GreetingOverlay({ guest, onContinue }: { guest: GuestData; onContinue: () => void }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 120) }, [])

  const handleContinue = () => {
    setLeaving(true)
    setTimeout(onContinue, 700)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 90,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FAF6F0 0%, #F0E4CA 55%, #EDD9B8 100%)',
      opacity: visible && !leaving ? 1 : 0,
      transform: leaving ? 'translateY(-20px)' : 'translateY(0)',
      transition: leaving ? 'opacity 0.7s ease, transform 0.7s ease' : 'opacity 0.8s ease',
    }}>
      {/* ambient glow blobs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[
          { w: 320, x: '10%', y: '15%', op: 0.06 },
          { w: 220, x: '75%', y: '8%',  op: 0.05 },
          { w: 260, x: '80%', y: '65%', op: 0.06 },
          { w: 180, x: '5%',  y: '70%', op: 0.05 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.w, height: c.w, borderRadius: '50%',
            left: c.x, top: c.y,
            background: `radial-gradient(circle, rgba(201,169,110,${c.op}), transparent 70%)`,
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 32px', position: 'relative' }}>

        {/* botanical top */}
        <div style={{ marginBottom: 32, opacity: 0.45 }}>
          <svg width="240" height="28" viewBox="0 0 240 28" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <line x1="0" y1="14" x2="240" y2="14" stroke="#C9A96E" strokeWidth="0.6" />
            {[24, 60, 96, 120, 144, 180, 216].map((x, i) => (
              <g key={i} transform={`translate(${x},14)`}>
                <line x1="0" y1="0" x2="0" y2="-10" stroke="#C9A96E" strokeWidth="0.8" />
                <path d="M0 -5 Q-5 -9 -3 -13 Q-1 -9 0 -5Z" fill="#C9A96E" opacity="0.5" />
                <path d="M0 -5 Q5 -9 3 -13 Q1 -9 0 -5Z"  fill="#C9A96E" opacity="0.5" />
                <rect x="-2" y="-2" width="4" height="4" fill="#C9A96E" opacity="0.45" transform="rotate(45)" />
              </g>
            ))}
          </svg>
        </div>

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase',
          color: '#C9A96E', marginBottom: 16,
        }}>
          You are warmly invited
        </p>

        <h1 style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: 'clamp(3rem, 10vw, 4.8rem)',
          lineHeight: 1.1, marginBottom: 8,
          background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #8B6914 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {firstName(guest.name)}
        </h1>

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: '#8B6914', opacity: 0.55, marginBottom: 24,
        }}>
          {guest.name}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E" />
          </svg>
          <div style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          color: '#5C4A2A', lineHeight: 1.85, marginBottom: 10, opacity: 0.9,
        }}>
          With great joy, Sofia & Marco request the pleasure of your company
          <br />to celebrate their wedding day.
        </p>

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 11, letterSpacing: '0.1em',
          color: '#8B6914', opacity: 0.7, marginBottom: 40,
        }}>
          {guest.passes === 1
            ? 'Your place has been reserved for you.'
            : `${guest.passes} places have been reserved in your honour.`}
        </p>

        <button
          onClick={handleContinue}
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
            cursor: 'pointer', border: 'none', padding: '14px 36px', borderRadius: 1,
            background: 'linear-gradient(135deg, #C9A96E, #8B6914)',
            color: '#FAF6F0',
            boxShadow: '0 6px 24px rgba(139,105,20,0.28)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Open your invitation
        </button>

        {/* botanical bottom */}
        <div style={{ marginTop: 36, opacity: 0.45 }}>
          <svg width="240" height="28" viewBox="0 0 240 28" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <line x1="0" y1="14" x2="240" y2="14" stroke="#C9A96E" strokeWidth="0.6" />
            {[24, 60, 96, 120, 144, 180, 216].map((x, i) => (
              <g key={i} transform={`translate(${x},14)`}>
                <line x1="0" y1="0" x2="0" y2="10" stroke="#C9A96E" strokeWidth="0.8" />
                <path d="M0 5 Q-5 9 -3 13 Q-1 9 0 5Z" fill="#C9A96E" opacity="0.5" />
                <path d="M0 5 Q5 9 3 13 Q1 9 0 5Z"  fill="#C9A96E" opacity="0.5" />
                <rect x="-2" y="-2" width="4" height="4" fill="#C9A96E" opacity="0.45" transform="rotate(45)" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────
export default function WeddingPage() {
  const [stage,       setStage]       = useState<Stage>('checking')
  const [guest,       setGuest]       = useState<GuestData | null>(null)
  const [showContent, setShowContent] = useState(false)

  // 1. Validate token on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    if (!token) { setStage('invalid'); return }
    fetchGuest(token).then(data => {
      if (data) { setGuest(data); setStage('greeting') }
      else        { setStage('invalid') }
    })
  }, [])

  // 2. Scroll-reveal (only once content is showing)
  useEffect(() => {
    if (!showContent) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [showContent])

  if (stage === 'checking') return null
  if (stage === 'invalid')  return <LockedScreen />

  if (stage === 'greeting') {
    return <GreetingOverlay guest={guest!} onContinue={() => setStage('envelope')} />
  }

  if (stage === 'envelope') {
    return (
      <EnvelopeOpener
        onOpen={() => {
          setStage('content')
          setTimeout(() => setShowContent(true), 800)
        }}
      />
    )
  }

  // stage === 'content'
  return (
    <div style={{ minHeight: '100vh', opacity: showContent ? 1 : 0, transition: 'opacity 1s ease' }}>
      <PetalParticles />
      <HeroSection />
      <CountdownSection />
      <ParentsSection />
      <EventSection />
      <DressCodeSection />
      <GallerySection />
      <ItinerarySection />
      <GiftSection />
      <RSVPSection />
      <FooterSection />
      <FloatingRSVP />
    </div>
  )
}