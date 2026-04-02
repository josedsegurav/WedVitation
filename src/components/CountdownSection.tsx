'use client'

import { useEffect, useState } from 'react'
import type { WeddingRow } from '@/lib/types'

function getTimeLeft(weddingDate: Date) {
  const now  = new Date()
  const diff = weddingDate.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

const UNITS = ['Days', 'Hours', 'Min.', 'Sec.'] as const

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

export default function CountdownSection({ wedding }: { wedding?: WeddingRow }) {
  const weddingDate  = wedding?.wedding_date ? new Date(wedding.wedding_date) : new Date()
  const dateDisplay  = wedding?.date_display ?? ''
  const location     = wedding?.location     ?? ''
  const calendarUrl  = wedding?.calendar_url ?? '#'

  const [time, setTime] = useState(getTimeLeft(weddingDate))

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000)
    return () => clearInterval(interval)
  }, [weddingDate.getTime()])

  const values = [pad(time.days), pad(time.hours), pad(time.minutes), pad(time.seconds)]

  return (
    <section className="reveal" id="countdown" style={{ padding: '80px 24px 72px', background: 'var(--gradient-section)' }}>
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>

        <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 10 }}>
          Until Our Big Day
        </p>
        <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-heading)', marginBottom: 6 }}>
          Counting Down With Joy
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 44 }}>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)"/></svg>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 44 }}>
          {UNITS.map((label, i) => (
            <div key={label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '20px 8px 16px',
              background: 'var(--gradient-card)',
              border: '1px solid rgba(var(--color-gold-rgb),0.28)',
              borderRadius: 2,
              boxShadow: '0 2px 16px rgba(var(--color-gold-dark-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
              position: 'relative', overflow: 'hidden',
            }}>
              {(['tl','tr','bl','br'] as const).map(c => (
                <span key={c} style={{
                  position: 'absolute',
                  top:    c.startsWith('t') ? 5 : undefined, bottom: c.startsWith('b') ? 5 : undefined,
                  left:   c.endsWith('l')   ? 5 : undefined, right:  c.endsWith('r')   ? 5 : undefined,
                  width: 8, height: 8,
                  borderTop:    c.startsWith('t') ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
                  borderBottom: c.startsWith('b') ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
                  borderLeft:   c.endsWith('l')   ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
                  borderRight:  c.endsWith('r')   ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
                }}/>
              ))}
              <span className="font-display tabular-nums" style={{
                fontSize: 'clamp(2rem, 6vw, 2.75rem)', lineHeight: 1, fontWeight: 300,
                color: 'var(--color-gold)', letterSpacing: '-0.02em',
              }}>
                {values[i]}
              </span>
              <div style={{ width: 20, height: 1, background: 'rgba(var(--color-gold-rgb),0.35)', margin: '8px 0 6px' }} />
              <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--color-gold-dark)', opacity: 0.8 }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(var(--color-gold-rgb),0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--color-gold)', opacity: 0.7 }}>
            {dateDisplay}{location ? ` · ${location}` : ''}
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(var(--color-gold-rgb),0.3))' }} />
        </div>

        {calendarUrl && calendarUrl !== '#' && (
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="font-body uppercase"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 28px', fontSize: 10, letterSpacing: '0.22em',
              color: 'var(--color-gold-dark)',
              border: '1px solid rgba(var(--color-gold-rgb),0.5)',
              borderRadius: 1, background: 'rgba(var(--color-gold-rgb),0.06)',
              transition: 'background 0.2s, box-shadow 0.2s', textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--color-gold-rgb),0.14)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(var(--color-gold-dark-rgb),0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(var(--color-gold-rgb),0.06)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <CalendarIcon />
            Add to Calendar
          </a>
        )}
      </div>
    </section>
  )
}