'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { GalleryPhoto, WeddingRow } from '@/lib/types'

// Grid layout: first item spans 2×2, rest fill 1×1
const GRID: Record<number, React.CSSProperties> = {
  0: { gridColumn: '1 / 3', gridRow: '1 / 3' },
  1: { gridColumn: '3',     gridRow: '1'      },
  2: { gridColumn: '3',     gridRow: '2'      },
  3: { gridColumn: '1',     gridRow: '3'      },
  4: { gridColumn: '2',     gridRow: '3'      },
  5: { gridColumn: '3',     gridRow: '3'      },
}

// Fallback gradient palette when no photo src
const GRADIENTS = [
  'linear-gradient(160deg, var(--color-gold-dark), color-mix(in srgb, var(--color-gold-dark) 70%, black))',
  'linear-gradient(160deg, color-mix(in srgb, var(--color-gold) 70%, #604020), color-mix(in srgb, var(--color-gold-dark) 60%, black))',
  'linear-gradient(160deg, var(--color-gold-light), var(--color-gold))',
  'linear-gradient(160deg, color-mix(in srgb, var(--color-gold) 55%, gray), color-mix(in srgb, var(--color-gold-dark) 50%, gray))',
  'linear-gradient(160deg, var(--color-gold), var(--color-gold-dark))',
  'linear-gradient(160deg, color-mix(in srgb, var(--color-gold) 80%, gray), color-mix(in srgb, var(--color-gold-dark) 70%, gray))',
]

function CameraIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 20 17" fill="none">
      <rect x="1" y="4" width="18" height="12" rx="1.5" stroke="var(--color-gold)" strokeWidth="1.1"/>
      <circle cx="10" cy="10" r="3.5" stroke="var(--color-gold)" strokeWidth="1.1"/>
      <circle cx="10" cy="10" r="1.5" fill="rgba(var(--color-gold-rgb),0.3)" stroke="var(--color-gold)" strokeWidth="0.7"/>
      <path d="M7 4 L8.5 1.5 H11.5 L13 4" stroke="var(--color-gold)" strokeWidth="1" strokeLinejoin="round" fill="none"/>
      <circle cx="16" cy="7" r="1.2" fill="var(--color-gold)"/>
    </svg>
  )
}

interface LightboxProps {
  items:   GalleryPhoto[]
  current: number
  onClose: () => void
  onPrev:  () => void
  onNext:  () => void
}

function Lightbox({ items, current, onClose, onPrev, onNext }: LightboxProps) {
  const item    = items[current]
  const hasPrev = current > 0
  const hasNext = current < items.length - 1

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  hasPrev && onPrev()
      if (e.key === 'ArrowRight') hasNext && onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext, hasPrev, hasNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(12, 8, 2, 0.92)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'lbFadeIn 0.2s ease',
    }}>
      <style>{`@keyframes lbFadeIn{from{opacity:0}to{opacity:1}} @keyframes lbSlideIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}`}</style>

      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative',
        maxWidth: '90vw', maxHeight: '85vh',
        width: current === 0 ? 'min(820px, 90vw)' : 'min(580px, 90vw)',
        aspectRatio: current === 0 ? '4/3' : '3/4',
        animation: 'lbSlideIn 0.25s ease',
      }}>
        {item.src ? (
          <Image src={item.src} alt={item.label} fill sizes="90vw"
            style={{ objectFit: 'cover', borderRadius: 2 }} priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 2, background: GRADIENTS[current % GRADIENTS.length] }} />
        )}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 2, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.55))', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p className="font-script" style={{ fontSize: '1.6rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.1, marginBottom: 2 }}>{item.label}</p>
          </div>
          <p className="font-body" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
            {current + 1} / {items.length}
          </p>
        </div>
      </div>

      {hasPrev && (
        <button onClick={e => { e.stopPropagation(); onPrev() }} style={{
          position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(var(--color-gold-rgb),0.12)', border: '1px solid rgba(var(--color-gold-rgb),0.28)',
          borderRadius: 1, width: 44, height: 44, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="10,3 5,8 10,13" stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      {hasNext && (
        <button onClick={e => { e.stopPropagation(); onNext() }} style={{
          position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(var(--color-gold-rgb),0.12)', border: '1px solid rgba(var(--color-gold-rgb),0.28)',
          borderRadius: 1, width: 44, height: 44, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="6,3 11,8 6,13" stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      )}
      <button onClick={onClose} style={{
        position: 'fixed', top: 16, right: 16,
        background: 'rgba(var(--color-gold-rgb),0.1)', border: '1px solid rgba(var(--color-gold-rgb),0.25)',
        borderRadius: 1, width: 40, height: 40, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <line x1="2" y1="2" x2="12" y2="12" stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round"/>
          <line x1="12" y1="2" x2="2" y2="12" stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

export default function GallerySection({
  gallery,
  wedding,
}: {
  gallery: GalleryPhoto[]
  wedding?: WeddingRow
}) {
  const [hovered,     setHovered]     = useState<string | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const monogram       = wedding?.monogram       ?? ''
  const photoUploadUrl = wedding?.photo_upload_url ?? ''

  const closeLightbox = useCallback(() => setLightboxIdx(null), [])
  const goPrev = useCallback(() => setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : i)), [])
  const goNext = useCallback(() => setLightboxIdx(i => (i !== null && i < gallery.length - 1 ? i + 1 : i)), [gallery.length])

  if (!gallery.length) return null

  return (
    <>
      <section className="reveal" style={{ padding: '80px 24px 72px', background: 'var(--gradient-section)' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 10 }}>Our Moments</p>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-heading)', marginBottom: 6 }}>Gallery</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
              <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)"/></svg>
              <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '160px 160px 160px', gap: 6, marginBottom: 6 }}>
            {gallery.slice(0, 6).map(({ id, label, src }, arrIdx) => (
              <div key={id} style={{
                ...GRID[arrIdx],
                position: 'relative', overflow: 'hidden', borderRadius: 2, cursor: 'zoom-in',
                border: '1px solid rgba(var(--color-gold-rgb),0.18)',
              }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setLightboxIdx(arrIdx)}
              >
                {src ? (
                  <Image fill src={src} alt={label} sizes="(max-width:620px) 33vw, 207px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: GRADIENTS[arrIdx % GRADIENTS.length] }} />
                )}
                {!src && monogram && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span className="font-script" style={{ fontSize: arrIdx === 0 ? 52 : 28, color: 'rgba(255,255,255,0.18)', lineHeight: 1 }}>{monogram}</span>
                    <span className="font-body uppercase" style={{ fontSize: 8, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)' }}>{label}</span>
                  </div>
                )}
                <div style={{
                  position: 'absolute', inset: 0, background: 'var(--color-gallery-overlay)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6,
                  opacity: hovered === id ? 1 : 0, transition: 'opacity 0.25s ease',
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ opacity: 0.8 }}>
                    <polyline points="1,6 1,1 6,1" stroke="var(--color-gold-light)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="12,1 17,1 17,6" stroke="var(--color-gold-light)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17,12 17,17 12,17" stroke="var(--color-gold-light)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="6,17 1,17 1,12" stroke="var(--color-gold-light)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--color-gallery-text)' }}>{label}</span>
                </div>
              </div>
            ))}
          </div>

          {photoUploadUrl && (
            <div style={{
              position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '28px 32px 24px', background: 'var(--gradient-card)',
              border: '1px solid rgba(var(--color-gold-rgb),0.28)', borderRadius: 2,
              boxShadow: '0 2px 16px rgba(var(--color-gold-dark-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
              textAlign: 'center', overflow: 'hidden', marginTop: 14,
            }}>
              <div style={{ marginBottom: 10 }}><CameraIcon /></div>
              <p className="font-display font-light" style={{ fontSize: '1.1rem', color: 'var(--color-heading)', marginBottom: 3 }}>Share Your Photos</p>
              <div style={{ width: 20, height: 1, background: 'rgba(var(--color-gold-rgb),0.35)', margin: '6px auto 8px' }} />
              <p className="font-body" style={{ fontSize: 11, color: 'var(--color-gold-dark)', opacity: 0.7, marginBottom: 18 }}>
                Upload photos to our shared album
              </p>
              <a href={photoUploadUrl} className="font-body uppercase" style={{
                fontSize: 9, letterSpacing: '0.22em', color: 'var(--color-gold-dark)',
                padding: '9px 22px', border: '1px solid rgba(var(--color-gold-rgb),0.5)',
                borderRadius: 1, background: 'rgba(var(--color-gold-rgb),0.06)',
                textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(var(--color-gold-rgb),0.14)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(var(--color-gold-rgb),0.06)')}>
                Upload Photo
              </a>
            </div>
          )}
        </div>
      </section>

      {lightboxIdx !== null && (
        <Lightbox items={gallery} current={lightboxIdx} onClose={closeLightbox} onPrev={goPrev} onNext={goNext} />
      )}
    </>
  )
}