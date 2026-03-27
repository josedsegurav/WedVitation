'use client'

import { useEffect, useState } from 'react'

export default function FloatingRSVP() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <style>{`
        @keyframes floatBounce {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        .floating-rsvp-visible {
          animation: floatBounce 2.8s ease-in-out infinite;
        }
        .floating-rsvp:hover {
          box-shadow: 0 12px 36px rgba(var(--color-gold-dark-rgb),0.45) !important;
          opacity: 0.92 !important;
        }
      `}</style>

      <a
        href="#rsvp"
        className={visible ? 'floating-rsvp floating-rsvp-visible' : 'floating-rsvp'}
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: '14px 22px',
          background: 'var(--gradient-gold-btn)',
          color: 'var(--color-btn-text)',
          fontFamily: 'inherit',
          fontSize: 10,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderRadius: 2,
          border: '1px solid var(--color-float-border)',
          boxShadow: '0 8px 28px rgba(var(--color-gold-dark-rgb),0.32)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          // Entry/exit slide — only when not bouncing
          // We use a separate class for the bounce so this transition
          // only handles the appear/disappear, not fighting the animation
          transition: 'opacity 0.45s ease',
        }}
      >
        {/* Small ring icon */}
        <svg width="16" height="10" viewBox="0 0 30 18" fill="none" style={{ marginBottom: 2 }}>
          <circle cx="10" cy="9" r="7.5" stroke="var(--color-float-rings)" strokeWidth="1.2" fill="none"/>
          <circle cx="20" cy="9" r="7.5" stroke="var(--color-float-rings)" strokeWidth="1.2" fill="var(--color-float-rings-fill)"/>
          <path d="M14 4 Q15 9 14 14" stroke="var(--color-float-curve)" strokeWidth="0.8" fill="none"/>
        </svg>

        <span style={{ lineHeight: 1.3 }}>Confirm</span>
        <span style={{ lineHeight: 1.3 }}>Attendance</span>

        {/* Bottom shimmer line */}
        <div style={{
          width: '60%',
          height: 1,
          marginTop: 4,
          background: 'var(--gradient-float-shimmer)',
        }}/>
      </a>
    </>
  )
}
