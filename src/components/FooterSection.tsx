'use client'

export default function FooterSection() {
  return (
    <footer
      className="reveal"
      style={{
        padding: '80px 24px 48px',
        background: 'linear-gradient(180deg, #F5EDE0 0%, #EDE0CC 100%)',
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
          <path d="M0 220 Q200 140 400 170 Q600 200 800 220Z" fill="#C9A96E"/>
          <path d="M0 220 Q200 100 400 130 Q600 160 800 220Z" fill="#C9A96E" opacity="0.6"/>
          <path d="M0 220 Q200 60  400 90  Q600 120 800 220Z" fill="#C9A96E" opacity="0.3"/>
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 440, margin: '0 auto' }}>

        {/* Botanical top ornament — same sprig pattern as HeroSection borders, compact */}
        <div style={{ marginBottom: 36 }}>
          <svg width="320" height="40" viewBox="0 0 320 40" fill="none" style={{ margin: '0 auto', display: 'block', opacity: 0.45 }}>
            <line x1="0" y1="20" x2="320" y2="20" stroke="#C9A96E" strokeWidth="0.6"/>
            {[32, 80, 128, 160, 192, 240, 288].map((x, i) => (
              <g key={i} transform={`translate(${x}, 20)`}>
                <line x1="0" y1="0" x2="0" y2="-10" stroke="#C9A96E" strokeWidth="0.8"/>
                <path d="M0 -5 Q-5 -9 -3 -13 Q-1 -9 0 -5Z" fill="#C9A96E" opacity="0.5"/>
                <path d="M0 -5 Q5 -9 3 -13 Q1 -9 0 -5Z"  fill="#C9A96E" opacity="0.5"/>
                <rect x="-2" y="-2" width="4" height="4" fill="#C9A96E" opacity="0.5" transform="rotate(45)"/>
              </g>
            ))}
            {[32, 80, 128, 160, 192, 240].map((x, i) => (
              <path key={i} d={`M${x} 20 Q${x+24} 15 ${[80,128,160,192,240,288][i]} 20`} stroke="#C9A96E" strokeWidth="0.5" fill="none" opacity="0.4"/>
            ))}
          </svg>
        </div>

        {/* Portrait medallion */}
        <div
          style={{
            width: 110, height: 110,
            borderRadius: '50%',
            margin: '0 auto 20px',
            background: 'linear-gradient(160deg, #D4B07A, #9A6830)',
            border: '2px solid rgba(201,169,110,0.45)',
            boxShadow: '0 8px 32px rgba(139,105,20,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <span className="font-script" style={{ fontSize: 26, color: 'rgba(255,255,255,0.55)', lineHeight: 1 }}>
            S &amp; M
          </span>
          {/* Vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle, transparent 35%, rgba(44,20,4,0.35) 100%)',
          }}/>
        </div>

        {/* Names */}
        <h2
          className="font-script"
          style={{
            fontSize: 'clamp(2.4rem, 7vw, 3.2rem)',
            lineHeight: 1.1,
            marginBottom: 8,
            background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Sofia &amp; Marco
        </h2>

        {/* Date */}
        <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: '#8B6914', opacity: 0.75, marginBottom: 24 }}>
          June 15 · 2026 · Tuscany, Italy
        </p>

        {/* Ornamental rule */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E"/>
          </svg>
          <div style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
        </div>

        {/* Tagline */}
        <p className="font-display italic font-light" style={{ fontSize: '1rem', color: '#5C4A2A', opacity: 0.68, marginBottom: 40 }}>
          This invitation is exclusively for you.
        </p>

        {/* Credit line */}
        <div style={{ borderTop: '1px solid rgba(201,169,110,0.2)', paddingTop: 20 }}>
          <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.28em', color: '#8B6914', opacity: 0.35 }}>
            © 2026 Wedding Invitations · Made with ♥
          </p>
        </div>

      </div>
    </footer>
  )
}