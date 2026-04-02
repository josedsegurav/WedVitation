'use client'

import { useState } from 'react'

type Attending  = 'yes' | 'no' | ''
type FormState  = { name: string; attending: Attending; message: string }
type SubmitState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'success'; attending: 'yes' | 'no'; guestName: string }
  | { phase: 'error';   message: string }

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.28em', color: 'var(--color-gold-dark)', marginBottom: 8 }}>
      {children}
    </p>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontFamily: 'inherit', fontSize: 12,
  color: 'var(--color-heading)', background: 'rgba(var(--color-gold-rgb),0.04)',
  border: '1px solid rgba(var(--color-gold-rgb),0.28)', borderRadius: 1, outline: 'none',
}

const cardStyle: React.CSSProperties = {
  position: 'relative', background: 'var(--gradient-card)',
  border: '1px solid rgba(var(--color-gold-rgb),0.28)', borderRadius: 2,
  boxShadow: '0 2px 16px rgba(var(--color-gold-dark-rgb),0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
  overflow: 'hidden',
}

function Corners() {
  return (
    <>
      {(['tl','tr','bl','br'] as const).map(c => (
        <span key={c} style={{
          position: 'absolute',
          top:    c.startsWith('t') ? 5 : undefined, bottom: c.startsWith('b') ? 5 : undefined,
          left:   c.endsWith('l')   ? 5 : undefined, right:  c.endsWith('r')   ? 5 : undefined,
          width: 8, height: 8,
          borderTop:    c.startsWith('t') ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
          borderBottom: c.startsWith('b') ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
          borderLeft:   c.endsWith('l')   ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
          borderRight:  c.endsWith('r')   ? '1px solid rgba(var(--color-gold-rgb),0.4)' : undefined,
        }}/>
      ))}
    </>
  )
}

function getToken(): string {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('token') ?? ''
}

export default function RSVPSection({ rsvpDeadline }: { rsvpDeadline: string }) {
  const [state, setState] = useState<SubmitState>({ phase: 'idle' })
  const [form,  setForm]  = useState<FormState>({ name: '', attending: '', message: '' })

  const set = (key: keyof FormState, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.attending) return
    setState({ phase: 'submitting' })
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: getToken(), name: form.name.trim(), attending: form.attending, message: form.message.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setState({ phase: 'error', message: data.error ?? 'Something went wrong. Please try again.' }); return }
      setState({ phase: 'success', attending: data.attending, guestName: data.guestName ?? form.name.trim() })
    } catch {
      setState({ phase: 'error', message: 'Connection error. Please check your internet and try again.' })
    }
  }

  return (
    <section className="reveal" id="rsvp" style={{ padding: '80px 24px 72px', background: 'var(--gradient-section)' }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: 'var(--color-gold)', marginBottom: 10 }}>RSVP</p>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: 'var(--color-heading)', marginBottom: 6 }}>
            Confirm Attendance
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-r)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="var(--color-gold)"/></svg>
            <div style={{ width: 64, height: 1, background: 'var(--gradient-ornament-line-l)' }} />
          </div>
          {rsvpDeadline && (
            <p className="font-display italic font-light" style={{ fontSize: '0.95rem', color: 'var(--color-gold-dark)', opacity: 0.75 }}>
              Please respond by {rsvpDeadline}
            </p>
          )}
        </div>

        {state.phase === 'success' && (
          <div style={{ ...cardStyle, padding: '44px 32px', textAlign: 'center' }}>
            <Corners />
            <svg width="36" height="22" viewBox="0 0 36 22" fill="none" style={{ margin: '0 auto 16px' }}>
              <circle cx="13" cy="11" r="9" stroke="var(--color-gold)" strokeWidth="1.2" fill="none"/>
              <circle cx="23" cy="11" r="9" stroke="var(--color-gold)" strokeWidth="1.2" fill="rgba(var(--color-gold-rgb),0.06)"/>
              <path d="M17 5 Q18 11 17 17" stroke="var(--color-gold)" strokeWidth="0.8" fill="none" opacity="0.5"/>
            </svg>
            <h3 className="font-script" style={{ fontSize: '2.4rem', color: 'var(--color-gold)', lineHeight: 1.1, marginBottom: 10 }}>Thank You!</h3>
            <div style={{ width: 24, height: 1, background: 'rgba(var(--color-gold-rgb),0.4)', margin: '0 auto 14px' }} />
            <p className="font-display italic font-light" style={{ fontSize: '1rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
              {state.attending === 'yes'
                ? <>{`We can't wait to celebrate with you, `}<strong style={{ fontStyle: 'normal' }}>{state.guestName}</strong>!</>
                : <>We&apos;ll miss you, <strong style={{ fontStyle: 'normal' }}>{state.guestName}</strong>.<br/>Thank you for letting us know.</>
              }
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 20,
              padding: '6px 14px',
              background: state.attending === 'yes' ? 'rgba(74,122,68,0.1)' : 'rgba(160,60,60,0.08)',
              border: `1px solid ${state.attending === 'yes' ? 'rgba(74,122,68,0.28)' : 'rgba(154,48,48,0.22)'}`,
              borderRadius: 2,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', background: state.attending === 'yes' ? '#3A6A34' : '#943030' }}/>
              <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: state.attending === 'yes' ? '#3A6A34' : '#943030' }}>
                {state.attending === 'yes' ? 'Confirmed' : 'Declined'}
              </span>
            </div>
          </div>
        )}

        {(state.phase === 'idle' || state.phase === 'submitting' || state.phase === 'error') && (
          <form onSubmit={handleSubmit} style={{ ...cardStyle, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Corners />
            <div>
              <FieldLabel>Full Name *</FieldLabel>
              <input type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Your full name" disabled={state.phase === 'submitting'}
                style={{ ...inputBase, opacity: state.phase === 'submitting' ? 0.6 : 1 }}/>
            </div>
            <div>
              <FieldLabel>Will you attend? *</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(['yes', 'no'] as const).map(val => {
                  const active = form.attending === val
                  return (
                    <button key={val} type="button" disabled={state.phase === 'submitting'}
                      onClick={() => set('attending', val)}
                      style={{
                        padding: '10px 0', fontFamily: 'inherit', fontSize: 9, letterSpacing: '0.22em',
                        textTransform: 'uppercase', cursor: state.phase === 'submitting' ? 'default' : 'pointer',
                        borderRadius: 1, transition: 'all 0.2s',
                        background: active ? 'var(--gradient-gold-btn)' : 'transparent',
                        color: active ? 'var(--color-btn-text)' : 'var(--color-gold-dark)',
                        border: active ? '1px solid transparent' : '1px solid rgba(var(--color-gold-rgb),0.35)',
                        opacity: state.phase === 'submitting' ? 0.6 : 1,
                      }}>
                      {val === 'yes' ? '✓  Joyfully Accept' : '✕  Regretfully Decline'}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <FieldLabel>Message for the couple (optional)</FieldLabel>
              <textarea rows={3} value={form.message} onChange={e => set('message', e.target.value)}
                placeholder="Share your warm wishes…" disabled={state.phase === 'submitting'}
                style={{ ...inputBase, resize: 'none', lineHeight: 1.6, opacity: state.phase === 'submitting' ? 0.6 : 1 }}/>
            </div>
            {state.phase === 'error' && (
              <div style={{ padding: '10px 14px', background: 'rgba(154,48,48,0.06)', border: '1px solid rgba(154,48,48,0.22)', borderRadius: 1 }}>
                <p className="font-body" style={{ fontSize: 11, color: '#943030', lineHeight: 1.5 }}>{state.message}</p>
                <button type="button" onClick={() => setState({ phase: 'idle' })} className="font-body uppercase"
                  style={{ marginTop: 8, fontSize: 9, letterSpacing: '0.18em', background: 'none', border: 'none', cursor: 'pointer', color: '#943030', textDecoration: 'underline', padding: 0 }}>
                  Try again
                </button>
              </div>
            )}
            <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(var(--color-gold-rgb),0.3), transparent)' }}/>
            <button type="submit" disabled={state.phase === 'submitting' || !form.name.trim() || !form.attending}
              className="font-body uppercase"
              style={{
                width: '100%', padding: '13px 0', fontSize: 10, letterSpacing: '0.26em',
                cursor: state.phase === 'submitting' || !form.name.trim() || !form.attending ? 'default' : 'pointer',
                borderRadius: 1, border: 'none', background: 'var(--gradient-gold-btn)', color: 'var(--color-btn-text)',
                boxShadow: '0 4px 18px rgba(var(--color-gold-dark-rgb),0.22)', transition: 'opacity 0.2s',
                opacity: state.phase === 'submitting' || !form.name.trim() || !form.attending ? 0.55 : 1,
              }}
              onMouseEnter={e => { if (state.phase !== 'submitting') e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { if (state.phase !== 'submitting') e.currentTarget.style.opacity = '1' }}>
              {state.phase === 'submitting' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ animation: 'rsvpSpin 0.8s linear infinite' }}>
                    <style>{`@keyframes rsvpSpin{to{transform:rotate(360deg)}}`}</style>
                    <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Sending…
                </span>
              ) : 'Confirm Attendance'}
            </button>
          </form>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(var(--color-gold-rgb),0.3))' }}/>
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--color-gold)', opacity: 0.7 }}>We Hope to See You There</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(var(--color-gold-rgb),0.3))' }}/>
        </div>
      </div>
    </section>
  )
}