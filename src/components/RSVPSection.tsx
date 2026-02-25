'use client'

import { useState } from 'react'

type FormState = {
  name: string
  attending: 'yes' | 'no' | ''
  message: string
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.28em', color: '#8B6914', marginBottom: 8 }}>
      {children}
    </p>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontFamily: 'inherit',
  fontSize: 12,
  color: '#2C2C2C',
  background: 'rgba(201,169,110,0.04)',
  border: '1px solid rgba(201,169,110,0.28)',
  borderRadius: 1,
  outline: 'none',
}

export default function RSVPSection() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: '', attending: '', message: '',
  })

  const set = (key: keyof FormState, val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.attending) return
    setSubmitted(true)
  }

  return (
    <section
      className="reveal"
      id="rsvp"
      style={{
        padding: '80px 24px 72px',
        background: 'linear-gradient(180deg, #FAF6F0 0%, #F5EDE0 50%, #FAF6F0 100%)',
      }}
    >
      <div style={{ maxWidth: 440, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p className="font-body uppercase" style={{ fontSize: 10, letterSpacing: '0.38em', color: '#C9A96E', marginBottom: 10 }}>
            RSVP
          </p>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#2C2C2C', marginBottom: 6 }}>
            Confirm Attendance
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 64, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }} />
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E"/>
            </svg>
            <div style={{ width: 64, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }} />
          </div>
          <p className="font-display italic font-light" style={{ fontSize: '0.95rem', color: '#8B6914', opacity: 0.75 }}>
            Please respond by May 1, 2026
          </p>
        </div>

        {/* Submitted state */}
        {submitted ? (
          <div
            style={{
              position: 'relative',
              padding: '44px 32px',
              textAlign: 'center',
              background: 'linear-gradient(160deg, rgba(253,248,242,0.95), rgba(245,237,224,0.8))',
              border: '1px solid rgba(201,169,110,0.28)',
              borderRadius: 2,
              boxShadow: '0 2px 16px rgba(139,105,20,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
              overflow: 'hidden',
            }}
          >
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

            {/* Rings icon */}
            <svg width="36" height="22" viewBox="0 0 36 22" fill="none" style={{ margin: '0 auto 16px' }}>
              <circle cx="13" cy="11" r="9"  stroke="#C9A96E" strokeWidth="1.2" fill="none"/>
              <circle cx="23" cy="11" r="9"  stroke="#C9A96E" strokeWidth="1.2" fill="rgba(201,169,110,0.06)"/>
              <path d="M17 5 Q18 11 17 17" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.5"/>
            </svg>

            <h3 className="font-script" style={{ fontSize: '2.4rem', color: '#C9A96E', lineHeight: 1.1, marginBottom: 10 }}>
              Thank You!
            </h3>
            <div style={{ width: 24, height: 1, background: 'rgba(201,169,110,0.4)', margin: '0 auto 14px' }} />
            <p className="font-display italic font-light" style={{ fontSize: '1rem', color: '#5C4A2A', lineHeight: 1.65 }}>
              {form.attending === 'yes'
                ? <>We can&apos;t wait to celebrate with you,<br /><strong style={{ fontStyle: 'normal' }}>{form.name}</strong>!</>
                : <>We&apos;ll miss you, <strong style={{ fontStyle: 'normal' }}>{form.name}</strong>.<br />Thank you for letting us know.</>
              }
            </p>
          </div>
        ) : (

          /* Form card */
          <form
            onSubmit={handleSubmit}
            style={{
              position: 'relative',
              padding: '32px 28px',
              background: 'linear-gradient(160deg, rgba(253,248,242,0.95), rgba(245,237,224,0.8))',
              border: '1px solid rgba(201,169,110,0.28)',
              borderRadius: 2,
              boxShadow: '0 2px 16px rgba(139,105,20,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
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

            {/* Name */}
            <div>
              <FieldLabel>Full Name *</FieldLabel>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Your full name"
                style={{ ...inputBase }}
              />
            </div>

            {/* Attendance */}
            <div>
              <FieldLabel>Will you attend? *</FieldLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {(['yes', 'no'] as const).map(val => {
                  const active = form.attending === val
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set('attending', val)}
                      style={{
                        padding: '10px 0',
                        fontFamily: 'inherit',
                        fontSize: 9,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        borderRadius: 1,
                        transition: 'all 0.2s',
                        background: active ? 'linear-gradient(135deg, #C9A96E, #8B6914)' : 'transparent',
                        color: active ? '#FAF6F0' : '#8B6914',
                        border: active ? '1px solid transparent' : '1px solid rgba(201,169,110,0.35)',
                      }}
                    >
                      {val === 'yes' ? '✓  Joyfully Accept' : '✕  Regretfully Decline'}
                    </button>
                  )
                })}
              </div>
            </div>



            {/* Message */}
            <div>
              <FieldLabel>Message for the couple (optional)</FieldLabel>
              <textarea
                rows={3}
                value={form.message}
                onChange={e => set('message', e.target.value)}
                placeholder="Share your warm wishes…"
                style={{ ...inputBase, resize: 'none', lineHeight: 1.6 }}
              />
            </div>

            {/* Thin rule before submit */}
            <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)' }} />

            {/* Submit */}
            <button
              type="submit"
              className="font-body uppercase"
              style={{
                width: '100%',
                padding: '13px 0',
                fontSize: 10,
                letterSpacing: '0.26em',
                cursor: 'pointer',
                borderRadius: 1,
                border: 'none',
                background: 'linear-gradient(135deg, #C9A96E, #8B6914)',
                color: '#FAF6F0',
                boxShadow: '0 4px 18px rgba(139,105,20,0.22)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Confirm Attendance
            </button>
          </form>
        )}

        {/* Bottom separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
          <span className="font-body uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: '#C9A96E', opacity: 0.7 }}>
            We Hope to See You There
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
        </div>

      </div>
    </section>
  )
}