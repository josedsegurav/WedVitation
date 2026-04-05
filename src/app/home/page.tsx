'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ─── Ornament components ──────────────────────────────────────

const DiamondDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '0 auto' }}>
    <div style={{ width: 60, height: 1, background: 'linear-gradient(to right, transparent, var(--color-gold))' }} />
    <svg width="8" height="8" viewBox="0 0 10 10">
      <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)" />
    </svg>
    <div style={{ width: 60, height: 1, background: 'linear-gradient(to left, transparent, var(--color-gold))' }} />
  </div>
)

const CornerAccents = ({ size = 10, color = 'rgba(201,169,110,0.4)' }: { size?: number; color?: string }) => (
  <>
    {(['tl','tr','bl','br'] as const).map(c => (
      <span key={c} style={{
        position: 'absolute',
        top:    c.startsWith('t') ? 10 : undefined,
        bottom: c.startsWith('b') ? 10 : undefined,
        left:   c.endsWith('l')   ? 10 : undefined,
        right:  c.endsWith('r')   ? 10 : undefined,
        width: size, height: size,
        borderTop:    c.startsWith('t') ? `1px solid ${color}` : undefined,
        borderBottom: c.startsWith('b') ? `1px solid ${color}` : undefined,
        borderLeft:   c.endsWith('l')   ? `1px solid ${color}` : undefined,
        borderRight:  c.endsWith('r')   ? `1px solid ${color}` : undefined,
      }} />
    ))}
  </>
)

// ─── Feature card ─────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }: {
  icon: React.ReactNode
  title: string
  desc: string
  delay: number
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      position: 'relative',
      background: 'linear-gradient(160deg, var(--color-card-from), var(--color-card-to))',
      border: '1px solid var(--color-border)',
      borderRadius: 4,
      padding: '32px 28px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      <CornerAccents size={8} color="rgba(201,169,110,0.25)" />
      <div style={{ marginBottom: 16 }}>{icon}</div>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.2rem', fontWeight: 400,
        color: 'var(--color-heading)', marginBottom: 8,
      }}>{title}</p>
      <p style={{
        fontSize: '0.9rem', lineHeight: 1.7,
        color: 'var(--color-body)', opacity: 0.75,
      }}>{desc}</p>
    </div>
  )
}

// ─── Step item ────────────────────────────────────────────────
function StepItem({ n, title, desc, delay }: { n: string; title: string; desc: string; delay: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      display: 'flex', gap: 20, alignItems: 'flex-start',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-20px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      <div style={{
        flexShrink: 0,
        width: 40, height: 40,
        border: '1px solid var(--color-gold)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1rem', fontWeight: 400, color: 'var(--color-gold)',
        background: 'rgba(201,169,110,0.06)',
      }}>{n}</div>
      <div>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1.2rem', fontWeight: 400,
          color: 'var(--color-heading)', marginBottom: 4,
        }}>{title}</p>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-body)', opacity: 0.7 }}>{desc}</p>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter()
  const [heroVisible, setHeroVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      fontFamily: "'Jost', sans-serif",
      background: 'var(--color-page-bg)',
      color: 'var(--color-heading)',
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Great+Vibes&family=Jost:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrollY > 40 ? 'rgba(250,246,240,0.95)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(8px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid var(--color-border-light)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <circle cx="11" cy="16" r="7" stroke="var(--color-gold)" strokeWidth="1.3" fill="none"/>
            <circle cx="21" cy="16" r="7" stroke="var(--color-gold)" strokeWidth="1.3" fill="none"/>
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.1rem', fontWeight: 400, letterSpacing: '0.05em',
            color: 'var(--color-heading)',
          }}>wedvitation</span>
        </div>
        {/* <button
          onClick={() => router.push('/auth/login')}
          style={{
            padding: '8px 20px', fontSize: 10, letterSpacing: '0.2em',
            textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
            fontFamily: "'Jost', sans-serif",
            background: 'transparent',
            color: 'var(--color-gold-dark)',
            border: '1px solid var(--color-border)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLButtonElement).style.background = 'rgba(201,169,110,0.08)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLButtonElement).style.background = 'transparent'
          }}
        >
          Sign In
        </button> */}
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        background: 'linear-gradient(160deg, var(--color-page-bg) 0%, var(--color-section-mid) 55%, var(--color-section-end) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Dot texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, var(--color-gold) 1px, transparent 1px)',
          backgroundSize: '36px 36px', opacity: 0.04,
        }} />

        {/* Decorative rings */}
        <div style={{
          position: 'absolute', top: '10%', right: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '-8%',
          width: 500, height: 500, borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.08)',
          pointerEvents: 'none',
        }} />

        {/* Eyebrow */}
        <p style={{
          fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase',
          color: 'var(--color-gold)', marginBottom: 20,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s ease 0.1s',
        }}>
          Digital Wedding Invitations
        </p>

        {/* Script headline */}
        <h1 style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: 'clamp(3.5rem, 10vw, 7rem)',
          fontWeight: 400, color: 'var(--color-heading)',
          lineHeight: 1.1, marginBottom: 8,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.2s',
        }}>
          Your love story,
        </h1>
        <h1 style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: 'clamp(3.5rem, 10vw, 7rem)',
          fontWeight: 400,
          lineHeight: 1.1, marginBottom: 28,
          background: 'linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-light) 50%, var(--color-gold-dark) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.35s',
          padding: '5px 0'
        }}>
          beautifully shared.
        </h1>

        <div style={{
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s ease 0.5s',
          marginBottom: 24,
        }}>
          <DiamondDivider />
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(1.3rem, 2.5vw, 1.25rem)',
          color: 'var(--color-body)', lineHeight: 1.8,
          maxWidth: 480, marginBottom: 40,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s ease 0.6s',
        }}>
          Create a personalised digital invitation, manage your guest list,
          and coordinate seating — all in one elegant space.
        </p>

        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.7s ease 0.75s',
        }}>
          <button
            onClick={() => router.push('/auth/login')}
            style={{
              padding: '14px 32px', fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
              fontFamily: "'Jost', sans-serif",
              background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
              color: 'var(--color-btn-text)', border: 'none',
              boxShadow: '0 4px 20px rgba(201,169,110,0.35)',
              transition: 'all 0.25s',
              animation: 'float 3s ease-in-out infinite',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'
              ;(e.target as HTMLButtonElement).style.boxShadow = '0 8px 28px rgba(201,169,110,0.45)'
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.transform = ''
              ;(e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(201,169,110,0.35)'
            }}
          >
            Create Your Invitation
          </button>
          <a href="#how-it-works" style={{
            padding: '14px 28px', fontSize: 10, letterSpacing: '0.2em',
            textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
            fontFamily: "'Jost', sans-serif",
            background: 'transparent',
            color: 'var(--color-gold-dark)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'all 0.2s',
          }}>
            See How It Works
          </a>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          opacity: heroVisible ? 0.5 : 0, transition: 'opacity 0.7s ease 1.2s',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <p style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
            Scroll
          </p>
          <svg width="12" height="18" viewBox="0 0 12 18" fill="none" style={{ animation: 'float 1.8s ease-in-out infinite' }}>
            <path d="M6 0v14M1 9l5 6 5-6" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>
      </section>

      {/* ── INVITATION PREVIEW ──────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) 24px',
        background: 'var(--gradient-dark)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(201,169,110,0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px', opacity: 0.3,
        }} />

        <p style={{
          fontSize: '0.8rem', letterSpacing: '0.35em', textTransform: 'uppercase',
          color: 'var(--color-gold)', marginBottom: 12,
        }}>
          The Experience
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
          color: 'var(--color-heading-light)', marginBottom: 12,
        }}>
          An invitation your guests will remember
        </h2>
        <p style={{
          fontSize: '1rem', color: 'rgba(245,237,224,0.6)', lineHeight: 1.7,
          maxWidth: 420, margin: '0 auto 48px',
        }}>
          Each invitation is personalised to your guest, delivered via a unique private link.
        </p>

        {/* Mock invitation card */}
        <div style={{
          maxWidth: 340, margin: '0 auto',
          background: 'linear-gradient(160deg, rgba(253,248,242,0.97), rgba(245,237,224,0.88))',
          border: '1px solid rgba(201,169,110,0.3)',
          borderRadius: 4, padding: '40px 32px',
          boxShadow: '0 8px 48px rgba(0,0,0,0.4)',
          position: 'relative',
          animation: 'float 4s ease-in-out infinite',
        }}>
          <CornerAccents size={10} color="rgba(201,169,110,0.4)" />

          <p style={{ fontSize: 8, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 6 }}>
            You are invited
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300,
            fontSize: '0.9rem', color: 'var(--color-body)', marginBottom: 16,
          }}>
            Dear <span style={{ color: 'var(--color-gold-dark)' }}>Isabella</span>,
          </p>

          <DiamondDivider />

          <h3 style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: '2.2rem', color: 'var(--color-heading)',
            margin: '16px 0 4px',
          }}>
            Sofia &amp; Marco
          </h3>
          <p style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 16 }}>
            June 15, 2026
          </p>

          <DiamondDivider />

          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
            fontSize: '0.8rem', color: 'var(--color-body)', opacity: 0.7,
            lineHeight: 1.6, marginTop: 16,
          }}>
            Cathedral of Santa Maria<br />Florence, Tuscany
          </p>

          <div style={{
            marginTop: 20, padding: '8px 16px',
            background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
            borderRadius: 2,
            fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#FAF6F0',
          }}>
            Confirm Attendance
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) 24px',
        background: 'var(--gradient-section)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 12 }}>
          Everything You Need
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
          color: 'var(--color-heading)', marginBottom: 12,
        }}>
          One platform, every detail
        </h2>
        <p style={{
          fontSize: '1rem', color: 'var(--color-body)', opacity: 0.7, lineHeight: 1.7,
          maxWidth: 400, margin: '0 auto 48px',
        }}>
          From the first invitation to the final seating chart — designed to be beautiful and effortless.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16, maxWidth: 900, margin: '0 auto',
          textAlign: 'left',
        }}>
          <FeatureCard delay={0} icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4a1 1 0 00-1 1v14a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1z" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(201,169,110,0.08)"/>
              <path d="M8 10h8M8 14h5" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          } title="Digital Invitations" desc="Personalised per guest with a private link. Beautiful envelope animation, countdown, RSVP — all included." />

          <FeatureCard delay={100} icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="3" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(201,169,110,0.08)"/>
              <circle cx="17" cy="8" r="3" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(201,169,110,0.08)"/>
              <path d="M3 20c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          } title="Guest Management" desc="Add guests, track RSVPs, manage pass counts, and send WhatsApp reminders — all from your dashboard." />

          <FeatureCard delay={200} icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="1" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(201,169,110,0.08)"/>
              <rect x="13" y="3" width="8" height="8" rx="1" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(201,169,110,0.08)"/>
              <rect x="3" y="13" width="8" height="8" rx="1" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(201,169,110,0.08)"/>
              <rect x="13" y="13" width="8" height="8" rx="1" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(201,169,110,0.08)"/>
            </svg>
          } title="Seating Planner" desc="Drag-and-drop canvas to arrange tables and assign guests. Visual, intuitive, and stress-free." />

          <FeatureCard delay={300} icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(201,169,110,0.08)"/>
              <path d="M12 6v6l4 2" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          } title="Live Countdown" desc="A real-time countdown to your wedding day, shown to every guest when they open their invitation." />
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how-it-works" style={{
        padding: 'clamp(60px, 8vw, 100px) 24px',
        background: 'linear-gradient(160deg, var(--color-section-end) 0%, var(--color-section-mid) 100%)',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 12 }}>
              Getting Started
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300,
              color: 'var(--color-heading)',
            }}>
              Ready in minutes
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <StepItem delay={0}   n="I"   title="Sign in with your email" desc="No password needed. We send a magic link directly to your inbox." />
            <StepItem delay={100} n="II"  title="Set up your wedding" desc="Enter your names, date, and venue. Takes less than two minutes." />
            <StepItem delay={200} n="III" title="Add your guests" desc="Import or add guests one by one. Each gets a personalised private link." />
            <StepItem delay={300} n="IV"  title="Share & celebrate" desc="Send invitations via WhatsApp or any channel. Watch RSVPs roll in." />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) 24px',
        background: 'var(--gradient-dark)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(201,169,110,0.1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Spinning ring decoration */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500, borderRadius: '50%',
          border: '1px dashed rgba(201,169,110,0.15)',
          animation: 'spin-slow 30s linear infinite',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 16 }}>
            Begin Your Story
          </p>
          <h2 style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 400, color: 'var(--color-heading-light)',
            marginBottom: 16, lineHeight: 1.2,
          }}>
            The perfect invitation<br />awaits you
          </h2>
          <div style={{ marginBottom: 32 }}>
            <DiamondDivider />
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic', fontWeight: 300,
            fontSize: '1.2rem', color: 'rgba(245,237,224,0.65)',
            lineHeight: 1.7, maxWidth: 380, margin: '0 auto 36px',
          }}>
            Join couples who chose to make their wedding invitations as beautiful as their love.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            style={{
              padding: '15px 40px', fontSize: 10, letterSpacing: '0.24em',
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
              fontFamily: "'Jost', sans-serif",
              background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
              color: 'var(--color-btn-text)', border: 'none',
              boxShadow: '0 4px 24px rgba(201,169,110,0.4)',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)'
              ;(e.target as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(201,169,110,0.5)'
            }}
            onMouseLeave={e => {
              (e.target as HTMLButtonElement).style.transform = ''
              ;(e.target as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(201,169,110,0.4)'
            }}
          >
            Create Your Invitation
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        padding: '32px 24px',
        background: 'var(--color-section-end)',
        borderTop: '1px solid var(--color-border-light)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
          <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
            <circle cx="11" cy="16" r="7" stroke="var(--color-gold)" strokeWidth="1.3" fill="none"/>
            <circle cx="21" cy="16" r="7" stroke="var(--color-gold)" strokeWidth="1.3" fill="none"/>
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1rem', color: 'var(--color-body)',
          }}>wedvitation</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-body)', opacity: 0.5, letterSpacing: '0.05em' }}>
          Made with love, for love.
        </p>
      </footer>
    </div>
  )
}