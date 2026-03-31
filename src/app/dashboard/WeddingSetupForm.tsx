'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────
type FormData = {
  bride_name:       string
  groom_name:       string
  wedding_date:     string
  ceremony_venue:   string
  ceremony_address: string
  reception_venue:  string
  reception_address: string
  ceremony_time:    string
  reception_time:   string
}

// ─── Icons ────────────────────────────────────────────────────
const IconRings = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="11" cy="16" r="7" stroke="#C9A96E" strokeWidth="1.5" fill="none"/>
    <circle cx="21" cy="16" r="7" stroke="#C9A96E" strokeWidth="1.5" fill="none"/>
  </svg>
)

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── Field component ──────────────────────────────────────────
function Field({
  label, name, value, onChange, type = 'text', placeholder = '', required = false,
}: {
  label: string
  name: keyof FormData
  value: string
  onChange: (name: keyof FormData, val: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  const [focused, setFocused] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 13px',
    fontFamily: "'Jost', sans-serif",
    fontSize: 13,
    color: '#2C2C2C',
    background: focused ? '#FFFCF7' : '#FAF6F0',
    border: `1px solid ${focused ? '#C9A96E' : 'rgba(201,169,110,0.3)'}`,
    borderRadius: 3,
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
        color: '#8B6914', fontFamily: "'Jost', sans-serif",
      }}>
        {label}{required && <span style={{ color: '#C9A96E', marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={e => onChange(name, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
      />
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, margin: '24px 0 16px',
    }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.25)' }} />
      <p style={{
        fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase',
        color: '#C9A96E', fontFamily: "'Jost', sans-serif", whiteSpace: 'nowrap',
      }}>
        {children}
      </p>
      <div style={{ flex: 1, height: 1, background: 'rgba(201,169,110,0.25)' }} />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function WeddingSetupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1 = couple & date, 2 = venues
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState<FormData>({
    bride_name:        '',
    groom_name:        '',
    wedding_date:      '',
    ceremony_venue:    '',
    ceremony_address:  '',
    reception_venue:   '',
    reception_address: '',
    ceremony_time:     '11:00',
    reception_time:    '15:00',
  })

  function handleChange(name: keyof FormData, val: string) {
    setForm(prev => ({ ...prev, [name]: val }))
    setError('')
  }

  function validateStep1() {
    if (!form.bride_name.trim())   return 'Please enter the bride\'s name.'
    if (!form.groom_name.trim())   return 'Please enter the groom\'s name.'
    if (!form.wedding_date.trim()) return 'Please select a wedding date.'
    return ''
  }

  function validateStep2() {
    if (!form.ceremony_venue.trim())   return 'Please enter the ceremony venue.'
    if (!form.ceremony_address.trim()) return 'Please enter the ceremony address.'
    if (!form.reception_venue.trim())  return 'Please enter the reception venue.'
    return ''
  }

  function goNext() {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
  }

  async function handleSubmit() {
    const err = validateStep2()
    if (err) { setError(err); return }

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/wedding/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Something went wrong. Please try again.')
      }

      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  // ── Progress dots ──────────────────────────────────────────
  const progressDot = (n: number) => (
    <div key={n} style={{
      width: n === step ? 20 : 6, height: 6, borderRadius: 3,
      background: n === step ? '#C9A96E' : n < step ? 'rgba(201,169,110,0.5)' : 'rgba(201,169,110,0.2)',
      transition: 'all 0.3s',
    }} />
  )

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Jost', sans-serif",
      background: 'linear-gradient(160deg, #FAF6F0 0%, #F0E4CA 55%, #EDD9B8 100%)',
      padding: '32px 16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        background: 'rgba(255,252,247,0.95)',
        border: '1px solid rgba(201,169,110,0.25)',
        borderRadius: 6,
        padding: '40px 36px',
        boxShadow: '0 4px 32px rgba(92,74,42,0.08)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <IconRings />
          <p style={{
            fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase',
            color: '#C9A96E', marginTop: 12, marginBottom: 8,
          }}>
            Wedding Setup
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.8rem', fontWeight: 300,
            color: '#2C2C2C', margin: 0, lineHeight: 1.2,
          }}>
            Tell us about your<br />special day
          </h1>
          <p style={{
            fontSize: 11, color: '#5C4A2A', opacity: 0.65,
            marginTop: 10, lineHeight: 1.6,
          }}>
            Fill in the details below to personalise your<br />invitation and dashboard.
          </p>

          {/* Progress */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
            {[1, 2].map(progressDot)}
          </div>
        </div>

        {/* ── Step 1: Couple & Date ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionHeader>The Couple</SectionHeader>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Bride's Name" name="bride_name" value={form.bride_name}
                onChange={handleChange} placeholder="Sofia" required />
              <Field label="Groom's Name" name="groom_name" value={form.groom_name}
                onChange={handleChange} placeholder="Marco" required />
            </div>

            <SectionHeader>The Date</SectionHeader>

            <Field label="Wedding Date" name="wedding_date" value={form.wedding_date}
              onChange={handleChange} type="date" required />
          </div>
        )}

        {/* ── Step 2: Venues ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SectionHeader>Ceremony</SectionHeader>

            <Field label="Ceremony Venue" name="ceremony_venue" value={form.ceremony_venue}
              onChange={handleChange} placeholder="Cathedral of Santa Maria" required />
            <Field label="Ceremony Address" name="ceremony_address" value={form.ceremony_address}
              onChange={handleChange} placeholder="Piazza del Duomo, Florence, Italy" required />
            <Field label="Ceremony Time" name="ceremony_time" value={form.ceremony_time}
              onChange={handleChange} type="time" />

            <SectionHeader>Reception</SectionHeader>

            <Field label="Reception Venue" name="reception_venue" value={form.reception_venue}
              onChange={handleChange} placeholder="Villa La Signoria" required />
            <Field label="Reception Address" name="reception_address" value={form.reception_address}
              onChange={handleChange} placeholder="Via delle Cinque Vie, Chianti, Italy" />
            <Field label="Reception Time" name="reception_time" value={form.reception_time}
              onChange={handleChange} type="time" />
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{
            marginTop: 14, fontSize: 11, color: '#943030',
            background: 'rgba(160,60,60,0.07)',
            border: '1px solid rgba(154,48,48,0.2)',
            borderRadius: 3, padding: '8px 12px', lineHeight: 1.5,
          }}>
            {error}
          </p>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: 10, marginTop: 24,
          ...(step === 2 ? { justifyContent: 'space-between' } : {}),
        }}>
          {step === 2 && (
            <button
              onClick={() => { setError(''); setStep(1) }}
              disabled={saving}
              style={{
                padding: '11px 20px', fontSize: 10, letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
                fontFamily: 'inherit', background: 'transparent',
                color: '#8B6914', border: '1px solid rgba(201,169,110,0.4)',
                transition: 'all 0.2s',
              }}
            >
              ← Back
            </button>
          )}

          <button
            onClick={step === 1 ? goNext : handleSubmit}
            disabled={saving}
            style={{
              flex: 1, padding: '12px 20px', fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer',
              borderRadius: 2, fontFamily: 'inherit',
              background: saving ? 'rgba(201,169,110,0.5)' : '#C9A96E',
              color: '#FFF', border: 'none',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {saving ? (
              'Saving…'
            ) : step === 1 ? (
              <><span>Continue</span><IconChevron /></>
            ) : (
              'Create My Wedding'
            )}
          </button>
        </div>

        <p style={{
          textAlign: 'center', fontSize: 10, color: '#5C4A2A',
          opacity: 0.5, marginTop: 16,
        }}>
          You can update all details anytime from settings.
        </p>
      </div>
    </div>
  )
}