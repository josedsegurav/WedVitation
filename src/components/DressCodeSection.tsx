'use client'

import { DRESS_CODE } from '@/app/config';

const FORBIDDEN = DRESS_CODE.reservedColors;
// Tuxedo jacket — clean 40×44px linework
function TuxedoIcon() {
  return (
    <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
      {/* Left lapel */}
      <path d="M20 8 L10 20 L14 20 L20 30" stroke="#C9A96E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Right lapel */}
      <path d="M20 8 L30 20 L26 20 L20 30" stroke="#C9A96E" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Jacket body */}
      <path d="M10 20 L6 44 H34 L30 20" stroke="#C9A96E" strokeWidth="1.1" fill="rgba(201,169,110,0.06)" strokeLinejoin="round"/>
      {/* Bow tie */}
      <path d="M16 12 L20 15 L24 12 L20 9 Z" stroke="#C9A96E" strokeWidth="0.9" fill="rgba(201,169,110,0.2)"/>
      {/* Centre button line */}
      <line x1="20" y1="30" x2="20" y2="42" stroke="#C9A96E" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5"/>
      {/* Pocket square hint */}
      <path d="M26 24 L30 24 L29 20" stroke="#C9A96E" strokeWidth="0.7" fill="rgba(201,169,110,0.15)" opacity="0.6"/>
    </svg>
  )
}

export default function DressCodeSection() {
  return (
    <section
      className="reveal"
      style={{
        padding: '80px 24px 72px',
        background: 'linear-gradient(180deg, #1C1C1C 0%, #242424 50%, #1C1C1C 100%)',
      }}
    >
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>

        {/* Eyebrow */}
        <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: '#C9A96E', marginBottom: 10 }}>
          Attire
        </p>

        <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#F5EDE0', marginBottom: 6 }}>
          Dress Code
        </h2>

        {/* Ornamental rule — same star as other sections, inverted context */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E"/>
          </svg>
          <div style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
        </div>

        {/* Card — dark variant of the shared card style */}
        <div
          style={{
            position: 'relative',
            padding: '36px 32px 32px',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
            border: '1px solid rgba(201,169,110,0.22)',
            borderRadius: 2,
            boxShadow: '0 2px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
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
              borderTop:    c.startsWith('t') ? '1px solid rgba(201,169,110,0.35)' : undefined,
              borderBottom: c.startsWith('b') ? '1px solid rgba(201,169,110,0.35)' : undefined,
              borderLeft:   c.endsWith('l')   ? '1px solid rgba(201,169,110,0.35)' : undefined,
              borderRight:  c.endsWith('r')   ? '1px solid rgba(201,169,110,0.35)' : undefined,
            }}/>
          ))}

          {/* Ghost letter — dark version of the event section's ghost number */}
          <span
            className="font-script"
            style={{
              position: 'absolute',
              bottom: -20,
              right: 8,
              fontSize: 110,
              lineHeight: 1,
              color: 'rgba(201,169,110,0.05)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            B
          </span>

          {/* Tuxedo icon */}
          <div style={{ marginBottom: 18 }}>
            <TuxedoIcon />
          </div>

          {/* Formal label */}
          <p
            className="font-display italic font-light"
            style={{ fontSize: '1.6rem', color: '#C9A96E', marginBottom: 4, lineHeight: 1.2 }}
          >
            Formal / Black Tie
          </p>
          <p className="font-body" style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBottom: 24 }}>
            Look your most elegant
          </p>

          {/* Thin rule */}
          <div style={{ width: 32, height: 1, background: 'rgba(201,169,110,0.3)', margin: '0 auto 24px' }} />

          {/* Reserved colors label */}
          <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
            Colors reserved for the bride
          </p>

          {/* Color swatches */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {FORBIDDEN.map(({ name, hex }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(201,169,110,0.15)',
                  borderRadius: 1,
                }}
              >
                {/* Swatch */}
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: hex,
                  border: '1px solid rgba(201,169,110,0.25)',
                  flexShrink: 0,
                }}/>
                <span className="font-body" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)' }}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.25))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#C9A96E', opacity: 0.5 }}>
            Dress to Impress
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.25))' }} />
        </div>

      </div>
    </section>
  )
}