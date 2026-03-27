'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── types ────────────────────────────────────────────────────
type Guest        = { id: string; name: string; passes: number; color: string }
type Table        = { id: string; name: string; seats: number; x: number; y: number }
type AssignMap    = Record<string, string[]>
type DragPos      = { x: number; y: number } | null
type GuestDragRef = { type: 'guest'; id: string; tableFrom: string | null; offsetX: number; offsetY: number } | null
type TableDragRef = { id: string; startX: number; startY: number; origX: number; origY: number } | null
type SplitModal   = { guestId: string; tableId: string; available: number; name: string; tableFrom?: string } | null

type Props = {
  initialTables:     Table[]
  initialAssign:     AssignMap
  initialGuests:     Guest[]
  initialUnassigned: string[]
  coupleName:        string
  venueLabel:        string
}

// ─── helpers ──────────────────────────────────────────────────
const COLORS = ['#C9A96E','#A0896A','#B8956A','#C4A882','#9A7A5A','#8B7355','#BFA882','#A08060']
const nextColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

function uid(): string { return 'id_' + Math.random().toString(36).slice(2, 9) }
function lastName(name: string): string { return name.split(' ').slice(1).join(' ') || name }

function evtCoords(e: React.PointerEvent | React.TouchEvent): { x: number; y: number } {
  const ev = e as React.TouchEvent & { clientX?: number; clientY?: number }
  if (ev.touches?.length)        return { x: ev.touches[0].clientX,        y: ev.touches[0].clientY }
  if (ev.changedTouches?.length) return { x: ev.changedTouches[0].clientX, y: ev.changedTouches[0].clientY }
  return { x: (e as React.PointerEvent).clientX, y: (e as React.PointerEvent).clientY }
}

function useIsTablet() {
  const [v, setV] = useState(false)
  useEffect(() => {
    const check = () => setV(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return v
}

const Corners = () => ['tl','tr','bl','br'].map(c => (
  <span key={c} style={{ position: 'absolute',
    top:    c[0]==='t' ? 6 : undefined, bottom: c[0]==='b' ? 6 : undefined,
    left:   c[1]==='l' ? 6 : undefined, right:  c[1]==='r' ? 6 : undefined,
    width: 8, height: 8,
    borderTop:    c[0]==='t' ? '1px solid rgba(201,169,110,0.4)'  : undefined,
    borderBottom: c[0]==='b' ? '1px solid rgba(201,169,110,0.4)'  : undefined,
    borderLeft:   c[1]==='l' ? '1px solid rgba(201,169,110,0.36)' : undefined,
    borderRight:  c[1]==='r' ? '1px solid rgba(201,169,110,0.36)' : undefined,
  }}/>
))

// ─────────────────────────────────────────────────────────────
export default function SeatingClient({
  initialTables,
  initialAssign,
  initialGuests,
  initialUnassigned,
  coupleName,
  venueLabel,
}: Props) {
  const isTablet = useIsTablet()

  const [guests,     setGuests]     = useState<Guest[]>(initialGuests)
  const [tables,     setTables]     = useState<Table[]>(initialTables)
  const [assign,     setAssign]     = useState<AssignMap>(initialAssign)
  const [unassigned, setUnassigned] = useState<string[]>(initialUnassigned)

  const [isDirty,    setIsDirty]    = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [navWarning, setNavWarning] = useState(false)
  const pendingNav    = useRef<string | null>(null)
  const isFirstRender = useRef(true)

  const [drawerOpen,    setDrawerOpen]    = useState(false)
  const [panel,         setPanel]         = useState('guests')
  const [newTableSeats, setNewTableSeats] = useState('8')
  const [newTableName,  setNewTableName]  = useState('')
  const [splitModal,    setSplitModal]    = useState<SplitModal>(null)

  // Persist to localStorage as draft
  useEffect(() => {
    try {
      localStorage.setItem('seating_v1', JSON.stringify({ guests, tables, assign, unassigned }))
    } catch {}
  }, [guests, tables, assign, unassigned])

  // Mark dirty after first render
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    setIsDirty(true)
    setSaveStatus('idle')
  }, [guests, tables, assign, unassigned])

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (!isDirty) return; e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [isDirty])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href]')
      if (!a || !isDirty) return
      const href = a.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return
      e.preventDefault()
      pendingNav.current = href
      setNavWarning(true)
    }
    document.addEventListener('click', h, true)
    return () => document.removeEventListener('click', h, true)
  }, [isDirty])

  // ── Save to Supabase ──────────────────────────────────────
  const saveToDatabase = async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/seating', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables, assign, unassigned }),
      })
      if (!res.ok) throw new Error('Save failed')
      setSaveStatus('saved')
      setIsDirty(false)
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 4000)
    }
  }

  // ── drag refs ────────────────────────────────────────────
  const drag      = useRef<GuestDragRef>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const panelRef  = useRef<HTMLDivElement>(null)
  const [dragPos,  setDragPos]  = useState<DragPos>(null)
  const [dropHint, setDropHint] = useState<string | null>(null)
  const tableDrag = useRef<TableDragRef>(null)

  const guestMap = Object.fromEntries(guests.map(g => [g.id, g])) as Record<string, Guest>
  const tableMap = Object.fromEntries(tables.map(t => [t.id, t])) as Record<string, Table>

  const seatsUsed = (tid: string) =>
    (assign[tid] || []).reduce((s, gid) => s + (guestMap[gid]?.passes || 0), 0)
  const seatsLeft = (tid: string) =>
    (tableMap[tid]?.seats || 0) - seatsUsed(tid)

  const onGuestDragStart = useCallback((
    e: React.PointerEvent | React.TouchEvent,
    guestId: string,
    fromTable: string | null = null
  ) => {
    e.stopPropagation()
    if (isTablet && fromTable === null) setDrawerOpen(false)
    const r = e.currentTarget.getBoundingClientRect()
    const { x, y } = evtCoords(e)
    drag.current = { type: 'guest', id: guestId, tableFrom: fromTable, offsetX: x - r.left, offsetY: y - r.top }
    setDragPos({ x, y })
  }, [isTablet])

  const onTableDragStart = useCallback((e: React.PointerEvent | React.TouchEvent, tableId: string) => {
    if ((e.target as Element).closest('[data-guest]')) return
    e.stopPropagation()
    const t = tableMap[tableId]
    const { x, y } = evtCoords(e)
    tableDrag.current = { id: tableId, startX: x, startY: y, origX: t.x, origY: t.y }
  }, [tableMap])

  const onCanvasMove = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    const { x, y } = evtCoords(e)
    if (tableDrag.current) {
      const { id, startX, startY, origX, origY } = tableDrag.current
      setTables(ts => ts.map(t => t.id === id
        ? { ...t, x: Math.max(0, origX + x - startX), y: Math.max(0, origY + y - startY) }
        : t))
      return
    }
    if (!drag.current) return
    setDragPos({ x, y })
    const canvas = canvasRef.current
    if (!canvas) return
    let found: string | null = null
    canvas.querySelectorAll<HTMLElement>('[data-tableid]').forEach(el => {
      const r = el.getBoundingClientRect()
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
        found = el.getAttribute('data-tableid')
    })
    setDropHint(found)
  }, [])

  const onCanvasUp = useCallback((_e: React.PointerEvent | React.TouchEvent) => {
    if (tableDrag.current) { tableDrag.current = null; return }
    if (!drag.current) return
    const { id: guestId, tableFrom } = drag.current
    const targetTable = dropHint

    if (targetTable && targetTable !== tableFrom) {
      const guest = guestMap[guestId]
      const avail = seatsLeft(targetTable)
      if (avail <= 0) { drag.current = null; setDragPos(null); setDropHint(null); return }
      if (guest.passes > avail) {
        setSplitModal({ guestId, tableId: targetTable, available: avail, name: guest.name, tableFrom: tableFrom ?? undefined })
        drag.current = null; setDragPos(null); setDropHint(null); return
      }
      setAssign(a => {
        const next = { ...a }
        if (tableFrom) next[tableFrom] = (next[tableFrom] || []).filter(x => x !== guestId)
        else setUnassigned(u => u.filter(x => x !== guestId))
        next[targetTable] = [...(next[targetTable] || []), guestId]
        return next
      })
      if (!tableFrom) setUnassigned(u => u.filter(x => x !== guestId))
    } else if (!targetTable && tableFrom) {
      setAssign(a => { const n = { ...a }; n[tableFrom] = (n[tableFrom] || []).filter(x => x !== guestId); return n })
      setUnassigned(u => u.includes(guestId) ? u : [...u, guestId])
    }
    drag.current = null; setDragPos(null); setDropHint(null)
  }, [dropHint, guestMap, seatsLeft])

  // ── Non-passive touch listeners ───────────────────────────
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const onTM = (e: TouchEvent) => { e.preventDefault(); onCanvasMove(e as unknown as React.TouchEvent) }
    const onTE = (e: TouchEvent) => { e.preventDefault(); onCanvasUp(e as unknown as React.TouchEvent) }
    el.addEventListener('touchmove', onTM, { passive: false })
    el.addEventListener('touchend',  onTE, { passive: false })
    return () => { el.removeEventListener('touchmove', onTM); el.removeEventListener('touchend', onTE) }
  }, [onCanvasMove, onCanvasUp])

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const onTS = (e: TouchEvent) => {
      const target = e.target as Element
      const chip  = target.closest('[data-guest]')
      const table = target.closest('[data-tableid]')
      if (!chip && !table) return
      e.preventDefault()
      if (chip) {
        const gId    = chip.getAttribute('data-guest')!
        const tEl    = chip.closest('[data-tableid]')
        const fromTbl = tEl ? tEl.getAttribute('data-tableid') : null
        onGuestDragStart(e as unknown as React.TouchEvent, gId, fromTbl)
      } else if (table) {
        onTableDragStart(e as unknown as React.TouchEvent, table.getAttribute('data-tableid')!)
      }
    }
    el.addEventListener('touchstart', onTS, { passive: false })
    return () => el.removeEventListener('touchstart', onTS)
  }, [onGuestDragStart, onTableDragStart])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const onTS = (e: TouchEvent) => {
      const chip = (e.target as Element).closest('[data-guest]')
      if (!chip) return
      e.preventDefault()
      onGuestDragStart(e as unknown as React.TouchEvent, chip.getAttribute('data-guest')!, null)
    }
    el.addEventListener('touchstart', onTS, { passive: false })
    return () => el.removeEventListener('touchstart', onTS)
  }, [onGuestDragStart])

  // ── Split ─────────────────────────────────────────────────
  const doSplit = () => {
    if (!splitModal) return
    const { guestId, tableId, available } = splitModal
    const guest = guestMap[guestId]
    const last  = lastName(guest.name)
    const col   = guest.color || nextColor()
    const g1: Guest = { ...guest, id: uid(), name: `${last} 1`, passes: available,                color: col }
    const g2: Guest = { ...guest, id: uid(), name: `${last} 2`, passes: guest.passes - available, color: col }
    setGuests(gs => [...gs.filter(g => g.id !== guestId), g1, g2])
    setAssign(a => {
      const next = { ...a }
      if (splitModal.tableFrom) next[splitModal.tableFrom] = (next[splitModal.tableFrom] || []).filter(x => x !== guestId)
      next[tableId] = [...(next[tableId] || []), g1.id]
      return next
    })
    setUnassigned(u => [...u.filter(x => x !== guestId), g2.id])
    setSplitModal(null)
  }

  const addTable = () => {
    const seats = Math.max(2, parseInt(newTableSeats) || 8)
    const id    = uid()
    const name  = newTableName.trim() || `Table ${tables.length + 1}`
    setTables(ts => [...ts, { id, name, seats, x: 120 + (tables.length * 30) % 200, y: 120 + (tables.length * 20) % 200 }])
    setAssign(a => ({ ...a, [id]: [] }))
    setNewTableName('')
    setNewTableSeats('8')
  }

  const removeTable = (tid: string) => {
    setUnassigned(u => [...u, ...(assign[tid] || []).filter(x => !u.includes(x))])
    setTables(ts => ts.filter(t => t.id !== tid))
    setAssign(a => { const n = { ...a }; delete n[tid]; return n })
  }

  const removeGuestFromTable = (gid: string, tid: string) => {
    setAssign(a => ({ ...a, [tid]: (a[tid] || []).filter(x => x !== gid) }))
    setUnassigned(u => u.includes(gid) ? u : [...u, gid])
  }

  // ── Styles ────────────────────────────────────────────────
  const card: React.CSSProperties = {
    position: 'relative', borderRadius: 2, overflow: 'hidden',
    background: 'linear-gradient(160deg,rgba(253,248,242,0.97),rgba(245,237,224,0.9))',
    border: '1px solid rgba(201,169,110,0.24)',
    boxShadow: '0 2px 20px rgba(139,105,20,0.07),inset 0 1px 0 rgba(255,255,255,0.8)',
  }
  const inp = {
    fontFamily: 'inherit', fontSize: 13, color: '#2C2C2C', padding: '9px 11px',
    background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.26)',
    borderRadius: 1, outline: 'none',
  }

  const totalSeats    = tables.reduce((s, t) => s + t.seats, 0)
  const totalAssigned = Object.values(assign).flat().reduce((s, gid) => s + (guestMap[gid]?.passes || 0), 0)
  const totalGuests   = guests.reduce((s, g) => s + g.passes, 0)

  // ── Panel content (shared sidebar / drawer) ───────────────
  const PanelContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ borderBottom: '1px solid rgba(201,169,110,0.16)', display: 'flex', flexShrink: 0 }}>
        {[['guests','Guests'],['tables','Tables']].map(([k, l]) => (
          <button key={k} onClick={() => setPanel(k)}
            style={{ flex: 1, padding: '12px 0', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase',
              background: 'none', border: 'none', marginBottom: -1, transition: 'color .2s',
              color: panel === k ? '#8B6914' : 'rgba(139,105,20,0.4)',
              borderBottom: panel === k ? '2px solid #C9A96E' : '2px solid transparent' }}>
            {l}
          </button>
        ))}
      </div>

      {panel === 'guests' && (
        <div ref={panelRef} style={{ flex: 1, overflowY: 'auto', padding: 14,
          display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 8, letterSpacing: '.26em', textTransform: 'uppercase',
            color: '#C9A96E', marginBottom: 4 }}>
            Unassigned · {unassigned.length}
          </p>
          {unassigned.length === 0 && (
            <p style={{ fontSize: 11, color: '#8B6914', opacity: .5, fontStyle: 'italic',
              textAlign: 'center', marginTop: 20 }}>All guests seated ✓</p>
          )}
          {unassigned.map(gid => {
            const g = guestMap[gid]; if (!g) return null
            return (
              <div key={gid} className="guest-chip" data-guest={gid}
                onPointerDown={e => onGuestDragStart(e, gid, null)}
                style={{ padding: '10px 12px', borderRadius: 1, cursor: 'grab', touchAction: 'none',
                  background: `linear-gradient(120deg,${g.color}18,${g.color}08)`,
                  border: `1px solid ${g.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#1C1C1C', lineHeight: 1.3 }}>{g.name}</p>
                  <p style={{ fontSize: 9, color: '#8B6914', opacity: .65, letterSpacing: '.1em' }}>
                    {g.passes} {g.passes === 1 ? 'pass' : 'passes'}
                  </p>
                </div>
                <span style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: g.color + '28', border: `1px solid ${g.color}50`,
                  fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: g.color }}>
                  {g.passes}
                </span>
              </div>
            )
          })}

          {tables.some(t => (assign[t.id] || []).length > 0) && (
            <>
              <p style={{ fontSize: 8, letterSpacing: '.26em', textTransform: 'uppercase',
                color: '#C9A96E', marginTop: 10, marginBottom: 4 }}>
                Assigned · {Object.values(assign).flat().length}
              </p>
              {tables.map(t => (assign[t.id] || []).map(gid => {
                const g = guestMap[gid]; if (!g) return null
                return (
                  <div key={gid} style={{ padding: '8px 10px', borderRadius: 1, opacity: .7,
                    background: `${g.color}10`, border: `1px solid ${g.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 12, color: '#2C2C2C' }}>{g.name}</p>
                      <p style={{ fontSize: 9, color: '#8B6914', opacity: .6 }}>{t.name}</p>
                    </div>
                    <button onClick={() => removeGuestFromTable(gid, t.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 16, color: '#9A4040', opacity: .55, padding: '0 4px', lineHeight: 1 }}>×</button>
                  </div>
                )
              }))}
            </>
          )}
        </div>
      )}

      {panel === 'tables' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ ...card, padding: '14px 14px 16px' }}>
            <p style={{ fontSize: 8, letterSpacing: '.26em', textTransform: 'uppercase',
              color: '#C9A96E', marginBottom: 10 }}>Add Table</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input value={newTableName} onChange={e => setNewTableName(e.target.value)}
                placeholder="Table name (optional)" style={{ ...inp, width: '100%' }}/>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="number" min={2} max={20} value={newTableSeats}
                  onChange={e => setNewTableSeats(e.target.value)}
                  style={{ ...inp, width: 70 }} placeholder="Seats"/>
                <span style={{ fontSize: 10, color: '#8B6914', opacity: .6 }}>seats</span>
              </div>
              <button onClick={addTable}
                style={{ padding: '10px', fontFamily: 'inherit', fontSize: 9, letterSpacing: '.22em',
                  textTransform: 'uppercase', cursor: 'pointer', borderRadius: 1, border: 'none',
                  background: 'linear-gradient(135deg,#C9A96E,#8B6914)', color: '#FAF6F0' }}>
                + Add Table
              </button>
            </div>
          </div>

          {tables.map(t => {
            const used = seatsUsed(t.id), left = t.seats - used, pct = Math.round(used / t.seats * 100)
            return (
              <div key={t.id} style={{ ...card, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1C1C1C' }}>{t.name}</p>
                    <p style={{ fontSize: 9, color: '#8B6914', opacity: .6 }}>{used}/{t.seats} seats · {left} left</p>
                  </div>
                  <button onClick={() => removeTable(t.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 18, color: '#9A4040', opacity: .5, padding: '0 4px', lineHeight: 1 }}>×</button>
                </div>
                <div style={{ height: 3, background: 'rgba(201,169,110,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2,
                    background: pct >= 100 ? '#9A4040' : 'linear-gradient(to right,#C9A96E,#8B6914)',
                    transition: 'width .3s' }}/>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Jost',sans-serif}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:rgba(201,169,110,0.35);border-radius:3px}
        .guest-chip{cursor:grab;user-select:none;touch-action:none}
        .guest-chip:active{cursor:grabbing}
        .table-node{cursor:move;user-select:none;touch-action:none}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.35)}}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column',
        fontFamily: "'Jost',sans-serif",
        background: 'linear-gradient(155deg,#FAF6F0 0%,#F0E4CA 60%,#EDD9B8 100%)' }}>

        {/* ── Header ── */}
        <header style={{
          borderBottom: '1px solid rgba(201,169,110,0.18)',
          padding: isTablet ? '0 16px' : '0 24px',
          background: 'rgba(253,249,244,0.95)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 52, flexShrink: 0, zIndex: 60 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isTablet && (
              <button onClick={() => setDrawerOpen(o => !o)}
                style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px',
                  background: drawerOpen ? 'rgba(201,169,110,0.12)' : 'none',
                  border: '1px solid', borderColor: drawerOpen ? 'rgba(201,169,110,0.4)' : 'transparent',
                  borderRadius: 1, cursor: 'pointer' }}>
                {drawerOpen ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <line x1="3" y1="3" x2="13" y2="13" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="13" y1="3" x2="3" y2="13" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <>
                    <span style={{ width: 16, height: 1.5, background: '#8B6914', borderRadius: 1, opacity: .7 }}/>
                    <span style={{ width: 12, height: 1.5, background: '#8B6914', borderRadius: 1, opacity: .7 }}/>
                    <span style={{ width: 16, height: 1.5, background: '#8B6914', borderRadius: 1, opacity: .7 }}/>
                  </>
                )}
              </button>
            )}

            <svg width="22" height="14" viewBox="0 0 32 20" fill="none">
              <circle cx="11" cy="10" r="8.5" stroke="#C9A96E" strokeWidth="1.3" fill="none"/>
              <circle cx="21" cy="10" r="8.5" stroke="#C9A96E" strokeWidth="1.3" fill="rgba(201,169,110,0.08)"/>
            </svg>
            <span style={{ fontFamily: "'Cormorant Garamond',serif",
              fontSize: isTablet ? '1rem' : '1.1rem', color: '#2C2C2C', letterSpacing: '.04em' }}>
              {coupleName}
            </span>
            {!isTablet && (
              <>
                <span style={{ width: 1, height: 16, background: 'rgba(201,169,110,0.4)' }}/>
                <span style={{ fontSize: 9, letterSpacing: '.3em', textTransform: 'uppercase',
                  color: '#8B6914', opacity: .65 }}>Seating Plan</span>
              </>
            )}
            <a href="/dashboard" style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#8B6914', textDecoration: 'none', opacity: 0.5,
              border: '1px solid rgba(201,169,110,0.3)', padding: '5px 12px', borderRadius: 1 }}>
              Dashboard
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isTablet ? 12 : 20 }}>
            {(isTablet
              ? [{ label: 'Placed', val: totalAssigned }, { label: 'Left', val: totalGuests - totalAssigned }]
              : [
                  { label: 'Tables',      val: tables.length },
                  { label: 'Total Seats', val: totalSeats },
                  { label: 'Placed',      val: totalAssigned },
                  { label: 'Remaining',   val: totalGuests - totalAssigned },
                ]
            ).map(({ label, val }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif",
                  fontSize: isTablet ? '1.1rem' : '1.3rem',
                  fontWeight: 300, color: '#C9A96E', lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 8, letterSpacing: '.18em', textTransform: 'uppercase',
                  color: '#8B6914', opacity: .6 }}>{label}</p>
              </div>
            ))}

            <div style={{ width: 1, height: 28, background: 'rgba(201,169,110,0.3)' }}/>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isDirty && saveStatus === 'idle' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A96E',
                    boxShadow: '0 0 0 2px rgba(201,169,110,0.25)', display: 'inline-block',
                    animation: 'pulse 1.8s ease-in-out infinite' }}/>
                  {!isTablet && <span style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase',
                    color: '#8B6914', opacity: .65 }}>Unsaved</span>}
                </div>
              )}
              {saveStatus === 'saved'  && <span style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#3A6A34' }}>✓ Saved</span>}
              {saveStatus === 'error'  && <span style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: '#943030' }}>Failed</span>}
              <button onClick={saveToDatabase} disabled={saveStatus === 'saving' || !isDirty}
                style={{ padding: isTablet ? '8px 12px' : '8px 16px',
                  fontFamily: 'inherit', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase',
                  cursor: isDirty ? 'pointer' : 'default', borderRadius: 1, border: 'none', transition: 'all .2s',
                  background: isDirty ? 'linear-gradient(135deg,#C9A96E,#8B6914)' : 'rgba(201,169,110,0.15)',
                  color: isDirty ? '#FAF6F0' : 'rgba(139,105,20,0.4)',
                  boxShadow: isDirty ? '0 3px 12px rgba(139,105,20,0.22)' : 'none',
                  opacity: saveStatus === 'saving' ? 0.7 : 1 }}>
                {saveStatus === 'saving' ? '…' : 'Save'}
              </button>
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

          {!isTablet && (
            <aside style={{ width: 264, flexShrink: 0,
              borderRight: '1px solid rgba(201,169,110,0.16)',
              display: 'flex', flexDirection: 'column',
              background: 'rgba(253,249,244,0.92)', backdropFilter: 'blur(6px)' }}>
              <PanelContent/>
            </aside>
          )}

          {isTablet && drawerOpen && (
            <>
              <div onClick={() => setDrawerOpen(false)}
                style={{ position: 'absolute', inset: 0, zIndex: 40,
                  background: 'rgba(28,18,4,0.35)', backdropFilter: 'blur(2px)',
                  animation: 'fadeIn .2s ease' }}/>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 50,
                width: Math.min(300, typeof window !== 'undefined' ? window.innerWidth * 0.82 : 300),
                background: 'rgba(253,249,244,0.98)', backdropFilter: 'blur(12px)',
                borderRight: '1px solid rgba(201,169,110,0.22)',
                boxShadow: '4px 0 24px rgba(139,105,20,0.15)',
                display: 'flex', flexDirection: 'column',
                animation: 'slideIn .25s ease' }}>
                <PanelContent/>
              </div>
            </>
          )}

          {/* ── Canvas ── */}
          <div ref={canvasRef}
            onPointerMove={onCanvasMove} onPointerUp={onCanvasUp} onPointerLeave={onCanvasUp}
            style={{ flex: 1, position: 'relative', overflow: 'hidden',
              backgroundImage: 'radial-gradient(circle,rgba(201,169,110,0.12) 1px,transparent 1px)',
              backgroundSize: '32px 32px', backgroundPosition: '16px 16px' }}>

            <p style={{ position: 'absolute', bottom: 20, right: 20, fontSize: '0.85rem',
              letterSpacing: '.3em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.3)',
              pointerEvents: 'none', fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic' }}>
              {venueLabel}
            </p>

            {isTablet && !drawerOpen && unassigned.length > 0 && (
              <div style={{ position: 'absolute', top: 12, left: 12,
                background: 'rgba(253,248,242,0.92)', backdropFilter: 'blur(6px)',
                border: '1px solid rgba(201,169,110,0.28)', borderRadius: 2,
                padding: '8px 12px', pointerEvents: 'none',
                boxShadow: '0 2px 12px rgba(139,105,20,0.1)' }}>
                <p style={{ fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase',
                  color: '#8B6914', opacity: .7 }}>
                  ☰ Open panel · drag guests to tables
                </p>
              </div>
            )}

            {tables.map(t => {
              const used  = seatsUsed(t.id)
              const left  = t.seats - used
              const pct   = used / t.seats
              const isHov = dropHint === t.id
              const full  = left <= 0
              const gids  = assign[t.id] || []
              const size  = isTablet
                ? Math.max(110, Math.min(180, 75 + t.seats * 8))
                : Math.max(130, Math.min(220, 90 + t.seats * 9))

              return (
                <div key={t.id} data-tableid={t.id} className="table-node"
                  onPointerDown={e => onTableDragStart(e, t.id)}
                  style={{ position: 'absolute', left: t.x, top: t.y, width: size, zIndex: 10 }}>
                  <div style={{
                    width: size, height: size, borderRadius: '50%',
                    background: isHov
                      ? full ? 'radial-gradient(circle,rgba(154,64,64,0.15),rgba(245,237,224,0.9))'
                             : 'radial-gradient(circle,rgba(201,169,110,0.22),rgba(245,237,224,0.9))'
                      : 'radial-gradient(circle,rgba(253,248,242,0.98),rgba(245,237,224,0.88))',
                    border: isHov
                      ? full ? '2px solid rgba(154,64,64,0.5)' : '2px solid rgba(201,169,110,0.7)'
                      : '1px solid rgba(201,169,110,0.3)',
                    boxShadow: isHov
                      ? '0 4px 24px rgba(201,169,110,0.3)'
                      : '0 2px 14px rgba(139,105,20,0.1),inset 0 1px 0 rgba(255,255,255,0.9)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '12px 10px', transition: 'all .2s', position: 'relative', overflow: 'hidden' }}>

                    <span style={{ position: 'absolute', fontFamily: "'Cormorant Garamond',serif",
                      fontSize: isTablet ? '3rem' : '4.5rem', fontWeight: 300,
                      color: 'rgba(201,169,110,0.07)', lineHeight: 1,
                      pointerEvents: 'none', userSelect: 'none', top: '10%' }}>
                      {t.id.replace(/\D/g, '').slice(-1) || '·'}
                    </span>

                    <svg width={size - 16} height={size - 16}
                      style={{ position: 'absolute', top: 8, left: 8, pointerEvents: 'none' }}>
                      <circle cx={(size-16)/2} cy={(size-16)/2} r={(size-16)/2-4}
                        fill="none" stroke="rgba(201,169,110,0.12)" strokeWidth="2"/>
                      <circle cx={(size-16)/2} cy={(size-16)/2} r={(size-16)/2-4}
                        fill="none"
                        stroke={pct >= 1 ? 'rgba(154,64,64,0.5)' : 'rgba(201,169,110,0.5)'}
                        strokeWidth="2.5"
                        strokeDasharray={`${pct * Math.PI * (size-24)} ${Math.PI * (size-24)}`}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${(size-16)/2} ${(size-16)/2})`}
                        style={{ transition: 'stroke-dasharray .4s ease' }}/>
                    </svg>

                    <p style={{ fontSize: isTablet ? 9 : 10, letterSpacing: '.2em', textTransform: 'uppercase',
                      color: '#8B6914', opacity: .75, marginBottom: 2, textAlign: 'center',
                      position: 'relative', zIndex: 1 }}>{t.name}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif",
                      fontSize: isTablet ? '1.3rem' : '1.6rem', fontWeight: 300,
                      color: pct >= 1 ? '#9A4040' : '#C9A96E', lineHeight: 1, position: 'relative', zIndex: 1 }}>
                      {used}<span style={{ fontSize: '.8rem', opacity: .5 }}>/{t.seats}</span>
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center',
                      maxWidth: size - 24, marginTop: 6, position: 'relative', zIndex: 2 }}>
                      {gids.map(gid => {
                        const g = guestMap[gid]; if (!g) return null
                        return (
                          <div key={gid} className="guest-chip" data-guest={gid}
                            onPointerDown={e => { e.stopPropagation(); onGuestDragStart(e, gid, t.id) }}
                            title={`${g.name} · ${g.passes} pass`}
                            style={{ padding: '2px 5px', borderRadius: 10,
                              fontSize: isTablet ? 8 : 9,
                              background: `${g.color}22`, border: `1px solid ${g.color}45`,
                              color: g.color, whiteSpace: 'nowrap',
                              maxWidth: size - 32, overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.6 }}>
                            {g.name.split(' ')[0]}
                            <span style={{ opacity: .6, marginLeft: 2 }}>{g.passes}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 5 }}>
                    <p style={{ fontSize: 9, letterSpacing: '.12em', color: '#8B6914', opacity: .5 }}>
                      {left} seat{left !== 1 ? 's' : ''} left
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Drag ghost */}
            {(() => {
              const d = drag.current
              if (!d || !dragPos) return null
              const g = guestMap[d.id]; if (!g) return null
              return (
                <div style={{ position: 'fixed', left: dragPos.x - 40, top: dragPos.y - 18,
                  zIndex: 9999, pointerEvents: 'none', padding: '6px 12px', borderRadius: 1,
                  background: `linear-gradient(120deg,${g.color}dd,${g.color}aa)`,
                  color: '#FAF6F0', fontSize: 11, fontWeight: 500,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)', border: `1px solid ${g.color}`, opacity: .92 }}>
                  {g.name} · {g.passes}
                </div>
              )
            })()}
          </div>
        </div>

        {/* ── Nav warning modal ── */}
        {navWarning && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(28,18,4,0.55)', backdropFilter: 'blur(6px)' }}>
            <div style={{ position: 'relative',
              width: isTablet ? 'calc(100% - 32px)' : 400, maxWidth: 400,
              background: 'linear-gradient(160deg,rgba(253,248,242,0.99),rgba(245,237,224,0.97))',
              border: '1px solid rgba(201,169,110,0.35)', borderRadius: 2, padding: '32px 28px',
              boxShadow: '0 24px 64px rgba(139,105,20,0.28),inset 0 1px 0 rgba(255,255,255,0.9)' }}>
              <Corners/>
              <div style={{ textAlign: 'center', marginBottom: 14 }}>
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none" style={{ margin: '0 auto' }}>
                  <path d="M18 3 L33 30 H3 Z" stroke="#C9A96E" strokeWidth="1.4"
                    fill="rgba(201,169,110,0.08)" strokeLinejoin="round"/>
                  <line x1="18" y1="14" x2="18" y2="22" stroke="#C9A96E" strokeWidth="1.6" strokeLinecap="round"/>
                  <circle cx="18" cy="26" r="1.2" fill="#C9A96E"/>
                </svg>
              </div>
              <p style={{ fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase',
                color: '#C9A96E', textAlign: 'center', marginBottom: 8 }}>Unsaved Changes</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 400,
                color: '#2C2C2C', textAlign: 'center', marginBottom: 10 }}>Leave without saving?</h3>
              <p style={{ fontSize: 12, color: '#5C4A2A', textAlign: 'center', lineHeight: 1.7,
                marginBottom: 24, opacity: .8 }}>
                Your seating arrangement has unsaved changes. They are preserved in your browser,
                but not yet written to the database.
              </p>
              <div style={{ display: 'flex', gap: 8, flexDirection: isTablet ? 'column' : 'row' }}>
                <button onClick={() => setNavWarning(false)}
                  style={{ flex: 1, padding: '11px', fontFamily: 'inherit', fontSize: 9,
                    letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer',
                    borderRadius: 1, background: 'transparent', color: '#8B6914',
                    border: '1px solid rgba(201,169,110,0.35)' }}>
                  Stay &amp; Save
                </button>
                <button onClick={async () => {
                  setNavWarning(false)
                  await saveToDatabase()
                  if (pendingNav.current) window.location.href = pendingNav.current
                }}
                  style={{ flex: 1, padding: '11px', fontFamily: 'inherit', fontSize: 9,
                    letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer',
                    borderRadius: 1, border: 'none',
                    background: 'linear-gradient(135deg,#C9A96E,#8B6914)', color: '#FAF6F0',
                    boxShadow: '0 4px 14px rgba(139,105,20,0.22)' }}>
                  Save &amp; Leave
                </button>
                <button onClick={() => {
                  setNavWarning(false)
                  setIsDirty(false)
                  if (pendingNav.current) window.location.href = pendingNav.current
                }}
                  style={{ flex: 1, padding: '11px', fontFamily: 'inherit', fontSize: 9,
                    letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer',
                    borderRadius: 1, background: 'rgba(154,48,48,0.07)', color: '#943030',
                    border: '1px solid rgba(154,48,48,0.22)' }}>
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Split modal ── */}
        {splitModal && (() => {
          const modal = splitModal
          const guest = guestMap[modal.guestId]; if (!guest) return null
          const last  = lastName(guest.name)
          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(44,28,8,0.45)', backdropFilter: 'blur(4px)' }}>
              <div style={{ position: 'relative',
                width: isTablet ? 'calc(100% - 32px)' : 380, maxWidth: 380,
                background: 'linear-gradient(160deg,rgba(253,248,242,0.99),rgba(245,237,224,0.97))',
                border: '1px solid rgba(201,169,110,0.35)', borderRadius: 2, padding: '32px 28px',
                boxShadow: '0 20px 60px rgba(139,105,20,0.25),inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                <Corners/>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <svg width="28" height="18" viewBox="0 0 36 22" fill="none" style={{ margin: '0 auto' }}>
                    <circle cx="13" cy="11" r="9" stroke="#C9A96E" strokeWidth="1.2" fill="none"/>
                    <circle cx="23" cy="11" r="9" stroke="#C9A96E" strokeWidth="1.2" fill="rgba(201,169,110,0.06)"/>
                  </svg>
                </div>
                <p style={{ fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase',
                  color: '#C9A96E', textAlign: 'center', marginBottom: 8 }}>Split Invitation</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 400,
                  color: '#2C2C2C', textAlign: 'center', marginBottom: 6 }}>{guest.name}</h3>
                <p style={{ fontSize: 12, color: '#5C4A2A', textAlign: 'center',
                  lineHeight: 1.6, marginBottom: 18, opacity: .8 }}>
                  <strong>{guest.passes}</strong> passes requested, only{' '}
                  <strong>{modal.available}</strong> seat{modal.available !== 1 ? 's' : ''} at{' '}
                  <strong>{tableMap[modal.tableId]?.name}</strong>.
                </p>
                <div style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)',
                  borderRadius: 1, padding: '12px 14px', marginBottom: 18 }}>
                  <p style={{ fontSize: 11, color: '#8B6914', lineHeight: 1.8 }}>
                    This will create two entries and <strong>cannot be undone here</strong>.<br/>
                    <strong>&ldquo;{last} 1&rdquo;</strong> → {modal.available} pass{modal.available !== 1 ? 'es' : ''} at {tableMap[modal.tableId]?.name}<br/>
                    <strong>&ldquo;{last} 2&rdquo;</strong> → {guest.passes - modal.available} pass{(guest.passes - modal.available) !== 1 ? 'es' : ''} → unassigned
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setSplitModal(null)}
                    style={{ flex: 1, padding: '11px', fontFamily: 'inherit', fontSize: 9,
                      letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer',
                      borderRadius: 1, background: 'transparent', color: '#8B6914',
                      border: '1px solid rgba(201,169,110,0.35)' }}>
                    Cancel
                  </button>
                  <button onClick={doSplit}
                    style={{ flex: 2, padding: '11px', fontFamily: 'inherit', fontSize: 9,
                      letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer',
                      borderRadius: 1, border: 'none',
                      background: 'linear-gradient(135deg,#C9A96E,#8B6914)', color: '#FAF6F0',
                      boxShadow: '0 4px 14px rgba(139,105,20,0.22)' }}>
                    Split &amp; Place
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </>
  )
}