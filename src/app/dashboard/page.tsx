'use client'
import { useState, useMemo, useEffect, type CSSProperties } from "react";

// ─── types ────────────────────────────────────────────────────
type GuestStatus = "confirmed" | "pending" | "declined";

type Guest = {
  id: string;
  name: string;
  passes: number;
  status: GuestStatus;
  token: string;
  phone: string;
  email: string;
  createdAt: string;
};

// ─── seed data ────────────────────────────────────────────────
const SEED_GUESTS: Guest[] = [
  { id:"1",  name:"Elena Moretti",      passes:2, status:"confirmed", token:"tok_elena",   phone:"393331234001", email:"elena@example.com",  createdAt:"2026-01-10" },
  { id:"2",  name:"Luca Bianchi",       passes:1, status:"pending",   token:"tok_luca",    phone:"393331234002", email:"",                   createdAt:"2026-01-12" },
  { id:"3",  name:"Giulia Ferrara",     passes:4, status:"confirmed", token:"tok_giulia",  phone:"393331234003", email:"giulia@example.com", createdAt:"2026-01-14" },
  { id:"4",  name:"Marco Conti",        passes:2, status:"declined",  token:"tok_marco",   phone:"393331234004", email:"",                   createdAt:"2026-01-15" },
  { id:"5",  name:"Sofia Ricci",        passes:3, status:"pending",   token:"tok_sofia",   phone:"393331234005", email:"sofia@example.com",  createdAt:"2026-01-16" },
  { id:"6",  name:"Pietro Romano",      passes:2, status:"confirmed", token:"tok_pietro",  phone:"393331234006", email:"",                   createdAt:"2026-01-18" },
  { id:"7",  name:"Valentina Esposito", passes:1, status:"pending",   token:"tok_vale",    phone:"393331234007", email:"vale@example.com",   createdAt:"2026-01-19" },
  { id:"8",  name:"Andrea Colombo",     passes:2, status:"confirmed", token:"tok_andrea",  phone:"393331234008", email:"",                   createdAt:"2026-01-20" },
  { id:"9",  name:"Chiara De Luca",     passes:2, status:"declined",  token:"tok_chiara",  phone:"393331234009", email:"chiara@example.com", createdAt:"2026-01-21" },
  { id:"10", name:"Roberto Mancini",    passes:3, status:"pending",   token:"tok_roberto", phone:"393331234010", email:"",                   createdAt:"2026-01-22" },
];

const BASE_URL = "https://wed-vitation.vercel.app";
const mkLink   = (token: string) => `${BASE_URL}/?token=${token}`;
const genToken = () => "tok_" + Math.random().toString(36).slice(2,10);

function buildWAMessage(tpl: string, guest: Guest, link: string) {
  return tpl
    .replace(/{name}/g,   guest.name)
    .replace(/{passes}/g, String(guest.passes))
    .replace(/{link}/g,   link);
}

// ─── Icons ────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="#C9A96E" strokeWidth="1.3"/>
    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#C9A96E" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconWA = ({size=13}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconCopy = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M3 11V3a1 1 0 011-1h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// ─── Tiny components ──────────────────────────────────────────
const Badge = ({ status }: { status: GuestStatus }) => {
  const MAP: Record<GuestStatus, { label: string; bg: string; color: string; bd: string }> = {
    confirmed: { label:"Confirmed", bg:"rgba(74,122,68,0.1)",    color:"#3A6A34", bd:"rgba(74,122,68,0.28)"   },
    pending:   { label:"Pending",   bg:"rgba(201,169,110,0.13)", color:"#8B6914", bd:"rgba(201,169,110,0.35)" },
    declined:  { label:"Declined",  bg:"rgba(160,60,60,0.1)",    color:"#943030", bd:"rgba(154,48,48,0.28)"   },
  };
  const c = MAP[status];
  return (
    <span style={{padding:"2px 8px",fontSize:9,letterSpacing:"0.16em",textTransform:"uppercase",
      background:c.bg,color:c.color,border:`1px solid ${c.bd}`,borderRadius:2,whiteSpace:"nowrap"}}>
      {c.label}
    </span>
  );
};

const CopyBtn = ({ text, full=false }: { text: string; full?: boolean }) => {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={()=>{navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),1800);}}
      style={{display:"inline-flex",alignItems:"center",gap:4,
        padding: full ? "7px 12px" : "4px 8px",
        fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",cursor:"pointer",
        borderRadius:1,whiteSpace:"nowrap",transition:"all .2s",fontFamily:"inherit",
        width: full ? "100%" : undefined, justifyContent: full ? "center" : undefined,
        background: ok?"rgba(74,122,68,0.12)":"rgba(201,169,110,0.08)",
        color: ok?"#3A6A34":"#8B6914",
        border:`1px solid ${ok?"rgba(74,122,68,0.28)":"rgba(201,169,110,0.25)"}`}}>
      {ok ? "✓ Copied" : <><IconCopy/> Copy Link</>}
    </button>
  );
};

const WAButton = ({
  onClick,
  label,
  full=false,
}: {
  onClick: () => void | Promise<void>;
  label: string;
  full?: boolean;
}) => {
  const [state, setState] = useState("idle");
  const handleClick = async () => {
    setState("copied");
    await onClick();
    setTimeout(() => setState("opening"), 600);
    setTimeout(() => setState("idle"), 2000);
  };
  return (
    <button onClick={handleClick}
      style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:6,
        padding:"7px 12px", fontSize:9, letterSpacing:"0.13em", textTransform:"uppercase",
        cursor:"pointer", borderRadius:1, fontFamily:"inherit", border:"none",
        width: full ? "100%" : undefined,
        background: state==="idle" ? "rgba(42,122,42,0.08)" : "rgba(42,122,42,0.18)",
        color:"#2A6A24", outline:"1px solid rgba(42,122,42,0.22)"}}>
      <IconWA/>
      {state==="idle"    ? label      : ""}
      {state==="copied"  ? "Copied ✓" : ""}
      {state==="opening" ? "Opening…" : ""}
    </button>
  );
};

const Corners = () => ["tl","tr","bl","br"].map(c => (
  <span key={c} style={{position:"absolute",
    top:    c[0]==="t"?5:undefined, bottom: c[0]==="b"?5:undefined,
    left:   c[1]==="l"?5:undefined, right:  c[1]==="r"?5:undefined,
    width:7, height:7,
    borderTop:    c[0]==="t"?"1px solid rgba(201,169,110,0.36)":undefined,
    borderBottom: c[0]==="b"?"1px solid rgba(201,169,110,0.36)":undefined,
    borderLeft:   c[1]==="l"?"1px solid rgba(201,169,110,0.36)":undefined,
    borderRight:  c[1]==="r"?"1px solid rgba(201,169,110,0.36)":undefined,
  }}/>
));

// ─── useIsMobile hook ─────────────────────────────────────────
function useIsMobile(bp=640) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < bp);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [bp]);
  return mobile;
}

// ─── Guest Card (mobile) ──────────────────────────────────────
const GuestCard = ({
  g,
  onWA,
  onRemove,
  card,
}: {
  g: Guest;
  onWA: (guest: Guest) => void | Promise<void>;
  onRemove: (id: string) => void;
  card: CSSProperties;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{...card, padding:"14px 16px", marginBottom:8}}>
      <Corners/>
      {/* Top row: name + badge + chevron */}
      <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}
        onClick={()=>setExpanded(e=>!e)}>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontWeight:500,fontSize:13,color:"#1C1C1C",
            whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {g.name}
          </p>
          {g.email && <p style={{fontSize:10,color:"#8B6914",opacity:0.6,marginTop:1}}>{g.email}</p>}
        </div>
        <Badge status={g.status}/>
        {/* passes bubble */}
        <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
          width:26,height:26,borderRadius:"50%",flexShrink:0,
          background:"rgba(201,169,110,0.12)",border:"1px solid rgba(201,169,110,0.3)",
          fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"#8B6914"}}>
          {g.passes}
        </span>
        {/* chevron */}
        <svg width="10" height="10" viewBox="0 0 10 10" style={{
          flexShrink:0, transition:"transform .2s",
          transform: expanded?"rotate(180deg)":"rotate(0deg)"}}>
          <polyline points="1,3 5,7 9,3" fill="none" stroke="#C9A96E" strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Expanded: link + actions */}
      {expanded && (
        <div style={{marginTop:12,paddingTop:12,
          borderTop:"1px solid rgba(201,169,110,0.15)"}}>
          <p style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",
            color:"#8B6914",opacity:0.5,marginBottom:5}}>Invitation Link</p>
          <code style={{display:"block",fontSize:10,color:"#5C4A2A",opacity:0.65,
            wordBreak:"break-all",lineHeight:1.5,marginBottom:10}}>
            {mkLink(g.token)}
          </code>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <CopyBtn text={mkLink(g.token)} full />
            <WAButton onClick={()=>onWA(g)} label="WhatsApp" full />
          </div>
          <button onClick={()=>onRemove(g.id)}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,
              width:"100%",marginTop:6,padding:"7px 12px",fontSize:9,
              letterSpacing:"0.13em",textTransform:"uppercase",cursor:"pointer",
              borderRadius:1,fontFamily:"inherit",
              background:"rgba(160,50,50,0.06)",color:"#943030",
              border:"1px solid rgba(148,48,48,0.2)"}}>
            <IconTrash/> Remove
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────
export default function Dashboard() {
  const isMobile = useIsMobile();
  const [guests, setGuests]   = useState(SEED_GUESTS);
  const [tab,    setTab]      = useState("guests");
  const [search, setSearch]   = useState("");
  const [statusF,setStatusF]  = useState("all");
  const [waTpl,  setWaTpl]    = useState(
`Hola {name} 🌸

Con mucha alegría te invitamos a nuestra boda.
Tienes {passes} pase(s) reservados en tu honor.

📅 15 de junio de 2026
📍 Toscana, Italia

Confirma tu asistencia aquí:
{link}

— Sofia & Marco 💛`
  );
  const [nf,  setNf]  = useState({ name:"", phone:"", email:"", passes:"1" });
  const [msg, setMsg] = useState("");

  const st = useMemo(() => {
    const conf = guests.filter(g=>g.status==="confirmed");
    return {
      total:      guests.length,
      passes:     guests.reduce((a,g)=>a+g.passes,0),
      confirmed:  conf.length,
      confPasses: conf.reduce((a,g)=>a+g.passes,0),
      pending:    guests.filter(g=>g.status==="pending").length,
      declined:   guests.filter(g=>g.status==="declined").length,
    };
  }, [guests]);

  const list = useMemo(() => guests.filter((g: Guest) => {
    const q = search.toLowerCase();
    return (g.name.toLowerCase().includes(q) || g.token.includes(q) || g.email.toLowerCase().includes(q))
      && (statusF==="all" || g.status===statusF);
  }), [guests, search, statusF]);

  const handleWA = async (g: Guest) => {
    const message = buildWAMessage(waTpl, g, mkLink(g.token));
    try { await navigator.clipboard.writeText(message); } catch {}
    window.open(`https://wa.me/${g.phone}`, "_blank", "noopener,noreferrer");
  };

  const createGuest = () => {
    if (!nf.name.trim()||!nf.phone.trim()) { setMsg("Name and phone are required."); return; }
    const g: Guest = {
      id: String(Date.now()),
      name: nf.name.trim(),
      passes: Math.max(1, parseInt(nf.passes) || 1),
      status: "pending",
      token: genToken(),
      phone: nf.phone.replace(/\D/g, ""),
      email: nf.email.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setGuests(gs=>[g,...gs]);
    setNf({name:"",phone:"",email:"",passes:"1"});
    setMsg(`✓ Invitation created for ${g.name}`);
    setTimeout(()=>setMsg(""),3000);
    setTab("guests");
  };

  const removeGuest = (id: string) => {
    if(window.confirm("Remove this guest?")) setGuests(gs=>gs.filter(g=>g.id!==id));
  };

  // ── Shared styles ──────────────────────────────────────────
  const card: CSSProperties = { position:"relative",
    background:"linear-gradient(160deg,rgba(253,248,242,0.97),rgba(245,237,224,0.88))",
    border:"1px solid rgba(201,169,110,0.24)", borderRadius:2, overflow:"hidden",
    boxShadow:"0 2px 20px rgba(139,105,20,0.07),inset 0 1px 0 rgba(255,255,255,0.8)" };

  const inp: CSSProperties = { width:"100%", padding:"10px 13px", fontFamily:"inherit", fontSize:13,
    color:"#2C2C2C", background:"rgba(201,169,110,0.05)", borderRadius:1, outline:"none",
    border:"1px solid rgba(201,169,110,0.26)", lineHeight:1.5 };

  const lbl: CSSProperties = { display:"block", fontSize:9, letterSpacing:"0.26em", textTransform:"uppercase",
    color:"#8B6914", marginBottom:6 };

  const goldBtn: CSSProperties = { width:"100%", padding:"12px 22px", fontFamily:"inherit", fontSize:9,
    letterSpacing:"0.24em", textTransform:"uppercase", cursor:"pointer", borderRadius:1,
    border:"none", background:"linear-gradient(135deg,#C9A96E,#8B6914)", color:"#FAF6F0",
    boxShadow:"0 4px 14px rgba(139,105,20,0.22)" };

  const TABS = [
    { key:"guests",   label: isMobile ? "Guests"   : "Guest List"        },
    { key:"create",   label: isMobile ? "New"      : "New Invitation"    },
    { key:"template", label: isMobile ? "Template" : "WhatsApp Template" },
  ];

  const FILTERS = [
    { key:"all",       label:"All",       count: guests.length   },
    { key:"confirmed", label:"Confirmed", count: st.confirmed    },
    { key:"pending",   label:"Pending",   count: st.pending      },
    { key:"declined",  label:"Declined",  count: st.declined     },
  ];

  const px = isMobile ? "16px" : "32px";
  const mainPad = isMobile ? "20px 16px 100px" : "36px 32px 80px";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Jost',sans-serif;background:#F3EBE0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#F3EBE0}
        ::-webkit-scrollbar-thumb{background:rgba(201,169,110,0.38);border-radius:3px}
        input:focus,textarea:focus{border-color:rgba(201,169,110,0.6)!important;outline:none}
        .gt{width:100%;border-collapse:collapse}
        .gt th{font-family:'Jost',sans-serif;font-size:9px;letter-spacing:.26em;text-transform:uppercase;
          color:#8B6914;font-weight:400;padding:10px 16px;text-align:left;
          border-bottom:1px solid rgba(201,169,110,0.18);white-space:nowrap}
        .gt td{font-size:12px;color:#2C2C2C;padding:11px 16px;
          border-bottom:1px solid rgba(201,169,110,0.09);vertical-align:middle}
        .gt tr:last-child td{border-bottom:none}
        .gt tbody tr:hover td{background:rgba(201,169,110,0.04)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .fade-up{animation:fadeUp .35s ease both}
      `}</style>

      <div style={{minHeight:"100vh",fontFamily:"'Jost',sans-serif",
        background:"linear-gradient(155deg,#FAF6F0 0%,#F0E4CA 55%,#EDD9B8 100%)"}}>

        {/* ── Header ───────────────────────────────────────── */}
        <header style={{borderBottom:"1px solid rgba(201,169,110,0.18)",
          background:"rgba(253,249,244,0.94)",backdropFilter:"blur(10px)",
          position:"sticky",top:0,zIndex:50,padding:`0 ${px}`}}>
          <div style={{maxWidth:1140,margin:"0 auto",display:"flex",
            alignItems:"center",justifyContent:"space-between",height:52}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <svg width="22" height="14" viewBox="0 0 32 20" fill="none">
                <circle cx="11" cy="10" r="8.5" stroke="#C9A96E" strokeWidth="1.3" fill="none"/>
                <circle cx="21" cy="10" r="8.5" stroke="#C9A96E" strokeWidth="1.3" fill="rgba(201,169,110,0.08)"/>
              </svg>
              <span style={{fontFamily:"'Cormorant Garamond',serif",
                fontSize: isMobile ? "1rem" : "1.2rem",
                fontWeight:400,color:"#2C2C2C",letterSpacing:"0.04em"}}>
                Sofia &amp; Marco
              </span>
              {!isMobile && <>
                <span style={{width:1,height:18,background:"rgba(201,169,110,0.38)",display:"inline-block"}}/>
                <span style={{fontSize:9,letterSpacing:"0.3em",textTransform:"uppercase",
                  color:"#8B6914",opacity:0.65}}>Wedding Dashboard</span>
              </>}
              <a href="/seating" style={{
                fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
                color: "#8B6914", textDecoration: "none", opacity: 0.5,
                border: "1px solid rgba(201,169,110,0.3)", padding: "5px 12px", borderRadius: 1
              }}>
                Seating
              </a>
            </div>

            <a href="/" style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",
              color:"#8B6914",textDecoration:"none",opacity:0.55,
              border:"1px solid rgba(201,169,110,0.3)",padding:"5px 10px",borderRadius:1}}>
              ← {isMobile ? "Back" : "Invitation"}
            </a>
          </div>
        </header>

        <main style={{maxWidth:1140,margin:"0 auto",padding:mainPad}}>

          {/* ── Stats grid ─────────────────────────────────── */}
          <div className="fade-up" style={{
            display:"grid",
            gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(5,1fr)",
            gap: isMobile ? 8 : 12,
            marginBottom: isMobile ? 20 : 32}}>
            {[
              {label:"Sent",      value:st.total,     sub:"guests",    full:"Invitations Sent"},
              {label:"Passes",    value:st.passes,    sub:"seats",     full:"Passes Reserved"},
              {label:"Confirmed", value:st.confirmed, sub:`${st.confPasses} seats`, full:"Confirmed"},
              {label:"Pending",   value:st.pending,   sub:"awaiting",  full:"Pending Reply"},
              {label:"Declined",  value:st.declined,  sub:"regrets",   full:"Declined"},
            ].map(({label,value,sub,full},i)=>(
              <div key={label} className="fade-up" style={{...card,
                padding: isMobile ? "12px 10px 10px" : "20px 18px 16px",
                animationDelay:`${i*60}ms`}}>
                <Corners/>
                <p style={{fontSize: isMobile ? 8 : 9,
                  letterSpacing:"0.2em",textTransform:"uppercase",
                  color:"#8B6914",opacity:0.65,marginBottom:6,
                  whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                  {isMobile ? label : full}
                </p>
                <p style={{fontFamily:"'Cormorant Garamond',serif",
                  fontSize: isMobile ? "1.8rem" : "2.6rem",
                  fontWeight:300,lineHeight:1,color:"#C9A96E",marginBottom:4}}>{value}</p>
                <p style={{fontSize: isMobile ? 9 : 10,color:"#8B6914",opacity:0.5}}>{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Tabs ───────────────────────────────────────── */}
          <div style={{display:"flex",gap:0,
            borderBottom:"1px solid rgba(201,169,110,0.18)",marginBottom: isMobile ? 16 : 24}}>
            {TABS.map(({key,label})=>(
              <button key={key} onClick={()=>setTab(key)}
                style={{padding: isMobile ? "10px 0" : "10px 22px",
                  flex: isMobile ? 1 : undefined,
                  cursor:"pointer",fontFamily:"inherit",
                  fontSize: isMobile ? 10 : 9,
                  letterSpacing: isMobile ? "0.1em" : "0.24em",
                  textTransform:"uppercase",background:"none",border:"none",
                  marginBottom:-1,transition:"color .2s",
                  color:tab===key?"#8B6914":"rgba(139,105,20,0.4)",
                  borderBottom:tab===key?"2px solid #C9A96E":"2px solid transparent"}}>
                {label}
              </button>
            ))}
          </div>

          {/* ══ GUEST LIST ════════════════════════════════════ */}
          {tab==="guests" && (
            <div className="fade-up">
              {/* Search */}
              <div style={{position:"relative",marginBottom:10}}>
                <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",
                  pointerEvents:"none",display:"flex"}}>
                  <IconSearch/>
                </span>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search name, email or token…"
                  style={{...inp,paddingLeft:32,fontSize:12}}/>
              </div>

              {/* Filter pills — scrollable on mobile */}
              <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
                {FILTERS.map(({key,label,count})=>(
                  <button key={key} onClick={()=>setStatusF(key)}
                    style={{padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",
                      fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",
                      borderRadius:1,transition:"all .15s",flexShrink:0,
                      background:statusF===key?"linear-gradient(135deg,#C9A96E,#8B6914)":"rgba(201,169,110,0.07)",
                      color:statusF===key?"#FAF6F0":"#8B6914",
                      border:statusF===key?"1px solid transparent":"1px solid rgba(201,169,110,0.26)"}}>
                    {label} <span style={{opacity:0.7}}>{count}</span>
                  </button>
                ))}
              </div>

              {/* Mobile: cards / Desktop: table */}
              {isMobile ? (
                <div>
                  {list.length===0 && (
                    <p style={{textAlign:"center",padding:"40px 0",opacity:0.4,fontStyle:"italic"}}>
                      No guests match the current filter.
                    </p>
                  )}
                  {list.map(g=>(
                    <GuestCard key={g.id} g={g} onWA={handleWA} onRemove={removeGuest} card={card}/>
                  ))}
                </div>
              ) : (
                <div style={{...card,overflowX:"auto"}}>
                  <Corners/>
                  <table className="gt">
                    <thead>
                      <tr>
                        <th>Guest</th><th>Passes</th><th>Status</th>
                        <th>Invitation Link</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.length===0 && (
                        <tr><td colSpan={5} style={{textAlign:"center",padding:40,opacity:0.4,fontStyle:"italic"}}>
                          No guests match the current filter.
                        </td></tr>
                      )}
                      {list.map(g=>(
                        <tr key={g.id}>
                          <td>
                            <p style={{fontWeight:500,marginBottom:2,color:"#1C1C1C"}}>{g.name}</p>
                            {g.email && <p style={{fontSize:10,color:"#8B6914",opacity:0.6}}>{g.email}</p>}
                            <p style={{fontSize:9,color:"#8B6914",opacity:0.38,letterSpacing:"0.08em"}}>
                              Added {g.createdAt}
                            </p>
                          </td>
                          <td>
                            <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
                              width:30,height:30,borderRadius:"50%",
                              background:"rgba(201,169,110,0.12)",border:"1px solid rgba(201,169,110,0.3)",
                              fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"#8B6914"}}>
                              {g.passes}
                            </span>
                          </td>
                          <td><Badge status={g.status}/></td>
                          <td>
                            <div style={{display:"flex",flexDirection:"column",gap:5}}>
                              <code style={{fontSize:10,color:"#5C4A2A",opacity:0.6,
                                wordBreak:"break-all",lineHeight:1.4}}>
                                {mkLink(g.token)}
                              </code>
                              <CopyBtn text={mkLink(g.token)}/>
                            </div>
                          </td>
                          <td>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                              <WAButton onClick={()=>handleWA(g)} label="WhatsApp"/>
                              <button onClick={()=>removeGuest(g.id)}
                                style={{display:"inline-flex",alignItems:"center",gap:4,
                                  padding:"7px 10px",fontSize:9,letterSpacing:"0.13em",
                                  textTransform:"uppercase",cursor:"pointer",borderRadius:1,
                                  fontFamily:"inherit",background:"rgba(160,50,50,0.07)",
                                  color:"#943030",border:"1px solid rgba(148,48,48,0.22)"}}>
                                <IconTrash/> Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{display:"flex",alignItems:"center",gap:12,marginTop:16}}>
                <div style={{flex:1,height:1,background:"linear-gradient(to right,transparent,rgba(201,169,110,0.25))"}}/>
                <span style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",
                  color:"#8B6914",opacity:0.55}}>
                  {list.length} of {guests.length} guests
                </span>
                <div style={{flex:1,height:1,background:"linear-gradient(to left,transparent,rgba(201,169,110,0.25))"}}/>
              </div>
            </div>
          )}

          {/* ══ NEW INVITATION ════════════════════════════════ */}
          {tab==="create" && (
            <div className="fade-up" style={{maxWidth:480}}>
              <div style={{...card,padding: isMobile ? "22px 18px" : "34px 30px"}}>
                <Corners/>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:300,
                  fontSize:"1.05rem",color:"#5C4A2A",lineHeight:1.7,marginBottom:24,opacity:0.85}}>
                  Each invitation is assigned a unique token link that unlocks the personalised
                  web invitation for that guest.
                </p>

                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <div>
                    <label style={lbl}>Full Name *</label>
                    <input value={nf.name} onChange={e=>setNf(n=>({...n,name:e.target.value}))}
                      placeholder="Elena Moretti" style={inp}/>
                  </div>
                  <div>
                    <label style={lbl}>WhatsApp Number *
                      <span style={{opacity:.5,fontWeight:300}}> — country code, no + sign</span>
                    </label>
                    <input value={nf.phone} onChange={e=>setNf(n=>({...n,phone:e.target.value}))}
                      placeholder="393331234567" inputMode="numeric" style={inp}/>
                  </div>
                  <div>
                    <label style={lbl}>Email <span style={{opacity:.5,fontWeight:300}}>(optional)</span></label>
                    <input value={nf.email} onChange={e=>setNf(n=>({...n,email:e.target.value}))}
                      placeholder="guest@email.com" inputMode="email" style={inp}/>
                  </div>
                  <div>
                    <label style={lbl}>Passes Reserved</label>
                    <div style={{display:"flex",gap:8}}>
                      {["1","2","3","4"].map(n=>(
                        <button key={n} type="button" onClick={()=>setNf(f=>({...f,passes:n}))}
                          style={{flex:1,height:48,cursor:"pointer",borderRadius:1,
                            fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",transition:"all .15s",
                            background:nf.passes===n?"linear-gradient(135deg,#C9A96E,#8B6914)":"rgba(201,169,110,0.08)",
                            color:nf.passes===n?"#FAF6F0":"#8B6914",
                            border:nf.passes===n?"1px solid transparent":"1px solid rgba(201,169,110,0.28)"}}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{height:1,background:"linear-gradient(to right,transparent,rgba(201,169,110,0.3),transparent)"}}/>
                  <button onClick={createGuest} style={goldBtn}>
                    Create &amp; Add to Guest List
                  </button>
                  {msg && (
                    <p style={{fontSize:11,textAlign:"center",
                      color:msg.startsWith("✓")?"#3A6A34":"#943030"}}>
                      {msg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ WHATSAPP TEMPLATE ══════════════════════════════ */}
          {tab==="template" && (
            <div className="fade-up" style={{
              display:"grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap:16}}>

              {/* Editor */}
              <div style={{...card,padding: isMobile ? "20px 16px" : "28px 26px"}}>
                <Corners/>
                <p style={{fontSize:9,letterSpacing:"0.28em",textTransform:"uppercase",
                  color:"#C9A96E",marginBottom:12}}>Edit Template</p>
                <p style={{fontSize:11,color:"#8B6914",lineHeight:1.7,marginBottom:12,opacity:0.75}}>
                  Use these variables anywhere in your message:
                </p>
                <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                  {["{name}","{passes}","{link}"].map(v=>(
                    <code key={v} style={{fontSize:11,padding:"3px 8px",borderRadius:1,
                      background:"rgba(201,169,110,0.13)",color:"#8B6914",
                      border:"1px solid rgba(201,169,110,0.3)"}}>{v}</code>
                  ))}
                </div>
                <textarea rows={isMobile ? 10 : 13} value={waTpl}
                  onChange={e=>setWaTpl(e.target.value)}
                  style={{...inp,resize:"vertical",lineHeight:1.75,fontFamily:"inherit",fontSize:13}}/>
                <div style={{marginTop:10,padding:"10px 12px",borderRadius:1,
                  background:"rgba(201,169,110,0.07)",border:"1px solid rgba(201,169,110,0.22)"}}>
                  <p style={{fontSize:10,color:"#8B6914",lineHeight:1.7}}>
                    <strong>How it works:</strong> tapping WhatsApp copies the message to your clipboard
                    then opens the chat — just paste. Emoji arrive intact on all devices.
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div style={{...card,padding: isMobile ? "20px 16px" : "28px 26px"}}>
                <Corners/>
                <p style={{fontSize:9,letterSpacing:"0.28em",textTransform:"uppercase",
                  color:"#C9A96E",marginBottom:12}}>
                  Live Preview
                  <span style={{fontSize:9,opacity:.5,fontWeight:300,letterSpacing:"0.1em",
                    marginLeft:10,textTransform:"none"}}>Elena · 2 passes</span>
                </p>
                <div style={{background:"#E5DDD5",borderRadius:10,padding:14,minHeight:200}}>
                  <div style={{background:"#fff",borderRadius:"0 10px 10px 10px",padding:"10px 14px",
                    display:"inline-block",maxWidth:"92%",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
                    <pre style={{fontFamily:"inherit",fontSize:13,lineHeight:1.75,
                      color:"#1a1a1a",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0}}>
                      {waTpl
                        .replace(/{name}/g,"Elena Moretti")
                        .replace(/{passes}/g,"2")
                        .replace(/{link}/g,`${BASE_URL}/?token=tok_elena`)}
                    </pre>
                  </div>
                  <p style={{fontSize:10,color:"#666",marginTop:6,textAlign:"right"}}>
                    {new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                  </p>
                </div>
                <div style={{marginTop:14}}>
                  <p style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",
                    color:"#8B6914",opacity:0.5,marginBottom:8}}>Quick test send</p>
                  <WAButton onClick={()=>handleWA(guests[0])}
                    label={`Send to ${guests[0].name.split(" ")[0]}`} full />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}


