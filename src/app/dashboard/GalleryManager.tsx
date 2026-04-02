'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { GalleryPhoto } from '@/lib/types'

const BUCKET = 'wedding-gallery'

// ── Extract Supabase Storage path from a public URL ───────────
// Returns null if the src is not a Supabase Storage URL
function extractStoragePath(src: string): string | null {
  try {
    const url = new URL(src)
    const marker = `/object/public/${BUCKET}/`
    const idx    = url.pathname.indexOf(marker)
    if (idx === -1) return null
    return url.pathname.slice(idx + marker.length)
  } catch {
    // Relative path or blob URL — not a Storage URL
    return null
  }
}

function isSupabaseUrl(src: string): boolean {
  try {
    const url = new URL(src)
    return url.hostname.endsWith('.supabase.co')
  } catch {
    return false
  }
}

// ── Icons ──────────────────────────────────────────────────────
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3v10M6 7l4-4 4 4" stroke="var(--color-gold)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="var(--color-gold)" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function MoveBtn({ dir, onClick, disabled }: { dir: 'up' | 'down'; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '3px 6px', fontSize: 10, cursor: disabled ? 'default' : 'pointer',
      background: 'rgba(201,169,110,0.08)', color: disabled ? 'rgba(139,105,20,0.25)' : '#8B6914',
      border: '1px solid rgba(201,169,110,0.2)', borderRadius: 1,
    }}>
      {dir === 'up' ? '↑' : '↓'}
    </button>
  )
}

interface EditablePhoto extends GalleryPhoto {
  uploading?:   boolean
  savingLabel?: boolean
  preview?:     string
}

export default function GalleryManager({
  initialPhotos,
  isMobile,
}: {
  initialPhotos: GalleryPhoto[]
  isMobile:      boolean
}) {
  const [photos,   setPhotos]   = useState<EditablePhoto[]>(initialPhotos)
  const [dragOver, setDragOver] = useState(false)
  const [error,    setError]    = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Upload ──────────────────────────────────────────────────
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError('')
    const supabase = createClient()

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) { setError('Only image files are supported.'); continue }
      if (file.size > 10 * 1024 * 1024)   { setError('Max file size is 10 MB.'); continue }

      const preview = URL.createObjectURL(file)
      const tempId  = `uploading-${Date.now()}-${Math.random()}`
      const label   = file.name.replace(/\.[^.]+$/, '')

      setPhotos(prev => [...prev, {
        id: tempId, label, src: preview, alt: label, uploading: true, preview,
      }])

      try {
        const ext  = file.name.split('.').pop() ?? 'jpg'
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false })
        if (upErr) throw upErr

        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
        const publicUrl = urlData.publicUrl

        const res = await fetch('/api/wedding/gallery', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label, src: publicUrl, alt: label }),
        })
        if (!res.ok) throw new Error((await res.json()).error)
        const { id } = await res.json()

        setPhotos(prev => prev.map(p =>
          p.id === tempId ? { id, label, src: publicUrl, alt: label, uploading: false } : p
        ))
        URL.revokeObjectURL(preview)
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Upload failed')
        setPhotos(prev => prev.filter(p => p.id !== tempId))
        URL.revokeObjectURL(preview)
      }
    }
  }

  // ── Delete ──────────────────────────────────────────────────
  async function handleDelete(photo: EditablePhoto) {
    if (!confirm(`Delete "${photo.label}"?`)) return
    setError('')

    try {
      // Only attempt Storage deletion for Supabase-hosted photos
      if (isSupabaseUrl(photo.src)) {
        const storagePath = extractStoragePath(photo.src)
        if (storagePath) {
          const supabase = createClient()
          await supabase.storage.from(BUCKET).remove([storagePath])
        }
      }

      // Always remove from DB
      const res = await fetch(`/api/wedding/gallery/${photo.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error((await res.json()).error)

      setPhotos(prev => prev.filter(p => p.id !== photo.id))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  // ── Label update (persisted) ────────────────────────────────
  function setLabel(id: string, label: string) {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, label } : p))
  }

  async function saveLabel(photo: EditablePhoto) {
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, savingLabel: true } : p))
    try {
      const res = await fetch(`/api/wedding/gallery/${photo.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: photo.label }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save label')
    } finally {
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, savingLabel: false } : p))
    }
  }

  // ── Reorder ─────────────────────────────────────────────────
  async function move(i: number, dir: -1 | 1) {
    const next = [...photos]
    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
    setPhotos(next)
    try {
      const res = await fetch('/api/wedding/gallery', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next.map(p => p.id)),
      })
      if (!res.ok) throw new Error((await res.json()).error)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Reorder failed')
    }
  }

  // ── Render ──────────────────────────────────────────────────
  const card: React.CSSProperties = {
    position: 'relative',
    background: 'linear-gradient(160deg,rgba(253,248,242,0.97),rgba(245,237,224,0.88))',
    border: '1px solid rgba(201,169,110,0.24)', borderRadius: 2, overflow: 'hidden',
    boxShadow: '0 2px 20px rgba(139,105,20,0.07),inset 0 1px 0 rgba(255,255,255,0.8)',
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileRef.current?.click()}
        style={{
          ...card,
          padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
          border: dragOver ? '2px solid #C9A96E' : '2px dashed rgba(201,169,110,0.35)',
          background: dragOver ? 'rgba(201,169,110,0.06)' : card.background,
          transition: 'all 0.2s',
        }}
      >
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <UploadIcon />
          <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A96E' }}>
            {dragOver ? 'Drop to upload' : 'Click or drag photos here'}
          </p>
          <p style={{ fontSize: 11, color: '#8B6914', opacity: 0.6 }}>
            JPEG, PNG, WebP · Max 10 MB each
          </p>
        </div>
      </div>

      {error && (
        <p style={{
          fontSize: 11, color: '#943030', padding: '8px 12px', borderRadius: 1,
          background: 'rgba(154,48,48,0.06)', border: '1px solid rgba(154,48,48,0.2)',
        }}>{error}</p>
      )}

      {/* Photo list */}
      {photos.length > 0 && (
        <div style={{ ...card, padding: '20px 20px 12px' }}>
          <p style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C9A96E', marginBottom: 14 }}>
            Gallery · {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {photos.map((photo, i) => (
              <div key={photo.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px',
                background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 1,
                opacity: photo.uploading ? 0.65 : 1, transition: 'opacity 0.2s',
              }}>
                {/* Thumbnail */}
                <div style={{
                  flexShrink: 0, width: 48, height: 48, borderRadius: 1, overflow: 'hidden',
                  border: '1px solid rgba(201,169,110,0.2)', position: 'relative', background: '#EDE0CC',
                }}>
                  <Image src={photo.src} alt={photo.label} fill sizes="48px"
                    style={{ objectFit: 'cover' }}
                    unoptimized={!isSupabaseUrl(photo.src)}
                  />
                  {photo.uploading && (
                    <div style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(250,246,240,0.7)',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                        style={{ animation: 'rsvpSpin 0.8s linear infinite' }}>
                        <style>{`@keyframes rsvpSpin{to{transform:rotate(360deg)}}`}</style>
                        <circle cx="8" cy="8" r="6" stroke="rgba(201,169,110,0.3)" strokeWidth="1.5"/>
                        <path d="M8 2 A6 6 0 0 1 14 8" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Label input + save button */}
                {!photo.uploading && (
                  <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      value={photo.label}
                      onChange={e => setLabel(photo.id, e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveLabel(photo)}
                      placeholder="Photo label"
                      style={{
                        flex: 1, padding: '6px 10px', fontSize: 12, fontFamily: 'inherit',
                        color: '#2C2C2C', background: 'rgba(201,169,110,0.04)',
                        border: '1px solid rgba(201,169,110,0.2)', borderRadius: 1, outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => saveLabel(photo)}
                      disabled={photo.savingLabel}
                      title="Save label"
                      style={{
                        flexShrink: 0, padding: '5px 8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: photo.savingLabel ? 'rgba(74,122,68,0.1)' : 'rgba(201,169,110,0.08)',
                        color: photo.savingLabel ? '#3A6A34' : '#8B6914',
                        border: `1px solid ${photo.savingLabel ? 'rgba(74,122,68,0.28)' : 'rgba(201,169,110,0.25)'}`,
                        borderRadius: 1, fontSize: 9, letterSpacing: '0.15em',
                      }}
                    >
                      <SaveIcon />
                    </button>
                  </div>
                )}

                {photo.uploading && (
                  <p style={{ flex: 1, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A96E' }}>
                    Uploading…
                  </p>
                )}

                {/* Move + delete controls */}
                {!photo.uploading && (
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <MoveBtn dir="up"   onClick={() => move(i, -1)} disabled={i === 0} />
                    <MoveBtn dir="down" onClick={() => move(i,  1)} disabled={i === photos.length - 1} />
                    <button onClick={() => handleDelete(photo)} style={{
                      padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      background: 'rgba(154,48,48,0.06)', color: '#943030',
                      border: '1px solid rgba(154,48,48,0.18)', borderRadius: 1,
                    }}>
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 10, color: '#8B6914', opacity: 0.5, marginTop: 10 }}>
            Only the first 6 photos are shown in the invitation gallery.
          </p>
        </div>
      )}
    </div>
  )
}