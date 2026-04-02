'use client'

import { useState, type CSSProperties } from 'react'
import type { WeddingData, WeddingRow, FamilyRow, DressCodeData, ItineraryItem, GiftsData } from '@/lib/types'

// ─── Shared field primitive ────────────────────────────────────
function Field({
  label, value, onChange, type = 'text', placeholder = '', rows,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const base: CSSProperties = {
    width: '100%', padding: '9px 12px', fontFamily: 'inherit', fontSize: 12,
    color: '#2C2C2C', borderRadius: 1, outline: 'none', lineHeight: 1.5,
    background: focused ? '#FFFCF7' : 'rgba(201,169,110,0.05)',
    border: `1px solid ${focused ? '#C9A96E' : 'rgba(201,169,110,0.26)'}`,
    transition: 'border-color 0.15s',
    boxSizing: 'border-box' as const,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#8B6914' }}>
        {label}
      </label>
      {rows ? (
        <textarea rows={rows} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, resize: 'vertical' }} />
      ) : (
        <input type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={base} />
      )}
    </div>
  )
}

// ─── Save button with loading / success state ──────────────────
function SaveBtn({ onSave, disabled = false }: { onSave: () => Promise<void>; disabled?: boolean }) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const handle = async () => {
    setState('saving')
    try { await onSave(); setState('saved'); setTimeout(() => setState('idle'), 2500) }
    catch  { setState('error');  setTimeout(() => setState('idle'), 2500) }
  }
  const map = {
    idle:   { label: 'Save Changes',  bg: 'linear-gradient(135deg,#C9A96E,#8B6914)', color: '#FAF6F0' },
    saving: { label: 'Saving…',       bg: 'rgba(201,169,110,0.5)',                   color: '#FAF6F0' },
    saved:  { label: '✓ Saved',       bg: 'rgba(74,122,68,0.12)',                    color: '#3A6A34' },
    error:  { label: '✕ Error — retry', bg: 'rgba(154,48,48,0.08)',                  color: '#943030' },
  }
  const s = map[state]
  return (
    <button onClick={handle} disabled={state === 'saving' || disabled}
      style={{
        padding: '10px 22px', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
        fontFamily: 'inherit', border: 'none', borderRadius: 1, cursor: state === 'saving' ? 'default' : 'pointer',
        background: s.bg, color: s.color, transition: 'all 0.2s',
        outline: state === 'saved' ? '1px solid rgba(74,122,68,0.28)' : state === 'error' ? '1px solid rgba(154,48,48,0.22)' : 'none',
      }}>
      {s.label}
    </button>
  )
}

// ─── Section wrapper ───────────────────────────────────────────
function Section({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => Promise<void> }) {
  return (
    <div style={{
      position: 'relative', background: 'linear-gradient(160deg,rgba(253,248,242,0.97),rgba(245,237,224,0.88))',
      border: '1px solid rgba(201,169,110,0.24)', borderRadius: 2, overflow: 'hidden',
      boxShadow: '0 2px 20px rgba(139,105,20,0.07),inset 0 1px 0 rgba(255,255,255,0.8)',
      padding: '24px 22px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A96E' }}>{title}</p>
        <SaveBtn onSave={onSave} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  )
}

// ─── Divider ───────────────────────────────────────────────────
const Divider = () => (
  <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)', margin: '4px 0' }} />
)

// ─── List add/remove helpers ───────────────────────────────────
function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '7px 14px', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
      fontFamily: 'inherit', cursor: 'pointer', borderRadius: 1,
      background: 'rgba(201,169,110,0.08)', color: '#8B6914',
      border: '1px solid rgba(201,169,110,0.3)', transition: 'background 0.15s',
    }}>
      + Add
    </button>
  )
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 8px', fontSize: 10, lineHeight: 1, cursor: 'pointer',
      background: 'rgba(154,48,48,0.06)', color: '#943030',
      border: '1px solid rgba(154,48,48,0.18)', borderRadius: 1, fontFamily: 'inherit',
    }}>✕</button>
  )
}

function MoveBtn({ dir, onClick, disabled }: { dir: 'up' | 'down'; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '4px 7px', fontSize: 10, cursor: disabled ? 'default' : 'pointer',
      background: 'rgba(201,169,110,0.06)', color: disabled ? 'rgba(139,105,20,0.25)' : '#8B6914',
      border: '1px solid rgba(201,169,110,0.2)', borderRadius: 1, fontFamily: 'inherit',
    }}>
      {dir === 'up' ? '↑' : '↓'}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════
//  SUB-TAB PANELS
// ═══════════════════════════════════════════════════════════════

// ── Couple & Date ──────────────────────────────────────────────
function CouplePanel({ w }: { w: WeddingRow }) {
  const [bride,      setBride]      = useState(w.bride_name)
  const [groom,      setGroom]      = useState(w.groom_name)
  const [date,       setDate]       = useState(w.wedding_date ? w.wedding_date.slice(0, 10) : '')
  const [dateDisp,   setDateDisp]   = useState(w.date_display)
  const [dateMed,    setDateMed]    = useState(w.date_medallion)
  const [rsvp,       setRsvp]       = useState(w.rsvp_deadline)
  const [monogram,   setMonogram]   = useState(w.monogram)
  const [seal,       setSeal]       = useState(w.seal_initial)
  const [venueLabel, setVenueLabel] = useState(w.venue_label)

  const save = async () => {
    const couple_names = `${bride.trim()} & ${groom.trim()}`
    const res = await fetch('/api/wedding/details', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bride_name: bride, groom_name: groom, couple_names,
        monogram, seal_initial: seal,
        wedding_date: date ? new Date(date).toISOString() : undefined,
        date_display: dateDisp, date_medallion: dateMed,
        rsvp_deadline: rsvp, venue_label: venueLabel,
      }),
    })
    if (!res.ok) throw new Error((await res.json()).error)
  }

  return (
    <Section title="Couple & Date" onSave={save}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Bride's Name" value={bride} onChange={setBride} placeholder="Sofia" />
        <Field label="Groom's Name" value={groom} onChange={setGroom} placeholder="Marco" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Monogram" value={monogram} onChange={setMonogram} placeholder="S & M" />
        <Field label="Seal Initial" value={seal} onChange={setSeal} placeholder="SM" />
      </div>
      <Divider />
      <Field label="Wedding Date" value={date} onChange={setDate} type="date" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Date Display (shown in hero)" value={dateDisp} onChange={setDateDisp} placeholder="15 June 2026" />
        <Field label="Date Medallion" value={dateMed} onChange={setDateMed} placeholder="15 June · 2026" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="RSVP Deadline (human-readable)" value={rsvp} onChange={setRsvp} placeholder="May 31, 2026" />
        <Field label="Venue Label" value={venueLabel} onChange={setVenueLabel} placeholder="Banquet Hall" />
      </div>
    </Section>
  )
}

// ── Venues & Links ─────────────────────────────────────────────
function VenuesPanel({ w }: { w: WeddingRow }) {
  const [location,       setLocation]       = useState(w.location)
  const [heroLine1,      setHeroLine1]      = useState(w.hero_quote_line1)
  const [heroLine2,      setHeroLine2]      = useState(w.hero_quote_line2)
  const [footerTagline,  setFooterTagline]  = useState(w.footer_tagline)
  const [photoUploadUrl, setPhotoUploadUrl] = useState(w.photo_upload_url)
  const [calendarUrl,    setCalendarUrl]    = useState(w.calendar_url)

  const save = async () => {
    const res = await fetch('/api/wedding/details', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location, hero_quote_line1: heroLine1, hero_quote_line2: heroLine2,
        footer_tagline: footerTagline, photo_upload_url: photoUploadUrl, calendar_url: calendarUrl,
      }),
    })
    if (!res.ok) throw new Error((await res.json()).error)
  }

  return (
    <Section title="Venues & Links" onSave={save}>
      <Field label="Ceremony Venue / Location" value={location} onChange={setLocation} placeholder="Iglesia Sagrada Familia" />
      <Divider />
      <Field label="Hero Quote — Line 1" value={heroLine1} onChange={setHeroLine1} placeholder="If I could choose anyone, I'd choose you —" />
      <Field label="Hero Quote — Line 2" value={heroLine2} onChange={setHeroLine2} placeholder="because I've fallen in love with you." />
      <Field label="Footer Tagline" value={footerTagline} onChange={setFooterTagline} placeholder="This invitation is exclusively for you." />
      <Divider />
      <Field label="Photo Upload URL (shared album link)" value={photoUploadUrl} onChange={setPhotoUploadUrl} placeholder="https://forms.gle/..." />
      <Field label="Add-to-Calendar URL" value={calendarUrl} onChange={setCalendarUrl} placeholder="https://calendar.google.com/..." />
    </Section>
  )
}

// ── Families ───────────────────────────────────────────────────
type EditableFamily = { label: string; family_name: string; parents: string }

function FamiliesPanel({ initial }: { initial: FamilyRow[] }) {
  const [items, setItems] = useState<EditableFamily[]>(
    initial.map(f => ({ label: f.label, family_name: f.family_name, parents: f.parents }))
  )

  const update = (i: number, key: keyof EditableFamily, v: string) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [key]: v } : item))

  const add    = () => setItems(prev => [...prev, { label: '', family_name: '', parents: '' }])
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const move   = (i: number, dir: -1 | 1) => {
    const next = [...items]
    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
    setItems(next)
  }

  const save = async () => {
    const res = await fetch('/api/wedding/families', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    })
    if (!res.ok) throw new Error((await res.json()).error)
  }

  return (
    <Section title="Families / Parents" onSave={save}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: '14px 14px 10px',
          background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.18)', borderRadius: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B6914', opacity: 0.7 }}>
              Family {i + 1}
            </p>
            <div style={{ display: 'flex', gap: 4 }}>
              <MoveBtn dir="up"   onClick={() => move(i, -1)} disabled={i === 0} />
              <MoveBtn dir="down" onClick={() => move(i,  1)} disabled={i === items.length - 1} />
              <RemoveBtn onClick={() => remove(i)} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Field label="Label" value={item.label} onChange={v => update(i, 'label', v)} placeholder="Bride's Family" />
            <Field label="Family Name" value={item.family_name} onChange={v => update(i, 'family_name', v)} placeholder="Rossi Family" />
            <Field label="Parents" value={item.parents} onChange={v => update(i, 'parents', v)} placeholder="Antonio & Lucia Rossi" />
          </div>
        </div>
      ))}
      <AddBtn onClick={add} />
    </Section>
  )
}

// ── Dress Code ─────────────────────────────────────────────────
type EditableColor = { name: string; hex: string }

function DressCodePanel({ initial }: { initial: DressCodeData | null }) {
  const [style,  setStyle]  = useState(initial?.style ?? '')
  const [hint,   setHint]   = useState(initial?.hint  ?? '')
  const [colors, setColors] = useState<EditableColor[]>(
    (initial?.reserved_colors ?? []).map(c => ({ name: c.name, hex: c.hex }))
  )

  const updateColor = (i: number, key: keyof EditableColor, v: string) =>
    setColors(prev => prev.map((c, idx) => idx === i ? { ...c, [key]: v } : c))
  const addColor    = () => setColors(prev => [...prev, { name: '', hex: '#FFFFFF' }])
  const removeColor = (i: number) => setColors(prev => prev.filter((_, idx) => idx !== i))

  const save = async () => {
    const res = await fetch('/api/wedding/dress-code', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style, hint, reserved_colors: colors }),
    })
    if (!res.ok) throw new Error((await res.json()).error)
  }

  return (
    <Section title="Dress Code" onSave={save}>
      <Field label="Style" value={style} onChange={setStyle} placeholder="Formal / Black Tie" />
      <Field label="Hint" value={hint}  onChange={setHint}  placeholder="Look your most elegant" />
      <Divider />
      <p style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8B6914', marginBottom: 4 }}>
        Colors reserved for the bride
      </p>
      {colors.map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={c.hex} onChange={e => updateColor(i, 'hex', e.target.value)}
            style={{ width: 36, height: 34, padding: 2, border: '1px solid rgba(201,169,110,0.3)', borderRadius: 1, cursor: 'pointer' }} />
          <div style={{ flex: 1 }}>
            <Field label="Color Name" value={c.name} onChange={v => updateColor(i, 'name', v)} placeholder="White" />
          </div>
          <div style={{ paddingTop: 14 }}>
            <RemoveBtn onClick={() => removeColor(i)} />
          </div>
        </div>
      ))}
      <AddBtn onClick={addColor} />
    </Section>
  )
}

// ── Itinerary ──────────────────────────────────────────────────
type EditableItem = { time_label: string; title: string; description: string }

function ItineraryPanel({ initial }: { initial: ItineraryItem[] }) {
  const [items, setItems] = useState<EditableItem[]>(
    initial.map(i => ({ time_label: i.time_label, title: i.title, description: i.description }))
  )

  const update = (i: number, key: keyof EditableItem, v: string) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [key]: v } : item))
  const add    = () => setItems(prev => [...prev, { time_label: '', title: '', description: '' }])
  const remove = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i))
  const move   = (i: number, dir: -1 | 1) => {
    const next = [...items]; [next[i], next[i + dir]] = [next[i + dir], next[i]]; setItems(next)
  }

  const save = async () => {
    const res = await fetch('/api/wedding/itinerary', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    })
    if (!res.ok) throw new Error((await res.json()).error)
  }

  return (
    <Section title="Itinerary" onSave={save}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: '14px 14px 10px',
          background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.18)', borderRadius: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B6914', opacity: 0.7 }}>
              Item {i + 1}
            </p>
            <div style={{ display: 'flex', gap: 4 }}>
              <MoveBtn dir="up"   onClick={() => move(i, -1)} disabled={i === 0} />
              <MoveBtn dir="down" onClick={() => move(i,  1)} disabled={i === items.length - 1} />
              <RemoveBtn onClick={() => remove(i)} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
              <Field label="Time" value={item.time_label} onChange={v => update(i, 'time_label', v)} placeholder="11:00 A.M." />
              <Field label="Title" value={item.title} onChange={v => update(i, 'title', v)} placeholder="Religious Ceremony" />
            </div>
            <Field label="Description" value={item.description} onChange={v => update(i, 'description', v)} placeholder="Cathedral of Santa Maria" />
          </div>
        </div>
      ))}
      <AddBtn onClick={add} />
    </Section>
  )
}

// ── Gifts ──────────────────────────────────────────────────────
type EditableBankRow = { label: string; value: string }

function GiftsPanel({ initial }: { initial: GiftsData | null }) {
  const [message,      setMessage]      = useState(initial?.message       ?? '')
  const [envelopeNote, setEnvelopeNote] = useState(initial?.envelope_note ?? '')
  const [bank, setBank] = useState<EditableBankRow[]>(
    (initial?.bank ?? []).map(r => ({ label: r.label, value: r.value }))
  )

  const updateRow = (i: number, key: keyof EditableBankRow, v: string) =>
    setBank(prev => prev.map((r, idx) => idx === i ? { ...r, [key]: v } : r))
  const addRow    = () => setBank(prev => [...prev, { label: '', value: '' }])
  const removeRow = (i: number) => setBank(prev => prev.filter((_, idx) => idx !== i))
  const move      = (i: number, dir: -1 | 1) => {
    const next = [...bank]; [next[i], next[i + dir]] = [next[i + dir], next[i]]; setBank(next)
  }

  const save = async () => {
    const res = await fetch('/api/wedding/gifts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, envelope_note: envelopeNote, bank }),
    })
    if (!res.ok) throw new Error((await res.json()).error)
  }

  return (
    <Section title="Gifts & Registry" onSave={save}>
      <Field label="Gift Message" value={message} onChange={setMessage} rows={3}
        placeholder="Your presence is the greatest gift…" />
      <Field label="Envelope Box Note" value={envelopeNote} onChange={setEnvelopeNote} rows={2}
        placeholder="A treasure chest will be available at the venue…" />
      <Divider />
      <p style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#8B6914', marginBottom: 4 }}>
        Bank Transfer Details
      </p>
      {bank.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Field label="Label" value={row.label} onChange={v => updateRow(i, 'label', v)} placeholder="IBAN" />
          </div>
          <div style={{ flex: 2 }}>
            <Field label="Value" value={row.value} onChange={v => updateRow(i, 'value', v)} placeholder="IT60X0542811…" />
          </div>
          <div style={{ display: 'flex', gap: 4, paddingBottom: 1 }}>
            <MoveBtn dir="up"   onClick={() => move(i, -1)} disabled={i === 0} />
            <MoveBtn dir="down" onClick={() => move(i,  1)} disabled={i === bank.length - 1} />
            <RemoveBtn onClick={() => removeRow(i)} />
          </div>
        </div>
      ))}
      <AddBtn onClick={addRow} />
    </Section>
  )
}

// ═══════════════════════════════════════════════════════════════
//  MAIN InvitationEditor
// ═══════════════════════════════════════════════════════════════

const SUB_TABS = [
  { key: 'couple',    label: 'Couple & Date' },
  { key: 'venues',    label: 'Venues & Links' },
  { key: 'families',  label: 'Families' },
  { key: 'dresscode', label: 'Dress Code' },
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'gifts',     label: 'Gifts' },
]

export default function InvitationEditor({
  data,
  isMobile,
}: {
  data:     WeddingData
  isMobile: boolean
}) {
  const [sub, setSub] = useState('couple')

  return (
    <div className="fade-up">
      {/* Sub-tab strip */}
      <div style={{
        display: 'flex', gap: 0, overflowX: 'auto', paddingBottom: 2,
        borderBottom: '1px solid rgba(201,169,110,0.18)', marginBottom: isMobile ? 16 : 20,
        scrollbarWidth: 'none',
      }}>
        {SUB_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setSub(key)} style={{
            padding: isMobile ? '8px 12px' : '8px 18px',
            fontSize: isMobile ? 9 : 9, letterSpacing: '0.18em', textTransform: 'uppercase',
            fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer',
            marginBottom: -1, whiteSpace: 'nowrap', transition: 'color 0.2s',
            color: sub === key ? '#8B6914' : 'rgba(139,105,20,0.4)',
            borderBottom: sub === key ? '2px solid #C9A96E' : '2px solid transparent',
          }}>
            {label}
          </button>
        ))}
      </div>

      {sub === 'couple'    && <CouplePanel    w={data.wedding} />}
      {sub === 'venues'    && <VenuesPanel    w={data.wedding} />}
      {sub === 'families'  && <FamiliesPanel  initial={data.families} />}
      {sub === 'dresscode' && <DressCodePanel initial={data.dress_code} />}
      {sub === 'itinerary' && <ItineraryPanel initial={data.itinerary} />}
      {sub === 'gifts'     && <GiftsPanel     initial={data.gifts} />}
    </div>
  )
}