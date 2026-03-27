'use client'

import { useEffect, useState } from 'react'
import { WEDDING, CALENDAR_URL } from '@/app/config'


const WEDDING_DATE = new Date(WEDDING.dateISO)

function getTimeLeft() {
  const now = new Date()
  const diff = WEDDING_DATE.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

const UNITS = ['Days', 'Hours', 'Min.', 'Sec.'] as const

// Thin calendar icon — pure SVG, no emoji
function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="14" height="12" rx="1.5"/>
      <line x1="1" y1="7" x2="15" y2="7"/>
      <line x1="5" y1="1" x2="5" y2="5"/>
      <line x1="11" y1="1" x2="11" y2="5"/>
    </svg>
  )
}

export default function CountdownSection() {
  const [time, setTime] = useState(getTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  const values = [pad(time.days), pad(time.hours), pad(time.minutes), pad(time.seconds)]

  return (
    <section
      className="reveal"
      id="countdown"
      style={{
        padding: '80px 24px 72px',
        background: 'var(--gradient-section)',
      }}
    >
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>

        {/* Section header */}
        <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 10 }}>
          Until Our Big Day
        </p>
        <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-heading)', marginBottom: 6 }}>
          Counting Down With Joy
        </h2>

        {/* Ornamental rule */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 44 }}>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)"/>
          </svg>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
        </div>

        {/* Countdown boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 44 }}>
          {UNITS.map((label, i) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 8px 16px',
                background: 'var(--gradient-card)',
                border: '1px solid rgba(var(--color-gold-rgb),0.28)',
                borderRadius: 2,
                boxShadow: '0 2px 16px rgba(var(--color-gold-dark-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Corner accent marks */}
              <span style={{
                position: 'absolute', top: 5, left: 5,
                width: 8, height: 8,
                borderTop: '1px solid rgba(var(--color-gold-rgb),0.4)',
                borderLeft: '1px solid rgba(var(--color-gold-rgb),0.4)',
              }}/>
              <span style={{
                position: 'absolute', top: 5, right: 5,
                width: 8, height: 8,
                borderTop: '1px solid rgba(var(--color-gold-rgb),0.4)',
                borderRight: '1px solid rgba(var(--color-gold-rgb),0.4)',
              }}/>
              <span style={{
                position: 'absolute', bottom: 5, left: 5,
                width: 8, height: 8,
                borderBottom: '1px solid rgba(var(--color-gold-rgb),0.4)',
                borderLeft: '1px solid rgba(var(--color-gold-rgb),0.4)',
              }}/>
              <span style={{
                position: 'absolute', bottom: 5, right: 5,
                width: 8, height: 8,
                borderBottom: '1px solid rgba(var(--color-gold-rgb),0.4)',
                borderRight: '1px solid rgba(var(--color-gold-rgb),0.4)',
              }}/>

              {/* Number */}
              <span
                className="font-display tabular-nums"
                style={{
                  fontSize: 'clamp(2rem, 6vw, 2.75rem)',
                  lineHeight: 1,
                  fontWeight: 300,
                  color: 'var(--color-gold)',
                  letterSpacing: '-0.02em',
                }}
              >
                {values[i]}
              </span>

              {/* Thin rule */}
              <div style={{ width: 20, height: 1, background: 'rgba(var(--color-gold-rgb),0.35)', margin: '8px 0 6px' }} />

              {/* Label */}
              <span
                className="font-body uppercase"
                style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--color-gold-dark)', opacity: 0.8 }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Separator between counter and CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(var(--color-gold-rgb),0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--color-gold)', opacity: 0.7 }}>
            {WEDDING.dateDisplay} · {WEDDING.location}
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(var(--color-gold-rgb),0.3))' }} />
        </div>

        {/* Calendar CTA */}
        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body uppercase"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '11px 28px',
            fontSize: 10,
            letterSpacing: '0.22em',
            color: 'var(--color-gold-dark)',
            border: '1px solid rgba(var(--color-gold-rgb),0.5)',
            borderRadius: 1,
            background: 'rgba(var(--color-gold-rgb),0.06)',
            transition: 'background 0.2s, box-shadow 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.background = 'rgba(var(--color-gold-rgb),0.14)'
            el.style.boxShadow = '0 4px 18px rgba(var(--color-gold-dark-rgb),0.12)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.background = 'rgba(var(--color-gold-rgb),0.06)'
            el.style.boxShadow = 'none'
          }}
        >
          <CalendarIcon />
          Add to Calendar
        </a>

      </div>
    </section>
  )
}
