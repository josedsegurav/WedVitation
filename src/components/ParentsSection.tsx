'use client'

const FAMILIES = [
  { label: "Bride's Family", family: 'Rossi Family', parents: 'Antonio & Lucia Rossi' },
  { label: "Groom's Family", family: 'De Luca Family', parents: 'Giovanni & Elena De Luca' },
]

export default function ParentsSection() {
  return (
    <section
      className="reveal"
      style={{
        padding: '72px 24px 80px',
        background: 'linear-gradient(180deg, #FAF6F0 0%, #F5EDE0 50%, #FAF6F0 100%)',
      }}
    >
      <div style={{ maxWidth: 540, margin: '0 auto', textAlign: 'center' }}>

        {/* Eyebrow */}
        <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: '#C9A96E', marginBottom: 10 }}>
          With God&apos;s Blessing
        </p>

        <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#2C2C2C', marginBottom: 6 }}>
          Our Parents
        </h2>

        {/* Ornamental rule — same as countdown */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E"/>
          </svg>
          <div style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
        </div>

        {/* Blessing quote */}
        <p
          className="font-display italic font-light leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: '#5C4A2A', opacity: 0.8, marginBottom: 40 }}
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
                background: 'linear-gradient(160deg, rgba(253,248,242,0.9), rgba(245,237,224,0.7))',
                border: '1px solid rgba(201,169,110,0.28)',
                borderRadius: 2,
                boxShadow: '0 2px 16px rgba(139,105,20,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
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
                  borderTop:    corner.startsWith('t') ? '1px solid rgba(201,169,110,0.4)' : undefined,
                  borderBottom: corner.startsWith('b') ? '1px solid rgba(201,169,110,0.4)' : undefined,
                  borderLeft:   corner.endsWith('l')   ? '1px solid rgba(201,169,110,0.4)' : undefined,
                  borderRight:  corner.endsWith('r')   ? '1px solid rgba(201,169,110,0.4)' : undefined,
                }}/>
              ))}

              {/* Small ring icon — bride/groom indicator */}
              <div style={{ marginBottom: 10 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto' }}>
                  <circle cx="12" cy="12" r="8" stroke="#C9A96E" strokeWidth="1" fill="none" opacity="0.5"/>
                  <circle cx="12" cy="12" r="4" stroke="#C9A96E" strokeWidth="0.8" fill="rgba(201,169,110,0.12)"/>
                </svg>
              </div>

              <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.22em', color: '#C9A96E', marginBottom: 6 }}>
                {label}
              </p>

              {/* Thin rule */}
              <div style={{ width: 20, height: 1, background: 'rgba(201,169,110,0.35)', margin: '0 auto 8px' }} />

              <p className="font-display font-medium" style={{ fontSize: '1.15rem', color: '#2C2C2C', marginBottom: 4 }}>
                {family}
              </p>
              <p className="font-body" style={{ fontSize: 12, color: '#8B6914', opacity: 0.85 }}>
                {parents}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom separator — mirrors countdown's date separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#C9A96E', opacity: 0.7 }}>
            United in Love
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
        </div>

      </div>
    </section>
  )
}