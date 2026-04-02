'use client'

import type { DressCodeData } from '@/lib/types'

function TuxedoIcon() {
  return (
    <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
      <path d="M20 8 L10 20 L14 20 L20 30" stroke="var(--color-gold)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M20 8 L30 20 L26 20 L20 30" stroke="var(--color-gold)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M10 20 L6 44 H34 L30 20" stroke="var(--color-gold)" strokeWidth="1.1" fill="rgba(var(--color-gold-rgb),0.06)" strokeLinejoin="round"/>
      <path d="M16 12 L20 15 L24 12 L20 9 Z" stroke="var(--color-gold)" strokeWidth="0.9" fill="rgba(var(--color-gold-rgb),0.2)"/>
      <line x1="20" y1="30" x2="20" y2="42" stroke="var(--color-gold)" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.5"/>
      <path d="M26 24 L30 24 L29 20" stroke="var(--color-gold)" strokeWidth="0.7" fill="rgba(var(--color-gold-rgb),0.15)" opacity="0.6"/>
    </svg>
  )
}

export default function DressCodeSection({ dressCode }: { dressCode: DressCodeData | null }) {
  if (!dressCode) return null

  const colors = dressCode.reserved_colors ?? []

  return (
    <section className="reveal" style={{ padding: '80px 24px 72px', background: 'var(--gradient-dark)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 10 }}>Attire</p>
        <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-heading-light)', marginBottom: 6 }}>
          Dress Code
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)"/></svg>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
        </div>

        <div style={{
          position: 'relative', padding: '36px 32px 32px',
          background: 'var(--gradient-dark-card)',
          border: '1px solid rgba(var(--color-gold-rgb),0.22)', borderRadius: 2,
          boxShadow: '0 2px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden'
        }}>
          {(['tl','tr','bl','br'] as const).map(c => (
            <span key={c} style={{
              position: 'absolute',
              top:    c.startsWith('t') ? 5 : undefined, bottom: c.startsWith('b') ? 5 : undefined,
              left:   c.endsWith('l')   ? 5 : undefined, right:  c.endsWith('r')   ? 5 : undefined,
              width: 8, height: 8,
              borderTop:    c.startsWith('t') ? '1px solid rgba(var(--color-gold-rgb),0.35)' : undefined,
              borderBottom: c.startsWith('b') ? '1px solid rgba(var(--color-gold-rgb),0.35)' : undefined,
              borderLeft:   c.endsWith('l')   ? '1px solid rgba(var(--color-gold-rgb),0.35)' : undefined,
              borderRight:  c.endsWith('r')   ? '1px solid rgba(var(--color-gold-rgb),0.35)' : undefined,
            }}/>
          ))}
          <span className="font-script" style={{
            position: 'absolute', bottom: -20, right: 8, fontSize: 110, lineHeight: 1,
            color: 'rgba(var(--color-gold-rgb),0.05)', pointerEvents: 'none', userSelect: 'none',
          }}>B</span>

          <div style={{ marginBottom: 18 }}><TuxedoIcon /></div>

          <p className="font-display italic font-light" style={{ fontSize: '1.6rem', color: 'var(--color-gold)', marginBottom: 4, lineHeight: 1.2 }}>
            {dressCode.style}
          </p>
          <p className="font-body" style={{ fontSize: 11, color: 'var(--color-dark-text-muted)', letterSpacing: '0.06em', marginBottom: 24 }}>
            {dressCode.hint}
          </p>

          <div style={{ width: 32, height: 1, background: 'rgba(var(--color-gold-rgb),0.3)', margin: '0 auto 24px' }} />

          {colors.length > 0 && (
            <>
              <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--color-dark-text-faint)', marginBottom: 16 }}>
                Colors reserved for the bride
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                {colors.map(({ name, hex }) => (
                  <div key={name} style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 14px',
                    background: 'var(--color-dark-surface)',
                    border: '1px solid rgba(var(--color-gold-rgb),0.15)', borderRadius: 1,
                  }}>
                    <div style={{ width: 30, height: 30, borderRadius: '50%', background: hex, border: '1px solid rgba(var(--color-gold-rgb),0.25)', flexShrink: 0 }}/>
                    <span className="font-body" style={{ fontSize: 15, letterSpacing: '0.08em', color: 'var(--color-dark-text-muted)' }}>{name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(var(--color-gold-rgb),0.25))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--color-gold)', opacity: 0.5 }}>Dress to Impress</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(var(--color-gold-rgb),0.25))' }} />
        </div>
      </div>
    </section>
  )
}