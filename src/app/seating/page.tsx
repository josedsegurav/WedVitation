'use client'
import { useState, useRef, useCallback, useEffect } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

type Guest = {
  id: string;
  name: string;
  passes: number;
  color: string;
};

type Table = {
  id: string;
  name: string;
  seats: number;
  x: number;
  y: number;
};

type AssignMap = Record<string, string[]>;

type SeatingState = {
  guests: Guest[];
  tables: Table[];
  assign: AssignMap;
  unassigned: string[];
};

type DragState = {
  type: 'guest';
  id: string;
  tableFrom: string | null;
  offsetX: number;
  offsetY: number;
};

type DragPos = { x: number; y: number };

type TableDragState = {
  id: string;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
};

type SplitModalState = {
  guestId: string;
  tableId: string;
  available: number;
  tableFrom?: string;
};

// ─── seed data ────────────────────────────────────────────────
const SEED_GUESTS: Guest[] = [
  { id:"g1",  name:"Elena Moretti",       passes:2, color:"#C9A96E" },
  { id:"g2",  name:"Luca Bianchi",        passes:1, color:"#A0896A" },
  { id:"g3",  name:"Giulia Ferrara",      passes:4, color:"#B8956A" },
  { id:"g4",  name:"Sofia Ricci",         passes:3, color:"#C4A882" },
  { id:"g5",  name:"Pietro Romano",       passes:2, color:"#9A7A5A" },
  { id:"g6",  name:"Valentina Esposito",  passes:1, color:"#B8956A" },
  { id:"g7",  name:"Andrea Colombo",      passes:2, color:"#C9A96E" },
  { id:"g8",  name:"Chiara De Luca",      passes:2, color:"#A09060" },
  { id:"g9",  name:"Roberto Mancini",     passes:3, color:"#B8956A" },
  { id:"g10", name:"Francesca Gallo",     passes:2, color:"#C4A882" },
  { id:"g11", name:"Matteo Ferrari",      passes:1, color:"#9A7A5A" },
  { id:"g12", name:"Isabella Bruno",      passes:2, color:"#C9A96E" },
];

const COLORS = ["#C9A96E","#A0896A","#B8956A","#C4A882","#9A7A5A","#8B7355","#BFA882","#A08060"];
let colorIdx = 0;
const nextColor = () => COLORS[colorIdx++ % COLORS.length];

const SEED_TABLES: Table[] = [
  { id:"t1", name:"Table 1", seats:8,  x:80,  y:60  },
  { id:"t2", name:"Table 2", seats:8,  x:340, y:60  },
  { id:"t3", name:"Table 3", seats:6,  x:600, y:60  },
  { id:"t4", name:"Table 4", seats:10, x:80,  y:320 },
  { id:"t5", name:"Table 5", seats:6,  x:340, y:320 },
];

const SEED_ASSIGN: AssignMap = {
  t1:["g1","g2","g7"],
  t2:["g5","g6","g12"],
  t3:["g10","g11"],
  t4:[],
  t5:[],
};

const LS_KEY = "seating_v1";
function loadFromStorage(): SeatingState | null {
  try {
    const r = localStorage.getItem(LS_KEY);
    return r ? (JSON.parse(r) as SeatingState) : null;
  } catch {
    return null;
  }
}
function saveToStorage(data: SeatingState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}
function getInitialState(): SeatingState {
  const saved = loadFromStorage();
  if (saved) return saved;
  return {
    guests: SEED_GUESTS,
    tables: SEED_TABLES,
    assign: SEED_ASSIGN,
    unassigned: SEED_GUESTS.filter(g=>!Object.values(SEED_ASSIGN).flat().includes(g.id)).map(g=>g.id),
  };
}

function uid() { return "id_" + Math.random().toString(36).slice(2,9); }
function lastName(name: string) { return name.split(" ").slice(1).join(" ") || name; }

// ─────────────────────────────────────────────────────────────
export default function SeatingTool() {
  const init = getInitialState();
  const [guests,    setGuests]    = useState<Guest[]>(init.guests);
  const [tables,    setTables]    = useState<Table[]>(init.tables);
  const [assign,    setAssign]    = useState<AssignMap>(init.assign);
  const [unassigned,setUnassigned]= useState<string[]>(init.unassigned);

  // ── dirty / save state ────────────────────────────────────
  const [isDirty,   setIsDirty]   = useState(false);
  const [saveStatus,setSaveStatus]= useState<'idle' | 'saving' | 'saved' | 'error'>("idle");
  const [navWarning,setNavWarning]= useState(false);
  const pendingNav = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage({ guests, tables, assign, unassigned });
  }, [guests, tables, assign, unassigned]);

  // Mark dirty after mount
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setIsDirty(true);
    setSaveStatus("idle");
  }, [guests, tables, assign, unassigned]);

  // Warn on browser tab close / reload
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault(); e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Intercept in-app anchor clicks when dirty
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || !isDirty) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return;
      e.preventDefault();
      pendingNav.current = href;
      setNavWarning(true);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [isDirty]);

  // ── Save to database ──────────────────────────────────────
  const saveToDatabase = async () => {
    setSaveStatus("saving");
    try {
      // Replace with your real API call:
      // await fetch("/api/seating", { method:"POST",
      //   headers:{"Content-Type":"application/json"},
      //   body: JSON.stringify({ guests, tables, assign, unassigned }) });
      await new Promise(r => setTimeout(r, 900)); // simulated
      setSaveStatus("saved");
      setIsDirty(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  };

  // drag state
  const drag = useRef<DragState | null>(null);

  const canvasRef  = useRef<HTMLDivElement | null>(null);
  const [dragPos,  setDragPos]  = useState<DragPos | null>(null); // {x,y} for ghost
  const [dropHint, setDropHint] = useState<string | null>(null); // tableId being hovered

  // table drag
  const tableDrag = useRef<TableDragState | null>(null);

  // panel
  const [panel, setPanel] = useState<"guests" | "tables">("guests");
  const [newTableSeats, setNewTableSeats] = useState("8");
  const [newTableName, setNewTableName]   = useState("");

  // split modal
  const [splitModal, setSplitModal] = useState<SplitModalState | null>(null);

  // ── derived ──────────────────────────────────────────────
  const guestMap: Record<string, Guest> = Object.fromEntries(
    guests.map(g => [g.id, g] as const)
  );
  const tableMap: Record<string, Table> = Object.fromEntries(
    tables.map(t => [t.id, t] as const)
  );

  const seatsUsed = (tid: string) => {
    const gids = assign[tid] || [];
    return gids.reduce((s: number, gid: string)=> s + (guestMap[gid]?.passes||0), 0);
  };

  const seatsLeft = (tid: string) => (tableMap[tid]?.seats||0) - seatsUsed(tid);

  // ── guest drag start (from panel or table) ────────────────
  const onGuestDragStart = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, guestId: string, fromTable: string | null = null) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    drag.current = { type:"guest", id:guestId, tableFrom:fromTable,
      offsetX: e.clientX - r.left, offsetY: e.clientY - r.top };
    setDragPos({ x:e.clientX, y:e.clientY });
  }, []);

  // ── table drag start ──────────────────────────────────────
  const onTableDragStart = useCallback((e: ReactPointerEvent<HTMLDivElement>, tableId: string) => {
    // only if clicking the table header/background, not a guest chip
    const target = e.target as HTMLElement | null;
    if (target?.closest("[data-guest]")) return;
    e.stopPropagation();
    const t = tableMap[tableId];
    tableDrag.current = { id:tableId, startX:e.clientX, startY:e.clientY, origX:t.x, origY:t.y };
  }, [tableMap]);

  // ── pointer move ──────────────────────────────────────────
  const onCanvasPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (tableDrag.current) {
      const { id, startX, startY, origX, origY } = tableDrag.current;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      setTables(ts => ts.map(t => t.id===id ? {...t, x:Math.max(0,origX+dx), y:Math.max(0,origY+dy)} : t));
      return;
    }
    if (!drag.current) return;
    setDragPos({ x:e.clientX, y:e.clientY });
    // find hovered table
    const canvas = canvasRef.current;
    if (!canvas) return;
    const els = canvas.querySelectorAll<HTMLElement>("[data-tableid]");
    let found = null;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom)
        found = el.getAttribute("data-tableid");
    });
    setDropHint(found);
  }, []);

  // ── pointer up ────────────────────────────────────────────
  const onCanvasPointerUp = useCallback(() => {
    if (tableDrag.current) { tableDrag.current = null; return; }
    if (!drag.current) return;
    const { id:guestId, tableFrom } = drag.current;
    const targetTable = dropHint;

    if (targetTable && targetTable !== tableFrom) {
      const guest  = guestMap[guestId];
      const avail  = seatsLeft(targetTable);

      if (avail <= 0) {
        // no room at all
        drag.current = null; setDragPos(null); setDropHint(null); return;
      }

      if (guest.passes > avail) {
        // need to split
        setSplitModal({ guestId, tableId:targetTable, available:avail });
        drag.current = null; setDragPos(null); setDropHint(null); return;
      }

      // normal drop
      setAssign((a: AssignMap) => {
        const next = {...a};
        // remove from source
        if (tableFrom) next[tableFrom] = (next[tableFrom]||[]).filter(x=>x!==guestId);
        else setUnassigned((u: string[]) => u.filter(x=>x!==guestId));
        // add to target
        next[targetTable] = [...(next[targetTable]||[]), guestId];
        return next;
      });
      if (!tableFrom) setUnassigned((u: string[]) => u.filter(x=>x!==guestId));
    } else if (!targetTable && tableFrom) {
      // dropped back to panel / outside — unassign
      setAssign((a: AssignMap) => {
        const next={...a};
        next[tableFrom] = (next[tableFrom]||[]).filter(x=>x!==guestId);
        return next;
      });
      setUnassigned((u: string[]) => u.includes(guestId)?u:[...u,guestId]);
    }

    drag.current = null; setDragPos(null); setDropHint(null);
  }, [dropHint, guestMap, seatsLeft]);

  // ── split confirm ─────────────────────────────────────────
  const doSplit = () => {
    if (!splitModal) return;
    const { guestId, tableId, available } = splitModal;
    const guest = guestMap[guestId];
    const last  = lastName(guest.name);
    const col   = guest.color || nextColor();

    const g1: Guest = { ...guest, id:uid(), name:`${last} 1`, passes:available, color:col };
    const g2: Guest = { ...guest, id:uid(), name:`${last} 2`, passes:guest.passes-available, color:col };

    setGuests((gs: Guest[]) => [...gs.filter(g=>g.id!==guestId), g1, g2]);
    setAssign((a: AssignMap) => {
      const next={...a};
      if (splitModal.tableFrom) next[splitModal.tableFrom]=(next[splitModal.tableFrom]||[]).filter(x=>x!==guestId);
      next[tableId] = [...(next[tableId]||[]), g1.id];
      return next;
    });
    setUnassigned((u: string[]) => [...u.filter(x=>x!==guestId), g2.id]);
    setSplitModal(null);
  };

  // ── add table ─────────────────────────────────────────────
  const addTable = () => {
    const seats = Math.max(2, parseInt(newTableSeats)||8);
    const id    = uid();
    const name  = newTableName.trim() || `Table ${tables.length+1}`;
    setTables((ts: Table[]) => [...ts, { id, name, seats, x:120+tables.length*30%200, y:120+tables.length*20%200 }]);
    setAssign((a: AssignMap) => ({...a, [id]:[]}));
    setNewTableName("");
    setNewTableSeats("8");
  };

  const removeTable = (tid: string) => {
    const freed = assign[tid]||[];
    setUnassigned((u: string[]) => [...u, ...freed.filter(x=>!u.includes(x))]);
    setTables((ts: Table[]) => ts.filter(t=>t.id!==tid));
    setAssign((a: AssignMap) => { const n={...a}; delete n[tid]; return n; });
  };

  const removeGuestFromTable = (gid: string, tid: string) => {
    setAssign((a: AssignMap) => ({...a, [tid]:(a[tid]||[]).filter(x=>x!==gid)}));
    setUnassigned((u: string[]) => u.includes(gid)?u:[...u,gid]);
  };

  // ── styles ────────────────────────────────────────────────
  const card: CSSProperties = {
    position:"relative", borderRadius:2, overflow:"hidden",
    background:"linear-gradient(160deg,rgba(253,248,242,0.97),rgba(245,237,224,0.9))",
    border:"1px solid rgba(201,169,110,0.24)",
    boxShadow:"0 2px 20px rgba(139,105,20,0.07),inset 0 1px 0 rgba(255,255,255,0.8)",
  };

  const inp: CSSProperties = {
    fontFamily:"inherit", fontSize:12, color:"#2C2C2C", padding:"7px 11px",
    background:"rgba(201,169,110,0.05)", border:"1px solid rgba(201,169,110,0.26)",
    borderRadius:1, outline:"none",
  };

  const totalSeats    = tables.reduce((s, t) => s + t.seats, 0);
  const totalAssigned = Object.values(assign)
    .flat()
    .reduce((s: number, gid: string) => s + (guestMap[gid]?.passes || 0), 0);
  const totalGuests   = guests.reduce((s, g) => s + g.passes, 0);

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
        .tab-btn{padding:8px 18px;cursor:pointer;font-family:inherit;font-size:9px;
          letter-spacing:.24em;text-transform:uppercase;background:none;border:none;
          transition:color .2s;margin-bottom:-1px}
      `}</style>

      <div style={{height:"100vh",display:"flex",flexDirection:"column",
        fontFamily:"'Jost',sans-serif",
        background:"linear-gradient(155deg,#FAF6F0 0%,#F0E4CA 60%,#EDD9B8 100%)"}}>

        {/* ── Top bar ── */}
        <header style={{
          borderBottom:"1px solid rgba(201,169,110,0.18)",padding:"0 24px",
          background:"rgba(253,249,244,0.95)",backdropFilter:"blur(8px)",
          display:"flex",alignItems:"center",justifyContent:"space-between",height:52,
          flexShrink:0, zIndex:60}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <svg width="22" height="14" viewBox="0 0 32 20" fill="none">
              <circle cx="11" cy="10" r="8.5" stroke="#C9A96E" strokeWidth="1.3" fill="none"/>
              <circle cx="21" cy="10" r="8.5" stroke="#C9A96E" strokeWidth="1.3" fill="rgba(201,169,110,0.08)"/>
            </svg>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"#2C2C2C",letterSpacing:".04em"}}>
              Sofia &amp; Marco
            </span>
            <span style={{width:1,height:16,background:"rgba(201,169,110,0.4)"}}/>
            <span style={{fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#8B6914",opacity:.65}}>
              Seating Plan
            </span>
            <a href="/dashboard" style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",
              color:"#8B6914",textDecoration:"none",opacity:0.5,
              border:"1px solid rgba(201,169,110,0.3)",padding:"5px 12px",borderRadius:1}}>
              Dashboard
            </a>
          </div>
          {/* stats + save */}
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            {[
              {label:"Tables", val:tables.length},
              {label:"Total Seats", val:totalSeats},
              {label:"Guests Placed", val:totalAssigned},
              {label:"Remaining", val:totalGuests-totalAssigned},
            ].map(({label,val})=>(
              <div key={label} style={{textAlign:"center"}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,
                  color:"#C9A96E",lineHeight:1}}>{val}</p>
                <p style={{fontSize:8,letterSpacing:".2em",textTransform:"uppercase",color:"#8B6914",opacity:.6}}>{label}</p>
              </div>
            ))}

            {/* divider */}
            <div style={{width:1,height:28,background:"rgba(201,169,110,0.3)"}}/>

            {/* dirty dot + save button */}
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {isDirty && saveStatus==="idle" && (
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:"#C9A96E",
                    boxShadow:"0 0 0 2px rgba(201,169,110,0.25)",display:"inline-block",
                    animation:"pulse 1.8s ease-in-out infinite"}}/>
                  <span style={{fontSize:9,letterSpacing:".18em",textTransform:"uppercase",
                    color:"#8B6914",opacity:.65}}>Unsaved</span>
                </div>
              )}
              {saveStatus==="saved" && (
                <span style={{fontSize:9,letterSpacing:".18em",textTransform:"uppercase",
                  color:"#3A6A34"}}>✓ Saved</span>
              )}
              {saveStatus==="error" && (
                <span style={{fontSize:9,letterSpacing:".18em",textTransform:"uppercase",
                  color:"#943030"}}>Save failed</span>
              )}
              <button
                onClick={saveToDatabase}
                disabled={saveStatus==="saving" || !isDirty}
                style={{
                  padding:"8px 16px",fontFamily:"inherit",fontSize:9,letterSpacing:".22em",
                  textTransform:"uppercase",cursor:isDirty?"pointer":"default",
                  borderRadius:1,border:"none",transition:"all .2s",
                  background: isDirty
                    ? "linear-gradient(135deg,#C9A96E,#8B6914)"
                    : "rgba(201,169,110,0.15)",
                  color: isDirty ? "#FAF6F0" : "rgba(139,105,20,0.4)",
                  boxShadow: isDirty ? "0 3px 12px rgba(139,105,20,0.22)" : "none",
                  opacity: saveStatus==="saving" ? 0.7 : 1,
                }}>
                {saveStatus==="saving" ? "Saving…" : "Save to DB"}
              </button>
            </div>
          </div>
        </header>

        {/* ── Body: sidebar + canvas ── */}
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>

          {/* ── Left panel ── */}
          <aside style={{width:260,flexShrink:0,borderRight:"1px solid rgba(201,169,110,0.16)",
            display:"flex",flexDirection:"column",background:"rgba(253,249,244,0.92)",
            backdropFilter:"blur(6px)"}}>

            {/* Panel tabs */}
            <div style={{borderBottom:"1px solid rgba(201,169,110,0.16)",display:"flex",padding:"0 4px"}}>
              {[["guests","Guests"],["tables","Tables"]].map(([k,l])=>(
                <button key={k} className="tab-btn" onClick={()=>setPanel(k as "guests" | "tables")}
                  style={{color:panel===k?"#8B6914":"rgba(139,105,20,0.4)",
                    borderBottom:panel===k?"2px solid #C9A96E":"2px solid transparent"}}>
                  {l}
                </button>
              ))}
            </div>

            {/* ── Guest panel ── */}
            {panel==="guests" && (
              <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:6}}>
                <p style={{fontSize:8,letterSpacing:".26em",textTransform:"uppercase",
                  color:"#C9A96E",marginBottom:4}}>
                  Unassigned · {unassigned.length}
                </p>
                {unassigned.length===0 && (
                  <p style={{fontSize:11,color:"#8B6914",opacity:.5,fontStyle:"italic",textAlign:"center",marginTop:20}}>
                    All guests seated ✓
                  </p>
                )}
                {unassigned.map((gid: string) => {
                  const g = guestMap[gid]; if(!g) return null;
                  return (
                    <div key={gid} className="guest-chip" data-guest={gid}
                      onPointerDown={e=>onGuestDragStart(e,gid,null)}
                      style={{
                        padding:"8px 12px",borderRadius:1,cursor:"grab",
                        background:`linear-gradient(120deg,${g.color}18,${g.color}08)`,
                        border:`1px solid ${g.color}44`,
                        display:"flex",alignItems:"center",justifyContent:"space-between",
                      }}>
                      <div>
                        <p style={{fontSize:12,fontWeight:500,color:"#1C1C1C",lineHeight:1.3}}>{g.name}</p>
                        <p style={{fontSize:9,color:"#8B6914",opacity:.65,letterSpacing:".1em"}}>
                          {g.passes} {g.passes===1?"pass":"passes"}
                        </p>
                      </div>
                      <span style={{width:24,height:24,borderRadius:"50%",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        background:g.color+"28",border:`1px solid ${g.color}50`,
                        fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:g.color}}>
                        {g.passes}
                      </span>
                    </div>
                  );
                })}

                {/* assigned list */}
                    {tables.some((t: Table)=>(assign[t.id]||[]).length>0) && (
                  <>
                    <p style={{fontSize:8,letterSpacing:".26em",textTransform:"uppercase",
                      color:"#C9A96E",marginTop:10,marginBottom:4}}>
                      Assigned · {Object.values(assign).flat().length}
                    </p>
                    {tables.map((t: Table) => (assign[t.id]||[]).map((gid: string) => {
                      const g = guestMap[gid]; if(!g) return null;
                      return (
                        <div key={gid} style={{
                          padding:"6px 10px",borderRadius:1,opacity:.65,
                          background:`${g.color}10`,border:`1px solid ${g.color}28`,
                          display:"flex",alignItems:"center",justifyContent:"space-between",
                        }}>
                          <div>
                            <p style={{fontSize:11,color:"#2C2C2C"}}>{g.name}</p>
                            <p style={{fontSize:9,color:"#8B6914",opacity:.6}}>{t.name}</p>
                          </div>
                          <button onClick={()=>removeGuestFromTable(gid,t.id)}
                            title="Unassign" style={{background:"none",border:"none",cursor:"pointer",
                              fontSize:11,color:"#9A4040",opacity:.6,padding:"2px 4px"}}>×</button>
                        </div>
                      );
                    }))}
                  </>
                )}
              </div>
            )}

            {/* ── Tables panel ── */}
            {panel==="tables" && (
              <div style={{flex:1,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:8}}>
                {/* Add table */}
                <div style={{...card,padding:"14px 14px 16px"}}>
                  <p style={{fontSize:8,letterSpacing:".26em",textTransform:"uppercase",
                    color:"#C9A96E",marginBottom:10}}>Add Table</p>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <input value={newTableName} onChange={e=>setNewTableName(e.target.value)}
                      placeholder="Table name (optional)" style={{...inp,width:"100%"}}/>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <input type="number" min={2} max={20} value={newTableSeats}
                        onChange={e=>setNewTableSeats(e.target.value)}
                        style={{...inp,width:64}} placeholder="Seats"/>
                      <span style={{fontSize:10,color:"#8B6914",opacity:.6}}>seats</span>
                    </div>
                    <button onClick={addTable}
                      style={{padding:"8px",fontFamily:"inherit",fontSize:9,letterSpacing:".22em",
                        textTransform:"uppercase",cursor:"pointer",borderRadius:1,border:"none",
                        background:"linear-gradient(135deg,#C9A96E,#8B6914)",color:"#FAF6F0"}}>
                      + Add Table
                    </button>
                  </div>
                </div>

                {/* Table list */}
                {tables.map((t: Table) => {
                  const used=seatsUsed(t.id), left=t.seats-used, pct=Math.round(used/t.seats*100);
                  return (
                    <div key={t.id} style={{...card,padding:"12px 14px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div>
                          <p style={{fontSize:12,fontWeight:500,color:"#1C1C1C"}}>{t.name}</p>
                          <p style={{fontSize:9,color:"#8B6914",opacity:.6}}>
                            {used}/{t.seats} seats · {left} left
                          </p>
                        </div>
                        <button onClick={()=>removeTable(t.id)}
                          style={{background:"none",border:"none",cursor:"pointer",
                            fontSize:13,color:"#9A4040",opacity:.5,padding:"0 2px"}}>×</button>
                      </div>
                      {/* progress bar */}
                      <div style={{height:3,background:"rgba(201,169,110,0.15)",borderRadius:2,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",borderRadius:2,
                          background:pct>=100?"#9A4040":"linear-gradient(to right,#C9A96E,#8B6914)",
                          transition:"width .3s"}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>

          {/* ── Canvas ── */}
          <div
            ref={canvasRef}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={onCanvasPointerUp}
            onPointerLeave={onCanvasPointerUp}
            style={{
              flex:1, position:"relative", overflow:"hidden",
              backgroundImage:`
                radial-gradient(circle,rgba(201,169,110,0.12) 1px,transparent 1px)`,
              backgroundSize:"32px 32px",
              backgroundPosition:"16px 16px",
            }}>

            {/* Subtle venue label */}
            <p style={{position:"absolute",bottom:20,right:24,letterSpacing:".3em",
              textTransform:"uppercase",color:"rgba(201,169,110,0.35)",pointerEvents:"none",
              fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"0.9rem"}}>
              Villa La Signoria · Banquet Hall
            </p>

            {/* ── Tables ── */}
            {tables.map((t: Table) => {
              const used   = seatsUsed(t.id);
              const left   = t.seats - used;
              const pct    = used / t.seats;
              const isHover= dropHint===t.id;
              const isFull = left <= 0;
              const gids   = assign[t.id]||[];
              // table visual size based on seats
              const size = Math.max(130, Math.min(220, 90 + t.seats*9));

              return (
                <div
                  key={t.id}
                  data-tableid={t.id}
                  className="table-node"
                  onPointerDown={e=>onTableDragStart(e,t.id)}
                  style={{
                    position:"absolute", left:t.x, top:t.y,
                    width:size, zIndex:10,
                    transition:"box-shadow .2s",
                  }}>
                  {/* Table circle */}
                  <div style={{
                    width:size, height:size, borderRadius:"50%",
                    background: isHover
                      ? isFull
                        ? "radial-gradient(circle,rgba(154,64,64,0.15),rgba(245,237,224,0.9))"
                        : "radial-gradient(circle,rgba(201,169,110,0.22),rgba(245,237,224,0.9))"
                      : "radial-gradient(circle,rgba(253,248,242,0.98),rgba(245,237,224,0.88))",
                    border: isHover
                      ? isFull ? "2px solid rgba(154,64,64,0.5)" : "2px solid rgba(201,169,110,0.7)"
                      : "1px solid rgba(201,169,110,0.3)",
                    boxShadow: isHover
                      ? "0 4px 24px rgba(201,169,110,0.3)"
                      : "0 2px 14px rgba(139,105,20,0.1),inset 0 1px 0 rgba(255,255,255,0.9)",
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    padding:"16px 12px",transition:"all .2s",position:"relative",overflow:"hidden",
                  }}>
                    {/* ghost number */}
                    <span style={{
                      position:"absolute",fontFamily:"'Cormorant Garamond',serif",
                      fontSize:"4.5rem",fontWeight:300,color:"rgba(201,169,110,0.07)",
                      lineHeight:1,pointerEvents:"none",userSelect:"none",top:"10%",
                    }}>
                      {t.id.replace(/\D/g,"").slice(-1)||"·"}
                    </span>

                    {/* Seat ring indicator */}
                    <svg width={size-20} height={size-20} style={{position:"absolute",top:10,left:10,pointerEvents:"none"}}>
                      <circle cx={(size-20)/2} cy={(size-20)/2} r={(size-20)/2-4}
                        fill="none" stroke="rgba(201,169,110,0.12)" strokeWidth="2"/>
                      <circle cx={(size-20)/2} cy={(size-20)/2} r={(size-20)/2-4}
                        fill="none"
                        stroke={pct>=1?"rgba(154,64,64,0.5)":"rgba(201,169,110,0.5)"}
                        strokeWidth="2.5"
                        strokeDasharray={`${pct*Math.PI*(size-28)} ${Math.PI*(size-28)}`}
                        strokeDashoffset={0}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${(size-20)/2} ${(size-20)/2})`}
                        style={{transition:"stroke-dasharray .4s ease"}}/>
                    </svg>

                    {/* Table name */}
                    <p style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",
                      color:"#8B6914",opacity:.75,marginBottom:2,textAlign:"center",
                      position:"relative",zIndex:1}}>{t.name}</p>

                    {/* Capacity */}
                    <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",
                      fontWeight:300,color:pct>=1?"#9A4040":"#C9A96E",lineHeight:1,
                      position:"relative",zIndex:1}}>
                      {used}<span style={{fontSize:".9rem",opacity:.5}}>/{t.seats}</span>
                    </p>

                    {/* Guest chips inside table */}
                    <div style={{display:"flex",flexWrap:"wrap",gap:3,justifyContent:"center",
                      maxWidth:size-28,marginTop:8,position:"relative",zIndex:2}}>
                      {gids.map(gid=>{
                        const g=guestMap[gid]; if(!g) return null;
                        return (
                          <div key={gid} className="guest-chip" data-guest={gid}
                            onPointerDown={e=>{e.stopPropagation();onGuestDragStart(e,gid,t.id);}}
                            title={`${g.name} · ${g.passes} pass`}
                            style={{
                              padding:"2px 6px",borderRadius:10,fontSize:9,
                              background:`${g.color}22`,border:`1px solid ${g.color}45`,
                              color:g.color,whiteSpace:"nowrap",maxWidth:size-36,
                              overflow:"hidden",textOverflow:"ellipsis",
                              lineHeight:1.6,
                            }}>
                            {g.name.split(" ")[0]}
                            <span style={{opacity:.6,marginLeft:3}}>{g.passes}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Table label below */}
                  <div style={{textAlign:"center",marginTop:6}}>
                    <p style={{fontSize:9,letterSpacing:".15em",color:"#8B6914",opacity:.55}}>
                      {left} seat{left!==1?"s":""} available
                    </p>
                  </div>
                </div>
              );
            })}

            {/* ── Drag ghost ── */}
            {drag.current && dragPos && (()=>{
              const g = guestMap[drag.current.id]; if(!g) return null;
              return (
                <div style={{
                  position:"fixed",left:dragPos.x-40,top:dragPos.y-18,
                  zIndex:9999,pointerEvents:"none",
                  padding:"6px 12px",borderRadius:1,
                  background:`linear-gradient(120deg,${g.color}dd,${g.color}aa)`,
                  color:"#FAF6F0",fontSize:11,fontWeight:500,
                  boxShadow:"0 6px 20px rgba(0,0,0,0.2)",
                  border:`1px solid ${g.color}`,
                  opacity:.92,
                }}>
                  {g.name} · {g.passes}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Unsaved-changes navigation warning ── */}
      {navWarning && (
        <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"center",
          justifyContent:"center",background:"rgba(28,18,4,0.55)",backdropFilter:"blur(6px)"}}>
          <div style={{
            position:"relative",width:400,
            background:"linear-gradient(160deg,rgba(253,248,242,0.99),rgba(245,237,224,0.97))",
            border:"1px solid rgba(201,169,110,0.35)",borderRadius:2,padding:"36px 32px",
            boxShadow:"0 24px 64px rgba(139,105,20,0.28),inset 0 1px 0 rgba(255,255,255,0.9)",
          }}>
            {["tl","tr","bl","br"].map(c=>(
              <span key={c} style={{position:"absolute",
                top:c[0]==="t"?6:undefined,bottom:c[0]==="b"?6:undefined,
                left:c[1]==="l"?6:undefined,right:c[1]==="r"?6:undefined,
                width:8,height:8,
                borderTop:   c[0]==="t"?"1px solid rgba(201,169,110,0.4)":undefined,
                borderBottom:c[0]==="b"?"1px solid rgba(201,169,110,0.4)":undefined,
                borderLeft:  c[1]==="l"?"1px solid rgba(201,169,110,0.4)":undefined,
                borderRight: c[1]==="r"?"1px solid rgba(201,169,110,0.4)":undefined,
              }}/>
            ))}

            {/* Warning icon */}
            <div style={{textAlign:"center",marginBottom:16}}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{margin:"0 auto"}}>
                <path d="M18 3 L33 30 H3 Z" stroke="#C9A96E" strokeWidth="1.4" fill="rgba(201,169,110,0.08)" strokeLinejoin="round"/>
                <line x1="18" y1="14" x2="18" y2="22" stroke="#C9A96E" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="18" cy="26" r="1.2" fill="#C9A96E"/>
              </svg>
            </div>

            <p style={{fontSize:9,letterSpacing:".28em",textTransform:"uppercase",
              color:"#C9A96E",textAlign:"center",marginBottom:8}}>Unsaved Changes</p>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:400,
              color:"#2C2C2C",textAlign:"center",marginBottom:10}}>
              Leave without saving?
            </h3>
            <p style={{fontSize:12,color:"#5C4A2A",textAlign:"center",lineHeight:1.7,
              marginBottom:24,opacity:.8}}>
              Your seating arrangement has unsaved changes.
              They are preserved in your browser, but will not
              be written to the database until you save.
            </p>

            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setNavWarning(false)}
                style={{flex:1,padding:"10px",fontFamily:"inherit",fontSize:9,letterSpacing:".2em",
                  textTransform:"uppercase",cursor:"pointer",borderRadius:1,
                  background:"transparent",color:"#8B6914",
                  border:"1px solid rgba(201,169,110,0.35)"}}>
                Stay &amp; Save
              </button>
              <button onClick={async ()=>{
                  setNavWarning(false);
                  await saveToDatabase();
                  if (pendingNav.current) window.location.href = pendingNav.current;
                }}
                style={{flex:1,padding:"10px",fontFamily:"inherit",fontSize:9,letterSpacing:".2em",
                  textTransform:"uppercase",cursor:"pointer",borderRadius:1,border:"none",
                  background:"linear-gradient(135deg,#C9A96E,#8B6914)",color:"#FAF6F0",
                  boxShadow:"0 4px 14px rgba(139,105,20,0.22)"}}>
                Save &amp; Leave
              </button>
              <button onClick={()=>{
                  setNavWarning(false);
                  setIsDirty(false);
                  if (pendingNav.current) window.location.href = pendingNav.current;
                }}
                style={{flex:1,padding:"10px",fontFamily:"inherit",fontSize:9,letterSpacing:".2em",
                  textTransform:"uppercase",cursor:"pointer",borderRadius:1,
                  background:"rgba(154,48,48,0.07)",color:"#943030",
                  border:"1px solid rgba(154,48,48,0.22)"}}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Split modal ── */}
      {splitModal && (()=>{
        const guest = guestMap[splitModal.guestId];
        if(!guest) return null;
        const last = lastName(guest.name);
        return (
          <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",
            justifyContent:"center",background:"rgba(44,28,8,0.45)",backdropFilter:"blur(4px)"}}>
            <div style={{
              position:"relative",width:380,
              background:"linear-gradient(160deg,rgba(253,248,242,0.99),rgba(245,237,224,0.97))",
              border:"1px solid rgba(201,169,110,0.35)",borderRadius:2,
              boxShadow:"0 20px 60px rgba(139,105,20,0.25),inset 0 1px 0 rgba(255,255,255,0.9)",
              padding:"36px 32px",
            }}>
              {["tl","tr","bl","br"].map(c=>(
                <span key={c} style={{position:"absolute",
                  top:c[0]==="t"?6:undefined,bottom:c[0]==="b"?6:undefined,
                  left:c[1]==="l"?6:undefined,right:c[1]==="r"?6:undefined,
                  width:8,height:8,
                  borderTop:   c[0]==="t"?"1px solid rgba(201,169,110,0.4)":undefined,
                  borderBottom:c[0]==="b"?"1px solid rgba(201,169,110,0.4)":undefined,
                  borderLeft:  c[1]==="l"?"1px solid rgba(201,169,110,0.4)":undefined,
                  borderRight: c[1]==="r"?"1px solid rgba(201,169,110,0.4)":undefined,
                }}/>
              ))}

              {/* ornament */}
              <div style={{textAlign:"center",marginBottom:20}}>
                <svg width="28" height="18" viewBox="0 0 36 22" fill="none" style={{margin:"0 auto"}}>
                  <circle cx="13" cy="11" r="9" stroke="#C9A96E" strokeWidth="1.2" fill="none"/>
                  <circle cx="23" cy="11" r="9" stroke="#C9A96E" strokeWidth="1.2" fill="rgba(201,169,110,0.06)"/>
                </svg>
              </div>

              <p style={{fontSize:9,letterSpacing:".28em",textTransform:"uppercase",
                color:"#C9A96E",textAlign:"center",marginBottom:8}}>Split Invitation</p>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:400,
                color:"#2C2C2C",textAlign:"center",marginBottom:6}}>
                {guest.name}
              </h3>
              <p style={{fontSize:12,color:"#5C4A2A",textAlign:"center",lineHeight:1.6,
                marginBottom:20,opacity:.8}}>
                <strong>{guest.passes}</strong> passes requested, but only{" "}
                <strong>{splitModal.available}</strong> seat{splitModal.available!==1?"s":""} available at{" "}
                <strong>{tableMap[splitModal.tableId]?.name}</strong>.
              </p>

              <div style={{background:"rgba(201,169,110,0.06)",border:"1px solid rgba(201,169,110,0.2)",
                borderRadius:1,padding:"14px 16px",marginBottom:20}}>
                <p style={{fontSize:11,color:"#8B6914",lineHeight:1.8}}>
                  This will create two entries:<br/>
                  <strong>"{last} 1"</strong> → {splitModal.available} pass{splitModal.available!==1?"es":""} at {tableMap[splitModal.tableId]?.name}<br/>
                  <strong>"{last} 2"</strong> → {guest.passes-splitModal.available} pass{(guest.passes-splitModal.available)!==1?"es":""} → unassigned
                </p>
              </div>

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setSplitModal(null)}
                  style={{flex:1,padding:"10px",fontFamily:"inherit",fontSize:9,letterSpacing:".2em",
                    textTransform:"uppercase",cursor:"pointer",borderRadius:1,
                    background:"transparent",color:"#8B6914",
                    border:"1px solid rgba(201,169,110,0.35)"}}>
                  Cancel
                </button>
                <button onClick={doSplit}
                  style={{flex:2,padding:"10px",fontFamily:"inherit",fontSize:9,letterSpacing:".2em",
                    textTransform:"uppercase",cursor:"pointer",borderRadius:1,border:"none",
                    background:"linear-gradient(135deg,#C9A96E,#8B6914)",color:"#FAF6F0",
                    boxShadow:"0 4px 14px rgba(139,105,20,0.22)"}}>
                  Split &amp; Place
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}