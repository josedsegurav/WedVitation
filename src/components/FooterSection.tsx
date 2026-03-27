'use client'

import { COUPLE, WEDDING, FOOTER_TAGLINE } from '@/app/config'

export default function FooterSection() {
  return (
    <footer
      className="reveal"
      style={{
        padding: '80px 24px 48px',
        background: 'var(--gradient-footer)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Layered wave background — fixed px height, not w-full */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.18 }}>
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 800 220"
          width="100%" height="100%"
          fill="none"
          style={{ position: 'absolute', bottom: 0, left: 0 }}
        >
          <path d="M0 220 Q200 140 400 170 Q600 200 800 220Z" fill="var(--color-gold)"/>
          <path d="M0 220 Q200 100 400 130 Q600 160 800 220Z" fill="var(--color-gold)" opacity="0.6"/>
          <path d="M0 220 Q200 60  400 90  Q600 120 800 220Z" fill="var(--color-gold)" opacity="0.3"/>
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 440, margin: '0 auto' }}>

        {/* Botanical top ornament — same sprig pattern as HeroSection borders, compact */}
        <div style={{ marginBottom: 36 }}>
          <svg width="320" height="40" viewBox="0 0 320 40" fill="none" style={{ margin: '0 auto', display: 'block', opacity: 0.45 }}>
            <line x1="0" y1="20" x2="320" y2="20" stroke="var(--color-gold)" strokeWidth="0.6"/>
            {[32, 80, 128, 160, 192, 240, 288].map((x, i) => (
              <g key={i} transform={`translate(${x}, 20)`}>
                <line x1="0" y1="0" x2="0" y2="-10" stroke="var(--color-gold)" strokeWidth="0.8"/>
                <path d="M0 -5 Q-5 -9 -3 -13 Q-1 -9 0 -5Z" fill="var(--color-gold)" opacity="0.5"/>
                <path d="M0 -5 Q5 -9 3 -13 Q1 -9 0 -5Z"  fill="var(--color-gold)" opacity="0.5"/>
                <rect x="-2" y="-2" width="4" height="4" fill="var(--color-gold)" opacity="0.5" transform="rotate(45)"/>
              </g>
            ))}
            {[32, 80, 128, 160, 192, 240].map((x, i) => (
              <path key={i} d={`M${x} 20 Q${x+24} 15 ${[80,128,160,192,240,288][i]} 20`} stroke="var(--color-gold)" strokeWidth="0.5" fill="none" opacity="0.4"/>
            ))}
          </svg>
        </div>

        {/* Portrait medallion */}
        <div
          style={{
            width: 110, height: 110,
            borderRadius: '50%',
            margin: '0 auto 20px',
            background: 'var(--gradient-gold-btn)',
            border: '2px solid rgba(var(--color-gold-rgb),0.45)',
            boxShadow: '0 8px 32px rgba(var(--color-gold-dark-rgb),0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <span className="font-script" style={{ fontSize: 26, color: 'var(--color-dark-text)', lineHeight: 1 }}>
            {COUPLE.monogram}
          </span>
          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'var(--gradient-portrait-overlay)',
          }}/>
        </div>

        {/* Names */}
        <h2
          className="font-script"
          style={{
            fontSize: 'clamp(2.4rem, 7vw, 3.2rem)',
            lineHeight: 1.1,
            marginBottom: 8,
            background: 'var(--gradient-gold)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            padding: '10px 5px'
          }}
        >
          {COUPLE.names}
        </h2>

        {/* Date */}
        <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold-dark)', opacity: 0.75, marginBottom: 24 }}>
          {WEDDING.dateDisplay} · {WEDDING.location}
        </p>

        {/* Ornamental rule */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)"/>
          </svg>
          <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
        </div>

        {/* Tagline */}
        <p className="font-display italic font-light" style={{ fontSize: '1rem', color: 'var(--color-body)', opacity: 0.68, marginBottom: 40 }}>
          {FOOTER_TAGLINE}
        </p>

        {/* Credit line */}
        <div style={{ borderTop: '1px solid rgba(var(--color-gold-rgb),0.2)', paddingTop: 20 }}>
          <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--color-gold-dark)', opacity: 0.35 }}>
            © 2026 Wedding Invitations · Made with ♥
          </p>
        </div>

      </div>
    </footer>
  )
}
