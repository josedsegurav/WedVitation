'use client'
import { EVENTS } from '@/app/config';
import { WEDDING } from '@/app/config';

interface EventCardProps {
  type: 'ceremony' | 'reception'
  venue: string
  date: string
  time: string
  ampm: string
  address: string
  mapsUrl: string
}

// Church — clean minimal linework, fixed 40×44px viewBox
function ChurchIcon() {
  return (
    <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
      {/* Cross on top */}
      <line x1="20" y1="1" x2="20" y2="11" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16" y1="5" x2="24" y2="5" stroke="#C9A96E" strokeWidth="1.2" strokeLinecap="round"/>
      {/* Arch facade */}
      <path d="M8 43 V24 Q8 13 20 13 Q32 13 32 24 V43" stroke="#C9A96E" strokeWidth="1" fill="rgba(201,169,110,0.06)"/>
      {/* Base line */}
      <line x1="4" y1="43" x2="36" y2="43" stroke="#C9A96E" strokeWidth="1.2"/>
      {/* Door arch */}
      <path d="M16 43 V36 Q16 31 20 31 Q24 31 24 36 V43" stroke="#C9A96E" strokeWidth="0.9" fill="rgba(201,169,110,0.12)"/>
      {/* Window */}
      <circle cx="20" cy="22" r="3.5" stroke="#C9A96E" strokeWidth="0.8" fill="rgba(201,169,110,0.15)"/>
    </svg>
  )
}

// Champagne glasses — clean toast icon, 40×40
function GlassesIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      {/* Left glass */}
      <path d="M9 6 L13 22 Q13 26 10 28" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <line x1="7" y1="6" x2="15" y2="6" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7" y1="34" x2="13" y2="34" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round"/>
      <line x1="10" y1="28" x2="10" y2="34" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round"/>
      {/* Right glass */}
      <path d="M31 6 L27 22 Q27 26 30 28" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <line x1="25" y1="6" x2="33" y2="6" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round"/>
      <line x1="27" y1="34" x2="33" y2="34" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round"/>
      <line x1="30" y1="28" x2="30" y2="34" stroke="#C9A96E" strokeWidth="1" strokeLinecap="round"/>
      {/* Clink / sparkle between */}
      <line x1="20" y1="8" x2="20" y2="14" stroke="#C9A96E" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="17" y1="11" x2="23" y2="11" stroke="#C9A96E" strokeWidth="0.8" strokeLinecap="round"/>
      {/* Bubbles */}
      <circle cx="11" cy="14" r="1" fill="rgba(201,169,110,0.5)"/>
      <circle cx="13" cy="18" r="0.7" fill="rgba(201,169,110,0.4)"/>
      <circle cx="29" cy="14" r="1" fill="rgba(201,169,110,0.5)"/>
      <circle cx="27" cy="19" r="0.7" fill="rgba(201,169,110,0.4)"/>
    </svg>
  )
}

// Location pin SVG — 14px inline
function PinIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <path d="M6 1C3.79 1 2 2.79 2 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z" stroke="#C9A96E" strokeWidth="1" fill="rgba(201,169,110,0.2)"/>
      <circle cx="6" cy="5" r="1.5" fill="#C9A96E"/>
    </svg>
  )
}

function EventCard({ type, venue, date, time, ampm, address, mapsUrl }: EventCardProps) {
  const isCeremony = type === 'ceremony'

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '36px 28px 28px',
        background: 'linear-gradient(160deg, rgba(253,248,242,0.95), rgba(245,237,224,0.8))',
        border: '1px solid rgba(201,169,110,0.28)',
        borderRadius: 2,
        boxShadow: '0 2px 16px rgba(139,105,20,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        overflow: 'hidden',
      }}
    >
      {/* Corner accents */}
      {(['tl','tr','bl','br'] as const).map(c => (
        <span key={c} style={{
          position: 'absolute',
          top:    c.startsWith('t') ? 5 : undefined,
          bottom: c.startsWith('b') ? 5 : undefined,
          left:   c.endsWith('l')   ? 5 : undefined,
          right:  c.endsWith('r')   ? 5 : undefined,
          width: 8, height: 8,
          borderTop:    c.startsWith('t') ? '1px solid rgba(201,169,110,0.4)' : undefined,
          borderBottom: c.startsWith('b') ? '1px solid rgba(201,169,110,0.4)' : undefined,
          borderLeft:   c.endsWith('l')   ? '1px solid rgba(201,169,110,0.4)' : undefined,
          borderRight:  c.endsWith('r')   ? '1px solid rgba(201,169,110,0.4)' : undefined,
        }}/>
      ))}

      {/* Large ghost number behind — the "surprising" element */}
      <span
        className="font-display"
        style={{
          position: 'absolute',
          top: -10,
          right: -4,
          fontSize: 120,
          fontWeight: 300,
          lineHeight: 1,
          color: 'rgba(201,169,110,0.07)',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '-0.04em',
        }}
      >
        {WEDDING.dateDisplay.split(' ')[0]}
      </span>

      {/* Eyebrow label */}
      <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.38em', color: '#C9A96E', marginBottom: 16 }}>
        {isCeremony ? 'Religious Ceremony' : 'Reception'}
      </p>

      {/* Icon */}
      <div style={{ marginBottom: 14 }}>
        {isCeremony ? <ChurchIcon /> : <GlassesIcon />}
      </div>

      {/* Venue name */}
      <p className="font-display font-light" style={{ fontSize: '1.25rem', color: '#2C2C2C', marginBottom: 2 }}>
        {venue}
      </p>

      {/* Thin rule */}
      <div style={{ width: 24, height: 1, background: 'rgba(201,169,110,0.4)', margin: '10px auto 14px' }} />

      {/* Date + time block — the hero of each card */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
        <span className="font-display" style={{ fontSize: '3.2rem', fontWeight: 300, lineHeight: 1, color: '#C9A96E', letterSpacing: '-0.02em' }}>
          {time}
        </span>
        <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', color: '#8B6914' }}>
          {ampm}
        </span>
      </div>
      <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.28em', color: '#8B6914', marginBottom: 20, opacity: 0.7 }}>
        {date}
      </p>

      {/* Address */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 5, marginBottom: 22, maxWidth: 200 }}>
        <PinIcon />
        <p className="font-body" style={{ fontSize: 11, lineHeight: 1.6, color: '#5C4A2A', opacity: 0.75, textAlign: 'left' }}>
          {address}
        </p>
      </div>

      {/* CTA */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-body uppercase"
        style={{
          fontSize: 9,
          letterSpacing: '0.22em',
          color: '#8B6914',
          padding: '9px 22px',
          border: '1px solid rgba(201,169,110,0.5)',
          borderRadius: 1,
          background: 'rgba(201,169,110,0.06)',
          textDecoration: 'none',
          transition: 'background 0.2s',
          display: 'inline-block',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.14)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.06)')}
      >
        View Location
      </a>
    </div>
  )
}

export default function EventSection() {
  return (
    <section
      className="reveal"
      id="events"
      style={{
        padding: '80px 24px 72px',
        background: 'linear-gradient(180deg, #FAF6F0 0%, #F5EDE0 50%, #FAF6F0 100%)',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: '#C9A96E', marginBottom: 10 }}>
            Event Details
          </p>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#2C2C2C', marginBottom: 6 }}>
            Ceremony &amp; Celebration
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E"/>
            </svg>
            <div style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          {EVENTS.map(event => (
            <EventCard
              key={event.type}
              type={event.type}
              venue={event.venue}
              date={event.date}
              time={event.time}
              ampm={event.ampm}
              address={event.address}
              mapsUrl={event.mapsUrl}
            />
          ))}
        </div>

        {/* Bottom separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#C9A96E', opacity: 0.7 }}>
            June 15 · Tuscany
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
        </div>

      </div>
    </section>
  )
}