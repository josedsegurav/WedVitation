'use client'

import { GALLERY, COUPLE, PHOTO_UPLOAD_URL } from '@/app/config';
import { useState } from 'react'



const ITEMS = GALLERY.map(({ id, color1, color2, label }) => ({
  id: id,
  gradient: `linear-gradient(160deg, ${color1}, ${color2})`,
  label: label,
}));

// Grid layout: item 0 spans 2 cols × 2 rows, rest fill 1×1
const GRID: Record<number, React.CSSProperties> = {
  0: { gridColumn: '1 / 3', gridRow: '1 / 3' },
  1: { gridColumn: '3',     gridRow: '1'      },
  2: { gridColumn: '3',     gridRow: '2'      },
  3: { gridColumn: '1',     gridRow: '3'      },
  4: { gridColumn: '2',     gridRow: '3'      },
  5: { gridColumn: '3',     gridRow: '3'      },
}

// Small camera icon — inline, fixed 16px
function CameraIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 20 17" fill="none">
      <rect x="1" y="4" width="18" height="12" rx="1.5" stroke="#C9A96E" strokeWidth="1.1"/>
      <circle cx="10" cy="10" r="3.5" stroke="#C9A96E" strokeWidth="1.1"/>
      <circle cx="10" cy="10" r="1.5" fill="rgba(201,169,110,0.3)" stroke="#C9A96E" strokeWidth="0.7"/>
      <path d="M7 4 L8.5 1.5 H11.5 L13 4" stroke="#C9A96E" strokeWidth="1" strokeLinejoin="round" fill="none"/>
      <circle cx="16" cy="7" r="1.2" fill="#C9A96E"/>
    </svg>
  )
}

export default function GallerySection() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section
      className="reveal"
      style={{
        padding: '80px 24px 72px',
        background: 'linear-gradient(180deg, #FAF6F0 0%, #F5EDE0 50%, #FAF6F0 100%)',
      }}
    >
      <div style={{ maxWidth: 620, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: '#C9A96E', marginBottom: 10 }}>
            Our Moments
          </p>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#2C2C2C', marginBottom: 6 }}>
            Gallery
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E"/>
            </svg>
            <div style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
          </div>
          <p className="font-display italic font-light" style={{ fontSize: '1rem', color: '#8B6914', opacity: 0.65 }}>
            A glimpse into our love story
          </p>
        </div>

        {/* Grid — all sizing explicit, no globals.css dependency */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: '160px 160px 160px',
            gap: 6,
            marginBottom: 6,
          }}
        >
          {ITEMS.map(({ id, gradient, label }) => (
            <div
              key={id}
              style={{
                ...GRID[id],
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                border: '1px solid rgba(201,169,110,0.18)',
              }}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Gradient fill */}
              <div style={{ position: 'absolute', inset: 0, background: gradient }} />

              {/* Monogram watermark */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 4,
                }}
              >
                <span
                  className="font-script"
                  style={{ fontSize: id === 0 ? 52 : 28, color: 'rgba(255,255,255,0.18)', lineHeight: 1 }}
                >
                  {COUPLE.monogram}
                </span>
                <span
                  className="font-body uppercase"
                  style={{ fontSize: 8, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)' }}
                >
                  {label}
                </span>
              </div>

              {/* Hover overlay */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(28, 18, 4, 0.52)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: hovered === id ? 1 : 0,
                  transition: 'opacity 0.25s ease',
                }}
              >
                <span
                  className="font-body uppercase"
                  style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(232,213,176,0.9)' }}
                >
                  {label}
                </span>
              </div>

              {/* Subtle corner accents on hover */}
              {hovered === id && (['tl','tr','bl','br'] as const).map(c => (
                <span key={c} style={{
                  position: 'absolute',
                  top:    c.startsWith('t') ? 6 : undefined,
                  bottom: c.startsWith('b') ? 6 : undefined,
                  left:   c.endsWith('l')   ? 6 : undefined,
                  right:  c.endsWith('r')   ? 6 : undefined,
                  width: 8, height: 8,
                  borderTop:    c.startsWith('t') ? '1px solid rgba(232,213,176,0.5)' : undefined,
                  borderBottom: c.startsWith('b') ? '1px solid rgba(232,213,176,0.5)' : undefined,
                  borderLeft:   c.endsWith('l')   ? '1px solid rgba(232,213,176,0.5)' : undefined,
                  borderRight:  c.endsWith('r')   ? '1px solid rgba(232,213,176,0.5)' : undefined,
                  transition: 'opacity 0.2s',
                }}/>
              ))}
            </div>
          ))}
        </div>

        {/* Share CTA card */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '28px 32px 24px',
            background: 'linear-gradient(160deg, rgba(253,248,242,0.95), rgba(245,237,224,0.8))',
            border: '1px solid rgba(201,169,110,0.28)',
            borderRadius: 2,
            boxShadow: '0 2px 16px rgba(139,105,20,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
            textAlign: 'center',
            overflow: 'hidden',
            marginTop: 14,
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

          <div style={{ marginBottom: 10 }}><CameraIcon /></div>

          <p className="font-display font-light" style={{ fontSize: '1.1rem', color: '#2C2C2C', marginBottom: 3 }}>
            Share Your Photos
          </p>

          <div style={{ width: 20, height: 1, background: 'rgba(201,169,110,0.35)', margin: '6px auto 8px' }} />

          <p className="font-body" style={{ fontSize: 11, color: '#8B6914', opacity: 0.7, marginBottom: 18 }}>
            Upload photos to our shared album
          </p>

          <a
            href={PHOTO_UPLOAD_URL}
            className="font-body uppercase"
            style={{
              fontSize: 9,
              letterSpacing: '0.22em',
              color: '#8B6914',
              padding: '9px 22px',
              border: '1px solid rgba(201,169,110,0.5)',
              borderRadius: 1,
              background: 'rgba(201,169,110,0.06)',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.06)')}
          >
            Upload Photo
          </a>
        </div>

        {/* Bottom separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#C9A96E', opacity: 0.7 }}>
            Our Story
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
        </div>

      </div>
    </section>
  )
}