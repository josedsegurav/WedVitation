'use client'

import { useState } from 'react'

interface Props {
  onOpen: () => void
}

const ENV_W = 320
const ENV_H = 210
const FLAP_H = Math.round(ENV_H * 0.52)
const CARD_INSET = 10

// Z-index layers — explicit constants so stacking is always predictable
// closed:  bottom-fold(1) < body(2) < card(3) < seal(10) < flap(20)
// opening: bottom-fold(1) < body(2) < flap(3) < seal(10) < card(25)
const Z = {
  bottomFold: 4,
  body:       4,
  card:       3,   // behind seal & flap while closed; boosted to 25 when rising
  seal:       30,  // always above body & card, always above flap when open
  flap:       20,  // above seal while closed; drops to 3 while opening
}

export default function EnvelopeOpener({ onOpen }: Props) {
  const [isOpening, setIsOpening] = useState(false)
  const [cardRising, setCardRising] = useState(false)

  const handleOpen = () => {
    if (isOpening) return
    setIsOpening(true)
    setTimeout(() => setCardRising(true), 700)
    setTimeout(() => onOpen(), 2100)
  }

  return (
    <div
      onClick={handleOpen}
      className="fixed w-full h-full inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #FDF8F2 0%, #F5EDE0 55%, #E8D8C0 100%)' }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A96E 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          opacity: 0.06,
        }}
      />

      {/* Corner ornaments */}
      <span className="absolute pointer-events-none animate-float" style={{ top: 40,   left: 32,  fontSize: 18, color: '#C9A96E', opacity: 0.25, animationDelay: '0s'   }}>✦</span>
      <span className="absolute pointer-events-none animate-float" style={{ top: 68,   right: 40, fontSize: 13, color: '#C9A96E', opacity: 0.20, animationDelay: '1.5s' }}>✦</span>
      <span className="absolute pointer-events-none animate-float" style={{ bottom: 56, left: 44, fontSize: 15, color: '#C9A96E', opacity: 0.20, animationDelay: '1s'   }}>✦</span>
      <span className="absolute pointer-events-none animate-float" style={{ bottom: 40, right: 30, fontSize: 17, color: '#C9A96E', opacity: 0.25, animationDelay: '2.5s' }}>✦</span>

      {/* Central column */}
      <div className="flex flex-col items-center" style={{ perspective: '900px' }}>

        {/* Names */}
        <div
          className="text-center mb-7 transition-all duration-500"
          style={{ opacity: isOpening ? 0 : 1, transform: isOpening ? 'translateY(-8px)' : 'translateY(0)' }}
        >
          <p className="font-body uppercase" style={{ fontSize: 11, letterSpacing: '0.32em', color: '#C9A96E', marginBottom: 4 }}>
            You are invited to
          </p>
          <h1
            className="font-script"
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 3rem)',
              lineHeight: 1.15,
              background: 'linear-gradient(135deg, #C9A96E 0%, #E8D5B0 48%, #8B6914 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Sofia &amp; Marco
          </h1>
        </div>

        {/* ── Envelope wrapper ── overflow:visible so card can exit upward */}
        <div style={{ position: 'relative', width: ENV_W, height: ENV_H, flexShrink: 0 }}>

          {/* 1 · Bottom-triangle fold (decorative, lowest layer) */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: Math.round(ENV_H * 0.48),
            clipPath: 'polygon(0 100%, 100% 100%, 50% 0)',
            background: 'linear-gradient(0deg, #D8B86A 0%, #EDD9B8 100%)',
            borderRadius: '0 0 8px 8px',
            zIndex: Z.bottomFold,
          }} />

          {/* 2 · Envelope body — NO overflow:hidden so seal is not clipped */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '0 0 8px 8px',
            background: 'linear-gradient(160deg, #F5EAD7 0%, #EDD9B8 100%)',
            boxShadow: '0 20px 50px rgba(139,105,20,0.22)',
            zIndex: Z.body,
          }}>
            {/* V-fold crease lines */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '0 0 8px 8px',
              background: [
                'linear-gradient(to bottom-right, rgba(201,169,110,0.12) 50%, transparent 50%)',
                'linear-gradient(to bottom-left,  rgba(201,169,110,0.12) 50%, transparent 50%)',
              ].join(', '),
            }} />
          </div>

          {/* 3 · Invitation card — sits inside envelope, rises out on open */}
          <div style={{
            position: 'absolute',
            left: CARD_INSET, right: CARD_INSET,
            top: 8, height: ENV_H - 16,
            borderRadius: 4,
            background: 'linear-gradient(160deg, #FFFDF9 0%, #FDF3E3 100%)',
            boxShadow: '0 -4px 18px rgba(139,105,20,0.12)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            zIndex: cardRising ? 45 : Z.card,
            transform: cardRising ? `translateY(-${ENV_H + 24}px)` : 'translateY(0)',
            transition: 'transform 1s cubic-bezier(0.33,1,0.68,1)',
          }}>
            <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E, transparent)' }} />
            <span className="font-script" style={{ fontSize: 21, color: '#C9A96E', lineHeight: 1.2 }}>Sofia &amp; Marco</span>
            <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: '#8B6914' }}>June 15 · 2026</span>
            <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E, transparent)' }} />
          </div>

          {/* 4 · Wax seal — SIBLING of flap, always above the body, above flap when open */}
          <div style={{
            position: 'absolute',
            width: 52, height: 52, borderRadius: '50%',
            // Centre it vertically on the fold line between flap and body
            top: FLAP_H - 26,
            left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #D4A842 0%, #7A5810 100%)',
            boxShadow: '0 3px 14px rgba(139,105,20,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            // While closed: flap(20) is above seal(10) — seal is hidden under flap.
            // While opening: flap drops to z:3, seal(10) appears on top.
            zIndex: Z.seal,
          }}>
            <span className="font-script text-white" style={{ fontSize: 22, lineHeight: 1, marginTop: 2 }}>S</span>
          </div>

          {/* 5 · Envelope flap — highest z while closed, drops below seal when opening */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: FLAP_H,
            transformOrigin: 'top center',
            transform: isOpening ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            transition: 'transform 0.85s cubic-bezier(0.4,0,0.2,1)',
            zIndex: isOpening ? Z.seal : Z.flap,   // drops to 3 when rotating away
          }}>
            <div style={{
              width: '100%', height: '100%',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: 'linear-gradient(170deg, #ECD898 0%, #C9A030 100%)',
              borderRadius: '6px 6px 0 0',
            }} />
          </div>

        </div>{/* end envelope wrapper */}

        {/* Tap hint */}
        <div
          className="flex flex-col items-center mt-8 transition-all duration-500"
          style={{ opacity: isOpening ? 0 : 1, transform: isOpening ? 'translateY(6px)' : 'translateY(0)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
            <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.22em', color: '#C9A96E' }}>
              Tap to open your invitation
            </p>
            <div style={{ width: 24, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
          </div>
          <div className="mt-3 animate-bounce" style={{ color: '#C9A96E', opacity: 0.55 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="5 13 12 19 19 13" />
            </svg>
          </div>
        </div>
      </div>

      {/* Footer label */}
      <p
        className="absolute bottom-5 font-body uppercase pointer-events-none"
        style={{ fontSize: 9, letterSpacing: '0.25em', color: '#8B6914', opacity: 0.28 }}
      >
        Wedding Invitation
      </p>
    </div>
  )
}