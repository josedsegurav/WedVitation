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

type Stage = 'greeting' | 'envelope' | 'content'

function firstName(full: string) {
  return full.split(' ')[0]
}

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
      background: 'var(--gradient-section)',
      opacity: visible && !leaving ? 1 : 0,
      transform: leaving ? 'translateY(-20px)' : 'translateY(0)',
      transition: leaving ? 'opacity 0.7s ease, transform 0.7s ease' : 'opacity 0.8s ease',
      fontFamily: "'Jost', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400&family=Great+Vibes&display=swap');
      `}</style>

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
            background: `radial-gradient(circle, rgba(var(--color-gold-rgb),${c.op}), transparent 70%)`,
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 32px', position: 'relative' }}>

        {/* botanical top */}
        <div style={{ marginBottom: 32, opacity: 0.45 }}>
          <svg width="240" height="28" viewBox="0 0 240 28" fill="none"
            style={{ margin: '0 auto', display: 'block' }}>
            <line x1="0" y1="14" x2="240" y2="14" stroke="var(--color-gold)" strokeWidth="0.6" />
            {[24, 60, 96, 120, 144, 180, 216].map((x, i) => (
              <g key={i} transform={`translate(${x},14)`}>
                <line x1="0" y1="0" x2="0" y2="-10" stroke="var(--color-gold)" strokeWidth="0.8" />
                <path d="M0 -5 Q-5 -9 -3 -13 Q-1 -9 0 -5Z" fill="var(--color-gold)" opacity="0.5" />
                <path d="M0 -5 Q5 -9 3 -13 Q1 -9 0 -5Z" fill="var(--color-gold)" opacity="0.5" />
                <rect x="-2" y="-2" width="4" height="4" fill="var(--color-gold)" opacity="0.45" transform="rotate(45)" />
              </g>
            ))}
          </svg>
        </div>

        <p style={{ fontSize: 10, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 16 }}>
          You are warmly invited
        </p>

        {/* Guest name */}
        <h1 style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: 'clamp(3rem, 10vw, 4.8rem)',
          lineHeight: 1.1, marginBottom: 8,
          background: 'var(--gradient-gold)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          padding: '5px 0'
        }}>
          {firstName(guest.name)}
        </h1>

        <p style={{
          fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--color-gold-dark)', opacity: 0.55, marginBottom: 24,
        }}>
          {guest.name}
        </p>

        {/* ornamental rule */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)" />
          </svg>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          color: 'var(--color-body)', lineHeight: 1.85, marginBottom: 10, opacity: 0.9,
        }}>
          With great joy, Sofia &amp; Marco request the pleasure of your company
          <br />to celebrate their wedding day.
        </p>

        <p style={{ fontSize: 11, letterSpacing: '0.1em', color: 'var(--color-gold-dark)', opacity: 0.7, marginBottom: 40 }}>
          {guest.passes === 1
            ? 'Your place has been reserved for you.'
            : `${guest.passes} places have been reserved in your honour.`}
        </p>

        <button
          onClick={handleContinue}
          style={{
            fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
            cursor: 'pointer', border: 'none', padding: '14px 36px', borderRadius: 1,
            background: 'var(--gradient-gold-btn)',
            color: 'var(--color-btn-text)', fontFamily: 'inherit',
            boxShadow: '0 6px 24px rgba(var(--color-gold-dark-rgb),0.28)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Open your invitation
        </button>

        {/* botanical bottom */}
        <div style={{ marginTop: 36, opacity: 0.45 }}>
          <svg width="240" height="28" viewBox="0 0 240 28" fill="none"
            style={{ margin: '0 auto', display: 'block' }}>
            <line x1="0" y1="14" x2="240" y2="14" stroke="var(--color-gold)" strokeWidth="0.6" />
            {[24, 60, 96, 120, 144, 180, 216].map((x, i) => (
              <g key={i} transform={`translate(${x},14)`}>
                <line x1="0" y1="0" x2="0" y2="10" stroke="var(--color-gold)" strokeWidth="0.8" />
                <path d="M0 5 Q-5 9 -3 13 Q-1 9 0 5Z" fill="var(--color-gold)" opacity="0.5" />
                <path d="M0 5 Q5 9 3 13 Q1 9 0 5Z" fill="var(--color-gold)" opacity="0.5" />
                <rect x="-2" y="-2" width="4" height="4" fill="var(--color-gold)" opacity="0.45" transform="rotate(45)" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function WeddingClient({ guest }: { guest: GuestData }) {
  const [stage,       setStage]       = useState<Stage>('greeting')
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (!showContent) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [showContent])

  if (stage === 'greeting') {
    return <GreetingOverlay guest={guest} onContinue={() => setStage('envelope')} />
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
