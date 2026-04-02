'use client'

import type { ItineraryItem } from '@/lib/types'

// Fixed set of icons — cycles if more than 5 items
const ICONS = [
  <svg key="0" width="28" height="32" viewBox="0 0 28 32" fill="none"><line x1="14" y1="1" x2="14" y2="8" stroke="var(--color-gold)" strokeWidth="1.1" strokeLinecap="round"/><line x1="11" y1="4" x2="17" y2="4" stroke="var(--color-gold)" strokeWidth="1.1" strokeLinecap="round"/><path d="M4 31 V18 Q4 9 14 9 Q24 9 24 18 V31" stroke="var(--color-gold)" strokeWidth="1" fill="rgba(var(--color-gold-rgb),0.07)" strokeLinejoin="round"/><line x1="2" y1="31" x2="26" y2="31" stroke="var(--color-gold)" strokeWidth="1.1"/><path d="M11 31 V25 Q11 21 14 21 Q17 21 17 25 V31" stroke="var(--color-gold)" strokeWidth="0.9" fill="rgba(var(--color-gold-rgb),0.12)"/><circle cx="14" cy="16" r="2.5" stroke="var(--color-gold)" strokeWidth="0.8" fill="rgba(var(--color-gold-rgb),0.15)"/></svg>,
  <svg key="1" width="28" height="32" viewBox="0 0 28 32" fill="none"><path d="M7 5 L14 3 L21 5 L19 18 Q14 24 9 18Z" stroke="var(--color-gold)" strokeWidth="1" fill="rgba(var(--color-gold-rgb),0.08)"/><line x1="14" y1="18" x2="14" y2="27" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><line x1="9" y1="27" x2="19" y2="27" stroke="var(--color-gold)" strokeWidth="1.1"/><circle cx="14" cy="11" r="3" stroke="var(--color-gold)" strokeWidth="0.8" fill="rgba(var(--color-gold-rgb),0.12)"/></svg>,
  <svg key="2" width="28" height="32" viewBox="0 0 28 32" fill="none"><path d="M8 5 L11 20 Q11 24 8 26" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" fill="none"/><line x1="5" y1="5" x2="13" y2="5" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><line x1="5" y1="30" x2="11" y2="30" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><line x1="8" y1="26" x2="8" y2="30" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><path d="M20 5 L17 20 Q17 24 20 26" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" fill="none"/><line x1="15" y1="5" x2="23" y2="5" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><line x1="17" y1="30" x2="23" y2="30" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><line x1="20" y1="26" x2="20" y2="30" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><line x1="14" y1="9" x2="14" y2="14" stroke="var(--color-gold)" strokeWidth="0.8" strokeLinecap="round"/><line x1="11" y1="11.5" x2="17" y2="11.5" stroke="var(--color-gold)" strokeWidth="0.8" strokeLinecap="round"/></svg>,
  <svg key="3" width="28" height="32" viewBox="0 0 28 32" fill="none"><ellipse cx="14" cy="18" rx="10" ry="2.5" stroke="var(--color-gold)" strokeWidth="1"/><path d="M4 18 Q4 27 14 29 Q24 27 24 18" stroke="var(--color-gold)" strokeWidth="1" fill="rgba(var(--color-gold-rgb),0.06)"/><line x1="10" y1="6" x2="10" y2="15" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><line x1="14" y1="4" x2="14" y2="15" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/><line x1="18" y1="6" x2="18" y2="15" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round"/></svg>,
  <svg key="4" width="28" height="32" viewBox="0 0 28 32" fill="none"><circle cx="10" cy="6" r="2.5" stroke="var(--color-gold)" strokeWidth="1"/><circle cx="18" cy="6" r="2.5" stroke="var(--color-gold)" strokeWidth="1"/><path d="M8 11 Q6 19 9 26" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" fill="none"/><path d="M12 11 Q14 21 11 26" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" fill="none"/><path d="M16 11 Q18 19 16 26" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" fill="none"/><path d="M20 11 Q22 21 19 26" stroke="var(--color-gold)" strokeWidth="1" strokeLinecap="round" fill="none"/></svg>,
]

export default function ItinerarySection({ itinerary }: { itinerary: ItineraryItem[] }) {
  if (!itinerary.length) return null

  return (
    <section className="reveal" style={{ padding: '80px 24px 72px', background: 'var(--gradient-section)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 10 }}>Schedule</p>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-heading)', marginBottom: 6 }}>Itinerary</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)"/></svg>
            <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to bottom, transparent, rgba(var(--color-gold-rgb),0.5) 8%, rgba(var(--color-gold-rgb),0.5) 92%, transparent)',
            pointerEvents: 'none',
          }}/>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {itinerary.map((item, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flexDirection: isLeft ? 'row' : 'row-reverse', gap: 0 }}>
                  <div style={{
                    flex: 1, padding: '16px 18px', textAlign: isLeft ? 'right' : 'left',
                    background: 'var(--gradient-card)',
                    border: '1px solid rgba(var(--color-gold-rgb),0.25)', borderRadius: 2,
                    boxShadow: '0 2px 16px rgba(var(--color-gold-dark-rgb),0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', top: '50%', [isLeft ? 'right' : 'left']: -5,
                      transform: 'translateY(-50%)', width: 0, height: 0,
                      borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
                      [isLeft ? 'borderLeft' : 'borderRight']: '5px solid rgba(var(--color-gold-rgb),0.3)',
                    }}/>
                    <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.24em', color: 'var(--color-gold)', marginBottom: 3 }}>
                      {item.time_label}
                    </p>
                    <p className="font-display font-medium" style={{ fontSize: '1rem', color: 'var(--color-heading)', marginBottom: 2, lineHeight: 1.2 }}>
                      {item.title}
                    </p>
                    <p className="font-body" style={{ fontSize: 11, color: 'var(--color-gold-dark)', opacity: 0.75 }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{
                    flexShrink: 0, width: 52, height: 52, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--gradient-card)',
                    border: '1px solid rgba(var(--color-gold-rgb),0.35)',
                    boxShadow: '0 2px 12px rgba(var(--color-gold-dark-rgb),0.1)',
                    zIndex: 2, flexBasis: 52,
                  }}>
                    {ICONS[i % ICONS.length]}
                  </div>

                  <div style={{ flex: 1 }}/>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 44 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(var(--color-gold-rgb),0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--color-gold)', opacity: 0.7 }}>A Day to Remember</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(var(--color-gold-rgb),0.3))' }} />
        </div>
      </div>
    </section>
  )
}