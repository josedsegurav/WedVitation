'use client'

import { useEffect, useRef } from 'react'
import { COUPLE, WEDDING, HERO_QUOTE } from '@/app/config'


export default function HeroSection() {
  const ringRef = useRef<SVGCircleElement>(null)

  // Slow infinite rotation on the dashed orbit ring
  useEffect(() => {
    let frame: number
    let angle = 0
    const tick = () => {
      angle = (angle + 0.12) % 360
      if (ringRef.current) {
        ringRef.current.style.transform = `rotate(${angle}deg)`
        ringRef.current.style.transformOrigin = '70px 70px'
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: 'var(--gradient-section)' }}
    >
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #8B6914 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.035,
        }}
      />

      {/* Top botanical border — thin, elegant, recognisable */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none overflow-hidden">
        <svg
          width="700" height="80" viewBox="0 0 700 80"
          fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.35 }}
        >
          {/* Central horizontal rule */}
          <line x1="0" y1="40" x2="700" y2="40" stroke="var(--color-gold)" strokeWidth="0.6"/>

          {/* Small repeating leaf sprigs along the rule */}
          {[70, 160, 260, 350, 440, 540, 630].map((x, i) => (
            <g key={i} transform={`translate(${x}, 40)`}>
              {/* Stem up */}
              <line x1="0" y1="0" x2="0" y2="-16" stroke="var(--color-gold)" strokeWidth="0.8"/>
              {/* Left leaf */}
              <path d="M0 -8 Q-7 -14 -5 -20 Q-1 -14 0 -8Z" fill="var(--color-gold)" opacity="0.5"/>
              {/* Right leaf */}
              <path d="M0 -8 Q7 -14 5 -20 Q1 -14 0 -8Z" fill="var(--color-gold)" opacity="0.5"/>
              {/* Stem down */}
              <line x1="0" y1="0" x2="0" y2="16" stroke="var(--color-gold)" strokeWidth="0.8"/>
              <path d="M0 8 Q-7 14 -5 20 Q-1 14 0 8Z" fill="var(--color-gold)" opacity="0.3"/>
              <path d="M0 8 Q7 14 5 20 Q1 14 0 8Z" fill="var(--color-gold)" opacity="0.3"/>
              {/* Diamond at root */}
              <rect x="-2.5" y="-2.5" width="5" height="5" fill="var(--color-gold)" opacity="0.6" transform="rotate(45)"/>
            </g>
          ))}

          {/* Connecting arcs between sprigs */}
          {[70, 160, 260, 350, 440, 540].map((x, i) => (
            <path
              key={i}
              d={`M${x} 40 Q${x + 45} 32 ${[160,260,350,440,540,630][i]} 40`}
              stroke="var(--color-gold)" strokeWidth="0.5" fill="none" opacity="0.5"
            />
          ))}
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center" style={{ maxWidth: 560 }}>

        {/* Eyebrow label */}
        <p
          className="font-body uppercase mb-7"
          style={{ fontSize: 20, letterSpacing: '0.42em', color: 'var(--color-gold)' }}
        >
          We&apos;re Getting Married
        </p>

        {/* ── Monogram medallion ── */}
        {/*
            Layout (all in a 140×140 viewBox):
            - Outer dashed ring (slowly rotates via JS)
            - Inner solid ring
            - 4 compass diamonds at N/E/S/W on the outer ring
            - "S & M" rendered as proper styled text, not floating letters
        */}
        <div className="relative mb-6" style={{ width: 400, height: 400 }}>
          <svg viewBox="0 0 140 140" width="300" height="400" style={{ overflow: 'visible' }}>

            {/* Outer dashed orbit — rotated by JS ref */}
            <circle
              ref={ringRef}
              cx="70" cy="70" r="80"
              stroke="var(--color-gold)" strokeWidth="0.7" fill="none"
              strokeDasharray="3 6"
              style={{ opacity: 0.5 }}
            />

            {/* Inner solid ring */}
            <circle cx="70" cy="70" r="85" stroke="var(--color-gold)" strokeWidth="0.8" fill="none" opacity="0.6"/>

            {/* Subtle fill */}
            <circle cx="70" cy="70" r="75" fill="rgba(var(--color-gold-rgb),0.05)"/>

            {/* Compass diamonds — fixed at true N/E/S/W on the INNER ring (r=55) */}
            {/* North */}
            <polygon points="70,11  67,15  70,19  73,15" fill="var(--color-gold)"/>
            {/* East */}
            <polygon points="129,70  125,67  121,70  125,73" fill="var(--color-gold)"/>
            {/* South */}
            <polygon points="70,129  67,125  70,121  73,125" fill="var(--color-gold)"/>
            {/* West */}
            <polygon points="11,70  15,67  19,70  15,73" fill="var(--color-gold)"/>

            {/* Thin cross-hairs inside the inner circle */}
            <line x1="70" y1="18" x2="70" y2="122" stroke="var(--color-gold)" strokeWidth="0.4" opacity="0.2"/>
            <line x1="18" y1="70" x2="122" y2="70" stroke="var(--color-gold)" strokeWidth="0.4" opacity="0.2"/>

            {/* Monogram — single legible text block */}
            <text
              x="70" y="62"
              textAnchor="middle"
              fontFamily="'Great Vibes', cursive"
              fontSize="30"
              fill="var(--color-gold)"
              letterSpacing="1"
            >
              {COUPLE.monogram}
            </text>

            {/* Thin rule below monogram */}
            <line x1="46" y1="72" x2="94" y2="72" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.6"/>

            {/* Date inside medallion */}
            <text
              x="70" y="85"
              textAnchor="middle"
              fontFamily="'Jost', sans-serif"
              fontSize="8"
              fill="var(--color-gold-dark)"
              letterSpacing="2.5"
            >
              {WEDDING.dateMedallion}
            </text>
          </svg>
        </div>

        {/* Names headline */}
        <h1
          className="font-script mb-4"
          style={{
            fontSize: 'clamp(3rem, 9vw, 5.5rem)',
            lineHeight: 1.1,
            background: 'var(--gradient-gold)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            padding: '5px 0'
          }}
        >
          {COUPLE.names}
        </h1>

        {/* Ornamental divider */}
        <div className="flex items-center justify-center mb-6" style={{ gap: 12, width: '100%', maxWidth: 320 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
          {/* Small 5-petal flower, fully inline, ~16px */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {[0, 72, 144, 216, 288].map(a => (
              <ellipse
                key={a}
                cx="8" cy="8"
                rx="1.8" ry="4"
                fill="rgba(var(--color-gold-rgb),0.7)"
                transform={`rotate(${a} 8 8) translate(0 -2.5)`}
              />
            ))}
            <circle cx="8" cy="8" r="2" fill="var(--color-gold)"/>
          </svg>
          <div style={{ flex: 1, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
        </div>

        {/* Quote */}
        <blockquote
          className="font-display italic font-light mb-8 leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--color-body)', maxWidth: 400 }}
        >
          {HERO_QUOTE.line1}<br />
          {HERO_QUOTE.line2}
        </blockquote>

        {/* Save the date card */}
        <div
          className="inline-flex flex-col items-center"
          style={{
            position: 'relative',
            background: 'var(--gradient-card)',
            border: '1px solid rgba(var(--color-gold-rgb),0.28)',
            borderRadius: 2,
            boxShadow: '0 2px 16px rgba(var(--color-gold-dark-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
            padding: '10px 20px'
          }}
        >
          {/* Corner accent marks */}
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

          <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 6 }}>
            Save the Date
          </p>
          <div style={{ width: 20, height: 1, background: 'rgba(var(--color-gold-rgb),0.35)', marginBottom: 8 }} />
          <p className="font-display font-medium" style={{ fontSize: '1.75rem', color: 'var(--color-heading)', lineHeight: 1 }}>
            {WEDDING.dateDisplay}
          </p>
          <p className="font-body" style={{ fontSize: 12, letterSpacing: '0.1em', color: 'var(--color-gold-dark)', marginTop: 6 }}>
            {WEDDING.location}
          </p>
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-1 animate-bounce" style={{ opacity: 0.45 }}>
          <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--color-gold-dark)' }}>
            Scroll to explore
          </p>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dark)" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="5 13 12 19 19 13"/>
          </svg>
        </div>
      </div>

      {/* Bottom botanical border — mirror of top */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none overflow-hidden">
        <svg
          width="700" height="80" viewBox="0 0 700 80"
          fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.3, transform: 'scaleY(-1)' }}
        >
          <line x1="0" y1="40" x2="700" y2="40" stroke="var(--color-gold)" strokeWidth="0.6"/>
          {[70, 160, 260, 350, 440, 540, 630].map((x, i) => (
            <g key={i} transform={`translate(${x}, 40)`}>
              <line x1="0" y1="0" x2="0" y2="-16" stroke="var(--color-gold)" strokeWidth="0.8"/>
              <path d="M0 -8 Q-7 -14 -5 -20 Q-1 -14 0 -8Z" fill="var(--color-gold)" opacity="0.5"/>
              <path d="M0 -8 Q7 -14 5 -20 Q1 -14 0 -8Z" fill="var(--color-gold)" opacity="0.5"/>
              <line x1="0" y1="0" x2="0" y2="16" stroke="var(--color-gold)" strokeWidth="0.8"/>
              <path d="M0 8 Q-7 14 -5 20 Q-1 14 0 8Z" fill="var(--color-gold)" opacity="0.3"/>
              <path d="M0 8 Q7 14 5 20 Q1 14 0 8Z" fill="var(--color-gold)" opacity="0.3"/>
              <rect x="-2.5" y="-2.5" width="5" height="5" fill="var(--color-gold)" opacity="0.6" transform="rotate(45)"/>
            </g>
          ))}
          {[70, 160, 260, 350, 440, 540].map((x, i) => (
            <path key={i} d={`M${x} 40 Q${x + 45} 32 ${[160,260,350,440,540,630][i]} 40`} stroke="var(--color-gold)" strokeWidth="0.5" fill="none" opacity="0.5"/>
          ))}
        </svg>
      </div>
    </section>
  )
}
