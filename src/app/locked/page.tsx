'use client'

import { useEffect, useState } from 'react'

export default function LockedPage() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FAF6F0 0%, #F0E4CA 55%, #EDD9B8 100%)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease',
      fontFamily: "'Jost', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400&display=swap');
      `}</style>

      <div style={{ textAlign: 'center', maxWidth: 360, padding: '0 24px' }}>
        {/* Lock icon */}
        <svg width="32" height="38" viewBox="0 0 32 38" fill="none"
          style={{ margin: '0 auto 24px', display: 'block' }}>
          <rect x="4" y="17" width="24" height="18" rx="2"
            stroke="#C9A96E" strokeWidth="1.3" fill="rgba(201,169,110,0.08)" />
          <path d="M10 17V11a6 6 0 0112 0v6"
            stroke="#C9A96E" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <circle cx="16" cy="26" r="2.5" fill="#C9A96E" opacity="0.6" />
          <line x1="16" y1="28" x2="16" y2="31"
            stroke="#C9A96E" strokeWidth="1.3" strokeLinecap="round" />
        </svg>

        <p style={{
          fontSize: 9, letterSpacing: '0.38em', textTransform: 'uppercase',
          color: '#C9A96E', marginBottom: 14,
        }}>
          Private Invitation
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 300,
          color: '#2C2C2C', marginBottom: 16, lineHeight: 1.3,
        }}>
          Sofia &amp; Marco
        </h1>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, marginBottom: 20,
        }}>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
          <svg width="8" height="8" viewBox="0 0 10 10">
            <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E" />
          </svg>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic', fontWeight: 300,
          fontSize: '1rem', color: '#5C4A2A', lineHeight: 1.7, opacity: 0.75,
        }}>
          This invitation is personal and requires a unique link.
          <br />Please use the link sent to you directly.
        </p>
      </div>
    </div>
  )
}