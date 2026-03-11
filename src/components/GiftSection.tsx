'use client'

import { GIFTS } from '@/app/config'
import { useState } from 'react'

const BANK_ROWS = GIFTS.bank.map(({label, value}) => ({
  label,
  value
}))

console.log(BANK_ROWS)

// Gift box — 28×28px, clean minimal linework
function GiftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="12" width="20" height="13" rx="1" stroke="#C9A96E" strokeWidth="1"/>
      <line x1="4"  y1="16" x2="24" y2="16" stroke="#C9A96E" strokeWidth="0.8"/>
      <line x1="14" y1="12" x2="14" y2="25" stroke="#C9A96E" strokeWidth="0.8"/>
      {/* Ribbon bow — left loop */}
      <path d="M14 12 Q10 8 8 10 Q6 12 10 12Z" stroke="#C9A96E" strokeWidth="0.9" fill="rgba(201,169,110,0.12)"/>
      {/* Ribbon bow — right loop */}
      <path d="M14 12 Q18 8 20 10 Q22 12 18 12Z" stroke="#C9A96E" strokeWidth="0.9" fill="rgba(201,169,110,0.12)"/>
      {/* Knot */}
      <circle cx="14" cy="12" r="1.2" fill="#C9A96E"/>
    </svg>
  )
}

// Envelope — 28×22px
function EnvelopeIcon() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      <rect x="2" y="2" width="24" height="18" rx="1.5" stroke="#C9A96E" strokeWidth="1" fill="rgba(201,169,110,0.06)"/>
      <path d="M2 2 L14 12 L26 2" stroke="#C9A96E" strokeWidth="1" fill="none" strokeLinejoin="round"/>
      <line x1="2"  y1="20" x2="10" y2="13" stroke="#C9A96E" strokeWidth="0.8"/>
      <line x1="26" y1="20" x2="18" y2="13" stroke="#C9A96E" strokeWidth="0.8"/>
    </svg>
  )
}

// Chevron for accordion
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
    >
      <polyline points="2,4 6,8 10,4" stroke="#C9A96E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function GiftSection() {
  const [showBank, setShowBank] = useState(false)

  return (
    <section
      className="reveal"
      id="gifts"
      style={{
        padding: '80px 24px 72px',
        background: 'linear-gradient(180deg, #FAF6F0 0%, #F5EDE0 50%, #FAF6F0 100%)',
      }}
    >
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: '#C9A96E', marginBottom: 10 }}>
            Gifts
          </p>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#2C2C2C', marginBottom: 6 }}>
            Registry
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E"/>
            </svg>
            <div style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
          </div>
          <p className="font-display italic font-light" style={{ fontSize: '1rem', color: '#5C4A2A', opacity: 0.72, lineHeight: 1.7 }}>
            {GIFTS.message}
          </p>
        </div>

        {/* Bank transfer card */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(160deg, rgba(253,248,242,0.95), rgba(245,237,224,0.8))',
            border: '1px solid rgba(201,169,110,0.28)',
            borderRadius: 2,
            boxShadow: '0 2px 16px rgba(139,105,20,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
            marginBottom: 10,
            overflow: 'hidden',
          }}
        >
          {/* Corner accents */}
          {(['tl','tr','bl','br'] as const).map(c => (
            <span key={c} style={{
              position: 'absolute',
              top:    c.startsWith('t') ? 5 : undefined,
              bottom: c.startsWith('b') ? 5 : undefined,
              left:   c.endsWith('l')   ? 5 : undefined,
              right:  c.endsWith('r')   ? 5 : undefined,
              width: 8, height: 8,
              borderTop:    c.startsWith('t') ? '1px solid rgba(201,169,110,0.4)' : undefined,
              borderBottom: c.startsWith('b') ? '1px solid rgba(201,169,110,0.4)' : undefined,
              borderLeft:   c.endsWith('l')   ? '1px solid rgba(201,169,110,0.4)' : undefined,
              borderRight:  c.endsWith('r')   ? '1px solid rgba(201,169,110,0.4)' : undefined,
            }}/>
          ))}

          {/* Accordion trigger */}
          <button
            onClick={() => setShowBank(v => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '18px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <GiftIcon />
            <span className="font-body uppercase" style={{ flex: 1, fontSize: 9, letterSpacing: '0.26em', color: '#8B6914' }}>
              Bank Transfer Details
            </span>
            <Chevron open={showBank} />
          </button>

          {/* Accordion content */}
          <div style={{
            maxHeight: showBank ? 280 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ borderTop: '1px solid rgba(201,169,110,0.2)', paddingTop: 14 }}>
                {BANK_ROWS.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '7px 0',
                      borderBottom: '1px solid rgba(201,169,110,0.1)',
                      gap: 12,
                    }}
                  >
                    <span className="font-body" style={{ fontSize: 10, color: '#8B6914', opacity: 0.65, flexShrink: 0 }}>
                      {item.label}
                    </span>
                    <span className="font-body" style={{ fontSize: 11, color: '#2C2C2C', fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Envelope box card */}
        <div
          style={{
            position: 'relative',
            padding: '22px 24px',
            background: 'linear-gradient(160deg, rgba(253,248,242,0.95), rgba(245,237,224,0.8))',
            border: '1px solid rgba(201,169,110,0.28)',
            borderRadius: 2,
            boxShadow: '0 2px 16px rgba(139,105,20,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            overflow: 'hidden',
          }}
        >
          {(['tl','tr','bl','br'] as const).map(c => (
            <span key={c} style={{
              position: 'absolute',
              top:    c.startsWith('t') ? 5 : undefined,
              bottom: c.startsWith('b') ? 5 : undefined,
              left:   c.endsWith('l')   ? 5 : undefined,
              right:  c.endsWith('r')   ? 5 : undefined,
              width: 8, height: 8,
              borderTop:    c.startsWith('t') ? '1px solid rgba(201,169,110,0.4)' : undefined,
              borderBottom: c.startsWith('b') ? '1px solid rgba(201,169,110,0.4)' : undefined,
              borderLeft:   c.endsWith('l')   ? '1px solid rgba(201,169,110,0.4)' : undefined,
              borderRight:  c.endsWith('r')   ? '1px solid rgba(201,169,110,0.4)' : undefined,
            }}/>
          ))}

          <div style={{ paddingTop: 2, flexShrink: 0 }}>
            <EnvelopeIcon />
          </div>
          <div>
            <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.26em', color: '#C9A96E', marginBottom: 6 }}>
              Envelope Box
            </p>
            <p className="font-display italic font-light" style={{ fontSize: '0.95rem', color: '#5C4A2A', lineHeight: 1.65, opacity: 0.8 }}>
              {GIFTS.envelopeNote}
            </p>
          </div>
        </div>

        {/* Bottom separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#C9A96E', opacity: 0.7 }}>
            With Gratitude
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
        </div>

      </div>
    </section>
  )
}