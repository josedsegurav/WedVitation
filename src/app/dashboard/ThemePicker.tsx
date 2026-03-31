'use client'

import React, { useState } from 'react'
import { PRESETS, buildThemeCSS, buildFontsUrl, type ThemePreset } from '@/lib/themes'

// re-export for convenience
export type { ThemePreset }
export { PRESETS, buildThemeCSS }

// ─── Mini preview card ────────────────────────────────────────
function PreviewCard({ preset }: { preset: ThemePreset }) {
  const c = preset.colors
  return (
    <div style={{
      borderRadius: 3,
      overflow: 'hidden',
      height: 88,
      background: c.pageBg,
      border: `1px solid rgba(0,0,0,0.06)`,
      position: 'relative',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header strip */}
      <div style={{
        height: 28,
        background: `linear-gradient(135deg, ${c.sectionMid}, ${c.sectionEnd})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
      }}>
        {/* Rings icon */}
        <svg width="14" height="10" viewBox="0 0 28 14" fill="none">
          <circle cx="9" cy="7" r="5.5" stroke={c.gold} strokeWidth="1.2" fill="none"/>
          <circle cx="19" cy="7" r="5.5" stroke={c.gold} strokeWidth="1.2" fill="none"/>
        </svg>
      </div>
      {/* Body */}
      <div style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Fake script text */}
        <div style={{ height: 10, width: '65%', borderRadius: 2, background: c.gold, opacity: 0.4 }} />
        {/* Fake body lines */}
        <div style={{ height: 5, width: '85%', borderRadius: 1, background: c.body, opacity: 0.15 }} />
        <div style={{ height: 5, width: '60%', borderRadius: 1, background: c.body, opacity: 0.1 }} />
        {/* Fake button */}
        <div style={{
          marginTop: 2, height: 12, width: 48, borderRadius: 1,
          background: `linear-gradient(135deg, ${c.gold}, ${c.goldDark})`,
          opacity: 0.85,
        }} />
      </div>
      {/* Accent dot */}
      <div style={{
        position: 'absolute', top: 6, right: 8,
        width: 6, height: 6, borderRadius: '50%',
        background: c.gold,
      }} />
    </div>
  )
}

// ─── Main ThemePicker ─────────────────────────────────────────
export default function ThemePicker({
  currentThemeId,
  card,
  isMobile,
}: {
  currentThemeId: string
  card: React.CSSProperties
  isMobile: boolean
}) {
  const [selected, setSelected]   = useState(currentThemeId || 'warm-gold')
  const [saving,   setSaving]     = useState(false)
  const [saved,    setSaved]      = useState(false)
  const [error,    setError]      = useState('')

  // Apply theme live to the page
  function applyTheme(preset: ThemePreset) {
    // Update CSS variables on :root
    const root = document.documentElement
    const css = buildThemeCSS(preset)
    // Parse each line into a property/value pair and set it
    css.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('--')) {
        const colon = trimmed.indexOf(':')
        if (colon !== -1) {
          const prop = trimmed.slice(0, colon).trim()
          const val  = trimmed.slice(colon + 1).replace(/;$/, '').trim()
          root.style.setProperty(prop, val)
        }
      }
    })

    // Load Google Fonts for the new preset
    const existingLink = document.getElementById('theme-font-link')
    if (existingLink) existingLink.remove()
    const link = document.createElement('link')
    link.id   = 'theme-font-link'
    link.rel  = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?${buildFontsUrl(preset)}&display=swap`
    document.head.appendChild(link)

    // Update font utility classes
    const existingStyle = document.getElementById('theme-font-classes')
    if (existingStyle) existingStyle.remove()
    const style = document.createElement('style')
    style.id = 'theme-font-classes'
    style.textContent = `
      .font-display { font-family: '${preset.fonts.display}', Georgia, serif !important; }
      .font-script  { font-family: '${preset.fonts.script}', cursive !important; }
      .font-body    { font-family: '${preset.fonts.body}', system-ui, sans-serif !important; }
    `
    document.head.appendChild(style)
  }

  function handleSelect(preset: ThemePreset) {
    setSelected(preset.id)
    setError('')
    setSaved(false)
    applyTheme(preset)
  }

  async function handleSave() {
    const preset = PRESETS.find(p => p.id === selected)
    if (!preset) return

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/wedding/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme_id: selected }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to save theme')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const Corners = () => (
    <>
      {(['tl','tr','bl','br'] as const).map(c => (
        <span key={c} style={{
          position: 'absolute',
          top:    c.startsWith('t') ? 8 : undefined, bottom: c.startsWith('b') ? 8 : undefined,
          left:   c.endsWith('l')   ? 8 : undefined, right:  c.endsWith('r')   ? 8 : undefined,
          width: 8, height: 8,
          borderTop:    c.startsWith('t') ? '1px solid rgba(201,169,110,0.3)' : undefined,
          borderBottom: c.startsWith('b') ? '1px solid rgba(201,169,110,0.3)' : undefined,
          borderLeft:   c.endsWith('l')   ? '1px solid rgba(201,169,110,0.3)' : undefined,
          borderRight:  c.endsWith('r')   ? '1px solid rgba(201,169,110,0.3)' : undefined,
        }} />
      ))}
    </>
  )

  return (
    <div className="fade-up" style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: 16,
    }}>
      {/* ── Preset picker ── */}
      <div style={{ ...card, padding: isMobile ? '20px 16px' : '28px 26px', position: 'relative' }}>
        <Corners />
        <p style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
          color: '#C9A96E', marginBottom: 6 }}>
          Invitation Theme
        </p>
        <p style={{ fontSize: 11, color: '#8B6914', lineHeight: 1.6, marginBottom: 20, opacity: 0.75 }}>
          Choose the colour palette and typography for your guests' invitation. Changes preview instantly.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {PRESETS.map(preset => {
            const isActive = selected === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => handleSelect(preset)}
                style={{
                  position: 'relative',
                  background: 'none',
                  border: isActive
                    ? `2px solid ${preset.colors.gold}`
                    : '2px solid rgba(201,169,110,0.2)',
                  borderRadius: 4,
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  boxShadow: isActive ? `0 0 0 2px ${preset.colors.gold}22` : 'none',
                }}
              >
                <PreviewCard preset={preset} />

                {/* Selected tick */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 18, height: 18, borderRadius: '50%',
                    background: preset.colors.gold,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#FFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                {/* Name label */}
                <div style={{
                  padding: '6px 8px',
                  background: preset.colors.pageBg,
                  borderTop: `1px solid rgba(0,0,0,0.05)`,
                  textAlign: 'left',
                }}>
                  <p style={{
                    fontSize: 10, fontWeight: 500,
                    color: preset.colors.heading,
                    fontFamily: "'Jost', sans-serif",
                    letterSpacing: '0.05em',
                  }}>{preset.name}</p>
                  <p style={{
                    fontSize: 9, color: preset.colors.muted,
                    opacity: 0.7, lineHeight: 1.4, marginTop: 1,
                  }}>{preset.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Save button */}
        <div style={{ marginTop: 20 }}>
          {error && (
            <p style={{ fontSize: 11, color: '#943030', marginBottom: 10,
              background: 'rgba(160,60,60,0.07)', border: '1px solid rgba(154,48,48,0.2)',
              borderRadius: 2, padding: '7px 10px' }}>
              {error}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', padding: '11px 0',
              fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', border: 'none', borderRadius: 2,
              background: saved
                ? 'rgba(74,122,68,0.12)'
                : 'linear-gradient(135deg, #C9A96E, #8B6914)',
              color: saved ? '#3A6A34' : '#FAF6F0',
              outline: saved ? '1px solid rgba(74,122,68,0.28)' : 'none',
              opacity: saving ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {saving ? 'Saving…' : saved ? '✓ Theme Saved' : 'Apply Theme'}
          </button>
        </div>
      </div>

      {/* ── Fonts info ── */}
      <div style={{ ...card, padding: isMobile ? '20px 16px' : '28px 26px', position: 'relative' }}>
        <Corners />
        <p style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase',
          color: '#C9A96E', marginBottom: 6 }}>
          Typography
        </p>
        <p style={{ fontSize: 11, color: '#8B6914', lineHeight: 1.6, marginBottom: 20, opacity: 0.75 }}>
          Each theme ships with a curated font pairing.
        </p>

        {(() => {
          const preset = PRESETS.find(p => p.id === selected) ?? PRESETS[0]
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { role: 'Display',  font: preset.fonts.display, sample: 'Sofia & Marco', size: '1.5rem', style: 'normal' as const },
                { role: 'Script',   font: preset.fonts.script,  sample: 'Forever & Always', size: '1.8rem', style: 'normal' as const },
                { role: 'Body',     font: preset.fonts.body,    sample: 'You are warmly invited to celebrate', size: '0.85rem', style: 'normal' as const },
              ].map(({ role, font, sample, size }) => (
                <div key={role} style={{
                  padding: '14px 16px',
                  background: 'rgba(201,169,110,0.05)',
                  border: '1px solid rgba(201,169,110,0.18)',
                  borderRadius: 3,
                }}>
                  <p style={{ fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase',
                    color: '#C9A96E', marginBottom: 8, opacity: 0.8 }}>
                    {role}
                  </p>
                  <p style={{
                    fontFamily: `'${font}', serif`,
                    fontSize: size, color: '#2C2C2C', lineHeight: 1.2,
                    marginBottom: 6,
                  }}>
                    {sample}
                  </p>
                  <p style={{ fontSize: 9, color: '#8B6914', opacity: 0.5 }}>{font}</p>
                </div>
              ))}
            </div>
          )
        })()}

        {/* Colour swatches */}
        {(() => {
          const preset = PRESETS.find(p => p.id === selected) ?? PRESETS[0]
          const swatches = [
            { label: 'Page',    color: preset.colors.pageBg },
            { label: 'Accent',  color: preset.colors.gold },
            { label: 'Light',   color: preset.colors.goldLight },
            { label: 'Dark',    color: preset.colors.goldDark },
            { label: 'Heading', color: preset.colors.heading },
          ]
          return (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase',
                color: '#C9A96E', marginBottom: 10, opacity: 0.8 }}>Palette</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {swatches.map(({ label, color }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: color,
                      border: '1px solid rgba(0,0,0,0.1)',
                      marginBottom: 4,
                    }} />
                    <p style={{ fontSize: 8, color: '#8B6914', opacity: 0.6 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}