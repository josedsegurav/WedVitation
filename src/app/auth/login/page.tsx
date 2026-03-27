'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Phase = 'idle' | 'sending' | 'sent' | 'error'

export default function LoginPage() {
  const [email,  setEmail]  = useState('')
  const [phase,  setPhase]  = useState<Phase>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setPhase('sending')
    setErrMsg('')

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setErrMsg(error.message)
      setPhase('error')
      return
    }

    setPhase('sent')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FAF6F0 0%, #F0E4CA 55%, #EDD9B8 100%)',
      fontFamily: "'Jost', sans-serif",
      padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&family=Great+Vibes&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none; border-color: rgba(201,169,110,0.6) !important; }
      `}</style>

      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 400,
        background: 'linear-gradient(160deg, rgba(253,248,242,0.97), rgba(245,237,224,0.88))',
        border: '1px solid rgba(201,169,110,0.24)',
        borderRadius: 2,
        boxShadow: '0 2px 40px rgba(139,105,20,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
        padding: '44px 36px 40px',
        overflow: 'hidden',
      }}>

        {/* Corner accents */}
        {(['tl','tr','bl','br'] as const).map(c => (
          <span key={c} style={{
            position: 'absolute',
            top:    c.startsWith('t') ? 6 : undefined,
            bottom: c.startsWith('b') ? 6 : undefined,
            left:   c.endsWith('l')   ? 6 : undefined,
            right:  c.endsWith('r')   ? 6 : undefined,
            width: 8, height: 8,
            borderTop:    c.startsWith('t') ? '1px solid rgba(201,169,110,0.4)' : undefined,
            borderBottom: c.startsWith('b') ? '1px solid rgba(201,169,110,0.4)' : undefined,
            borderLeft:   c.endsWith('l')   ? '1px solid rgba(201,169,110,0.36)' : undefined,
            borderRight:  c.endsWith('r')   ? '1px solid rgba(201,169,110,0.36)' : undefined,
          }}/>
        ))}

        {/* Rings logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <svg width="36" height="22" viewBox="0 0 36 22" fill="none" style={{ margin: '0 auto 16px' }}>
            <circle cx="13" cy="11" r="9" stroke="#C9A96E" strokeWidth="1.3" fill="none"/>
            <circle cx="23" cy="11" r="9" stroke="#C9A96E" strokeWidth="1.3" fill="rgba(201,169,110,0.08)"/>
          </svg>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.6rem', fontWeight: 300,
            color: '#2C2C2C', marginBottom: 4,
          }}>
            Wedding Dashboard
          </h1>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, margin: '10px 0 6px',
          }}>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, #C9A96E)' }}/>
            <svg width="8" height="8" viewBox="0 0 10 10">
              <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill="#C9A96E"/>
            </svg>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, #C9A96E)' }}/>
          </div>

          <p style={{
            fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#8B6914', opacity: 0.6,
          }}>
            Couple Access
          </p>
        </div>

        {/* ── Sent state ── */}
        {phase === 'sent' ? (
          <div style={{ textAlign: 'center' }}>
            {/* Envelope icon */}
            <svg width="40" height="30" viewBox="0 0 40 30" fill="none"
              style={{ margin: '0 auto 16px', display: 'block' }}>
              <rect x="1" y="1" width="38" height="28" rx="2"
                stroke="#C9A96E" strokeWidth="1.2" fill="rgba(201,169,110,0.06)"/>
              <path d="M1 4 L20 17 L39 4" stroke="#C9A96E" strokeWidth="1.2" fill="none"/>
            </svg>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic', fontWeight: 300,
              fontSize: '1.1rem', color: '#2C2C2C',
              lineHeight: 1.65, marginBottom: 12,
            }}>
              Check your inbox
            </p>
            <p style={{
              fontSize: 12, color: '#5C4A2A', opacity: 0.75,
              lineHeight: 1.6, marginBottom: 20,
            }}>
              We sent a magic link to <strong>{email}</strong>.
              Click it to sign in — no password needed.
            </p>
            <p style={{ fontSize: 10, color: '#8B6914', opacity: 0.5 }}>
              The link expires in 1 hour. Check your spam folder if it doesn't arrive.
            </p>

            <button
              onClick={() => { setPhase('idle'); setEmail('') }}
              style={{
                marginTop: 24,
                fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#8B6914', textDecoration: 'underline',
                fontFamily: 'inherit', padding: 0,
              }}
            >
              Use a different email
            </button>
          </div>

        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block', fontSize: 9, letterSpacing: '0.26em',
                textTransform: 'uppercase', color: '#8B6914', marginBottom: 7,
              }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={phase === 'sending'}
                style={{
                  width: '100%', padding: '10px 14px',
                  fontFamily: 'inherit', fontSize: 13,
                  color: '#2C2C2C',
                  background: 'rgba(201,169,110,0.05)',
                  border: '1px solid rgba(201,169,110,0.28)',
                  borderRadius: 1,
                  opacity: phase === 'sending' ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              />
            </div>

            {/* Error */}
            {phase === 'error' && (
              <div style={{
                padding: '9px 12px',
                background: 'rgba(154,48,48,0.06)',
                border: '1px solid rgba(154,48,48,0.22)',
                borderRadius: 1,
              }}>
                <p style={{ fontSize: 11, color: '#943030', lineHeight: 1.5 }}>
                  {errMsg || 'Something went wrong. Please try again.'}
                </p>
              </div>
            )}

            <div style={{
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)',
            }}/>

            <button
              type="submit"
              disabled={phase === 'sending' || !email.trim()}
              style={{
                width: '100%', padding: '12px 0',
                fontFamily: 'inherit', fontSize: 9,
                letterSpacing: '0.26em', textTransform: 'uppercase',
                cursor: phase === 'sending' || !email.trim() ? 'default' : 'pointer',
                borderRadius: 1, border: 'none',
                background: 'linear-gradient(135deg, #C9A96E, #8B6914)',
                color: '#FAF6F0',
                boxShadow: '0 4px 18px rgba(139,105,20,0.22)',
                opacity: phase === 'sending' || !email.trim() ? 0.55 : 1,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { if (phase !== 'sending') e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { if (phase !== 'sending') e.currentTarget.style.opacity = '1' }}
            >
              {phase === 'sending' ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                    style={{ animation: 'loginSpin 0.8s linear infinite' }}>
                    <style>{`@keyframes loginSpin { to { transform: rotate(360deg) } }`}</style>
                    <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7"
                      stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Sending…
                </span>
              ) : 'Send Magic Link'}
            </button>

            <p style={{
              fontSize: 10, color: '#8B6914', opacity: 0.5,
              textAlign: 'center', lineHeight: 1.6,
            }}>
              No password needed. We'll send a sign-in link to your email.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}