'use client'

import { FAMILIES } from '@/app/config'


{FAMILIES.map(({ label, family, parents }) => (
  <div key={family}>
    <p>{label}</p>       // "Bride's Family"
    <p>{family}</p>      // "Rossi Family"
    <p>{parents}</p>     // "Antonio & Lucia Rossi"
  </div>
))}

export default function ParentsSection() {
  return (
    <section
      className="reveal"
      style={{
        padding: '72px 24px 80px',
        background: 'var(--gradient-section)',
      }}
    >
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>

        {/* Eyebrow */}
        <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 10 }}>
          With God&apos;s Blessing
        </p>

        <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-heading)', marginBottom: 6 }}>
          Our Parents
        </h2>

        {/* Ornamental rule — same as countdown */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)"/>
          </svg>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
        </div>

        {/* Blessing quote */}
        <p
          className="font-display italic font-light leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: 'var(--color-body)', opacity: 0.8, marginBottom: 40 }}
        >
          With the blessing of God and our parents, we joyfully<br />
          invite you to witness the union of our hearts.
        </p>

        {/* Family cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {FAMILIES.map(({ label, family, parents }) => (
            <div
              key={family}
              style={{
                padding: '24px 20px 20px',
                background: 'var(--gradient-card)',
                border: '1px solid rgba(var(--color-gold-rgb),0.28)',
                borderRadius: 2,
                boxShadow: '0 2px 16px rgba(var(--color-gold-dark-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Corner accent marks — same pattern as countdown boxes */}
              {(['tl','tr','bl','br'] as const).map(corner => (
                <span key={corner} style={{
                  position: 'absolute',
                  top:    corner.startsWith('t') ? 5 : undefined,
                  bottom: corner.startsWith('b') ? 5 : undefined,
                  left:   corner.endsWith('l')   ? 5 : undefined,
                  right:  corner.endsWith('r')   ? 5 : undefined,
                  width: 8, height: 8,
                  borderTop:    corner.startsWith('t') ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
                  borderBottom: corner.startsWith('b') ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
                  borderLeft:   corner.endsWith('l')   ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
                  borderRight:  corner.endsWith('r')   ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
                }}/>
              ))}

              {/* Small ring icon — bride/groom indicator */}
              <div style={{ marginBottom: 10 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
                  <circle cx="12" cy="12" r="8" stroke="var(--color-gold)" strokeWidth="1" fill="none" opacity="0.5"/>
                  <circle cx="12" cy="12" r="4" stroke="var(--color-gold)" strokeWidth="0.8" fill="rgba(var(--color-gold-rgb),0.12)"/>
                </svg>
              </div>

              <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--color-gold)', marginBottom: 6 }}>
                {label}
              </p>

              {/* Thin rule */}
              <div style={{ width: 20, height: 1, background: 'rgba(var(--color-gold-rgb),0.35)', margin: '0 auto 8px' }} />

              <p className="font-display font-medium" style={{ fontSize: '1.15rem', color: 'var(--color-heading)', marginBottom: 4 }}>
                {family}
              </p>
              <p className="font-body" style={{ fontSize: 12, color: 'var(--color-gold-dark)', opacity: 0.85 }}>
                {parents}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom separator — mirrors countdown's date separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(var(--color-gold-rgb),0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--color-gold)', opacity: 0.7 }}>
            United in Love
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(var(--color-gold-rgb),0.3))' }} />
        </div>

      </div>
    </section>
  )
}
