'use client'
import { useState, useMemo } from "react";
import type { CSSProperties } from "react";

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
  { id:"1", name:"Elena Moretti",      passes:2, status:"confirmed", token:"tok_elena",   phone:"393331234001", email:"elena@example.com",   createdAt:"2026-01-10" },
  { id:"2", name:"Luca Bianchi",       passes:1, status:"pending",   token:"tok_luca",    phone:"393331234002", email:"",                    createdAt:"2026-01-12" },
  { id:"3", name:"Giulia Ferrara",     passes:4, status:"confirmed", token:"tok_giulia",  phone:"393331234003", email:"giulia@example.com",  createdAt:"2026-01-14" },
  { id:"4", name:"Marco Conti",        passes:2, status:"declined",  token:"tok_marco",   phone:"393331234004", email:"",                    createdAt:"2026-01-15" },
  { id:"5", name:"Sofia Ricci",        passes:3, status:"pending",   token:"tok_sofia",   phone:"393331234005", email:"sofia@example.com",   createdAt:"2026-01-16" },
  { id:"6", name:"Pietro Romano",      passes:2, status:"confirmed", token:"tok_pietro",  phone:"393331234006", email:"",                    createdAt:"2026-01-18" },
  { id:"7", name:"Valentina Esposito", passes:1, status:"pending",   token:"tok_vale",    phone:"393331234007", email:"vale@example.com",    createdAt:"2026-01-19" },
  { id:"8", name:"Andrea Colombo",     passes:2, status:"confirmed", token:"tok_andrea",  phone:"393331234008", email:"",                    createdAt:"2026-01-20" },
  { id:"9", name:"Chiara De Luca",     passes:2, status:"declined",  token:"tok_chiara",  phone:"393331234009", email:"chiara@example.com",  createdAt:"2026-01-21" },
  { id:"10",name:"Roberto Mancini",    passes:3, status:"pending",   token:"tok_roberto", phone:"393331234010", email:"",                    createdAt:"2026-01-22" },
];

const BASE_URL = "https://wed-vitation.vercel.app";
const mkLink = (token: string) => `${BASE_URL}/?token=${token}`;
const genToken = () => "tok_" + Math.random().toString(36).slice(2,10);

// ─── tiny components ──────────────────────────────────────────
const Badge = ({ status }: { status: GuestStatus }) => {
  const MAP: Record<GuestStatus, { label: string; bg: string; color: string; bd: string }> = {
    confirmed: { label:"Confirmed", bg:"rgba(74,122,68,0.1)",   color:"#3A6A34", bd:"rgba(74,122,68,0.28)"  },
    pending:   { label:"Pending",   bg:"rgba(201,169,110,0.13)",color:"#8B6914", bd:"rgba(201,169,110,0.35)"},
    declined:  { label:"Declined",  bg:"rgba(160,60,60,0.1)",   color:"#943030", bd:"rgba(154,48,48,0.28)"  },
  };
  const c = MAP[status];
  return (
    <span style={{padding:"2px 10px",fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",
      background:c.bg,color:c.color,border:`1px solid ${c.bd}`,borderRadius:2,whiteSpace:"nowrap"}}>
      {c.label}
    </span>
  );
};

const CopyBtn = ({ text }: { text: string }) => {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={()=>{navigator.clipboard.writeText(text);setOk(true);setTimeout(()=>setOk(false),1800);}}
      style={{padding:"3px 8px",fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",cursor:"pointer",
        borderRadius:1,whiteSpace:"nowrap",transition:"all .2s",fontFamily:"inherit",
        background: ok?"rgba(74,122,68,0.12)":"rgba(201,169,110,0.08)",
        color: ok?"#3A6A34":"#8B6914",
        border:`1px solid ${ok?"rgba(74,122,68,0.28)":"rgba(201,169,110,0.25)"}`}}>
      {ok ? "✓ Copied" : "Copy"}
    </button>
  );
};

const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="5" stroke="#C9A96E" strokeWidth="1.3"/>
    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#C9A96E" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconWA = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#2A7A2A">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── Corner accents helper ────────────────────────────────────
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

// ─── Main ─────────────────────────────────────────────────────
export default function Dashboard() {
  const [guests, setGuests]   = useState<Guest[]>(SEED_GUESTS);
  const [tab, setTab]         = useState("guests"); // guests | create | template
  const [search, setSearch]   = useState("");
  const [statusF, setStatusF] = useState("all");
  const [waTpl, setWaTpl]     = useState(
`Hola {name} 🌸

Con mucha alegría te invitamos a nuestra boda.
Tienes {passes} pase(s) reservados en tu honor.

📅 15 de junio de 2026
📍 Toscana, Italia

Confirma tu asistencia aquí:
{link}

— Sofia & Marco 💛`
  );

  // new-guest form
  const [nf, setNf] = useState({ name:"", phone:"", email:"", passes:"1" });
  const [msg, setMsg] = useState("");

  // stats
  const st = useMemo(() => {
    const conf = guests.filter(g=>g.status==="confirmed");
    return {
      total:     guests.length,
      passes:    guests.reduce((a,g)=>a+g.passes,0),
      confirmed: conf.length,
      confPasses:conf.reduce((a,g)=>a+g.passes,0),
      pending:   guests.filter(g=>g.status==="pending").length,
      declined:  guests.filter(g=>g.status==="declined").length,
    };
  }, [guests]);

  // filtered list
  const list = useMemo(() => guests.filter(g => {
    const q = search.toLowerCase();
    return (g.name.toLowerCase().includes(q) || g.token.includes(q) || g.email.toLowerCase().includes(q))
      && (statusF==="all" || g.status===statusF);
  }), [guests, search, statusF]);

  // whatsapp href
  const waHref = (g: Guest) => {
    const body = waTpl
      .replace(/{name}/g, g.name)
      .replace(/{passes}/g, String(g.passes))
      .replace(/{link}/g, mkLink(g.token));
    return `https://wa.me/${g.phone}?text=${encodeURIComponent(body)}`;
  };

  const createGuest = () => {
    if (!nf.name.trim()||!nf.phone.trim()) { setMsg("Name and phone are required."); return; }
    const g: Guest = { id:String(Date.now()), name:nf.name.trim(), passes:Math.max(1,parseInt(nf.passes)||1),
      status:"pending", token:genToken(), phone:nf.phone.replace(/\D/g,""),
      email:nf.email.trim(), createdAt:new Date().toISOString().slice(0,10) };
    setGuests(gs=>[g,...gs]);
    setNf({name:"",phone:"",email:"",passes:"1"});
    setMsg(`✓ Invitation created for ${g.name}`);
    setTimeout(()=>setMsg(""),3000);
    setTab("guests");
  };

  const removeGuest = (id: string) => { if(window.confirm("Remove this guest?")) setGuests(gs=>gs.filter(g=>g.id!==id)); };

  // ── shared style objects ───────────────────────────────────
  const card: CSSProperties = { position:"relative", background:"linear-gradient(160deg,rgba(253,248,242,0.97),rgba(245,237,224,0.88))",
    border:"1px solid rgba(201,169,110,0.24)", borderRadius:2, overflow:"hidden",
    boxShadow:"0 2px 20px rgba(139,105,20,0.07),inset 0 1px 0 rgba(255,255,255,0.8)" };

  const inp = { width:"100%", padding:"9px 13px", fontFamily:"inherit", fontSize:13,
    color:"#2C2C2C", background:"rgba(201,169,110,0.05)", borderRadius:1, outline:"none",
    border:"1px solid rgba(201,169,110,0.26)", lineHeight:1.5 };

  const lbl = { display:"block", fontSize:9, letterSpacing:"0.26em", textTransform:"uppercase",
    color:"#8B6914", marginBottom:6 };

  const goldBtn = { padding:"10px 22px", fontFamily:"inherit", fontSize:9, letterSpacing:"0.24em",
    textTransform:"uppercase", cursor:"pointer", borderRadius:1, border:"none",
    background:"linear-gradient(135deg,#C9A96E,#8B6914)", color:"#FAF6F0",
    boxShadow:"0 4px 14px rgba(139,105,20,0.22)" };

  const TABS = [
    { key:"guests",   label:"Guest List"       },
    { key:"create",   label:"New Invitation"   },
    { key:"template", label:"WhatsApp Template"},
  ];

  const FILTERS = [
    { key:"all",       label:`All  ${guests.length}`       },
    { key:"confirmed", label:`Confirmed  ${st.confirmed}`  },
    { key:"pending",   label:`Pending  ${st.pending}`      },
    { key:"declined",  label:`Declined  ${st.declined}`    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&family=Great+Vibes&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Jost',sans-serif;background:#F3EBE0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#F3EBE0}
        ::-webkit-scrollbar-thumb{background:rgba(201,169,110,0.38);border-radius:3px}
        input:focus,textarea:focus,select:focus{border-color:rgba(201,169,110,0.6)!important;outline:none}
        .gt{width:100%;border-collapse:collapse}
        .gt th{font-family:'Jost',sans-serif;font-size:9px;letter-spacing:.26em;text-transform:uppercase;
          color:#8B6914;font-weight:400;padding:10px 16px;text-align:left;
          border-bottom:1px solid rgba(201,169,110,0.18);white-space:nowrap}
        .gt td{font-size:12px;color:#2C2C2C;padding:11px 16px;border-bottom:1px solid rgba(201,169,110,0.09);vertical-align:middle}
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
          position:"sticky",top:0,zIndex:50,padding:"0 32px"}}>
          <div style={{maxWidth:1140,margin:"0 auto",display:"flex",
            alignItems:"center",justifyContent:"space-between",height:58}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              {/* rings logo */}
              <svg width="24" height="16" viewBox="0 0 32 20" fill="none">
                <circle cx="11" cy="10" r="8.5" stroke="#C9A96E" strokeWidth="1.3" fill="none"/>
                <circle cx="21" cy="10" r="8.5" stroke="#C9A96E" strokeWidth="1.3" fill="rgba(201,169,110,0.08)"/>
              </svg>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",
                fontWeight:400,color:"#2C2C2C",letterSpacing:"0.04em"}}>
                Sofia &amp; Marco
              </span>
              <span style={{width:1,height:18,background:"rgba(201,169,110,0.38)",display:"inline-block"}}/>
              <span style={{fontSize:9,letterSpacing:"0.3em",textTransform:"uppercase",
                color:"#8B6914",opacity:0.65}}>Wedding Dashboard</span>
                <a href="/seating" style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",
              color:"#8B6914",textDecoration:"none",opacity:0.5,
              border:"1px solid rgba(201,169,110,0.3)",padding:"5px 12px",borderRadius:1}}>
              Seating
            </a>
            </div>
            <a href="/" style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",
              color:"#8B6914",textDecoration:"none",opacity:0.5,
              border:"1px solid rgba(201,169,110,0.3)",padding:"5px 12px",borderRadius:1}}>
              ← Invitation
            </a>
          </div>
        </header>

        <main style={{maxWidth:1140,margin:"0 auto",padding:"36px 32px 80px"}}>

          {/* ── Stats row ──────────────────────────────────── */}
          <div className="fade-up" style={{display:"grid",
            gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:36}}>
            {[
              {label:"Invitations Sent", value:st.total,     sub:"total guests"},
              {label:"Passes Reserved",  value:st.passes,    sub:"seats allocated"},
              {label:"Confirmed",        value:st.confirmed, sub:`${st.confPasses} seats`},
              {label:"Pending Reply",    value:st.pending,   sub:"awaiting"},
              {label:"Declined",         value:st.declined,  sub:"regretfully"},
            ].map(({label,value,sub},i)=>(
              <div key={label} className="fade-up" style={{...card,padding:"20px 18px 16px",
                animationDelay:`${i*60}ms`}}>
                <Corners/>
                <p style={{fontSize:9,letterSpacing:"0.24em",textTransform:"uppercase",
                  color:"#8B6914",opacity:0.7,marginBottom:10}}>{label}</p>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2.6rem",
                  fontWeight:300,lineHeight:1,color:"#C9A96E",marginBottom:5}}>{value}</p>
                <div style={{width:14,height:1,background:"rgba(201,169,110,0.4)",marginBottom:5}}/>
                <p style={{fontSize:10,color:"#8B6914",opacity:0.55}}>{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Tabs ───────────────────────────────────────── */}
          <div style={{display:"flex",gap:0,borderBottom:"1px solid rgba(201,169,110,0.18)",
            marginBottom:28}}>
            {TABS.map(({key,label})=>(
              <button key={key} onClick={()=>setTab(key)}
                style={{padding:"10px 22px",cursor:"pointer",fontFamily:"inherit",fontSize:9,
                  letterSpacing:"0.24em",textTransform:"uppercase",background:"none",border:"none",
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
              {/* Search + filter */}
              <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{position:"relative",flex:1,minWidth:220}}>
                  <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",
                    pointerEvents:"none",display:"flex"}}>
                    <IconSearch/>
                  </span>
                  <input value={search} onChange={e=>setSearch(e.target.value)}
                    placeholder="Search by name, email or token…"
                    style={{...inp,paddingLeft:32,fontSize:12}}/>
                </div>
                <div style={{display:"flex",gap:6}}>
                  {FILTERS.map(({key,label})=>(
                    <button key={key} onClick={()=>setStatusF(key)}
                      style={{padding:"8px 14px",cursor:"pointer",fontFamily:"inherit",fontSize:9,
                        letterSpacing:"0.15em",textTransform:"uppercase",borderRadius:1,transition:"all .15s",
                        background:statusF===key?"linear-gradient(135deg,#C9A96E,#8B6914)":"rgba(201,169,110,0.07)",
                        color:statusF===key?"#FAF6F0":"#8B6914",
                        border:statusF===key?"1px solid transparent":"1px solid rgba(201,169,110,0.26)"}}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table card */}
              <div style={{...card,overflowX:"auto"}}>
                <Corners/>
                <table className="gt">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Passes</th>
                      <th>Status</th>
                      <th>Invitation Link</th>
                      <th>Actions</th>
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
                        {/* name */}
                        <td>
                          <p style={{fontWeight:500,marginBottom:2,color:"#1C1C1C"}}>{g.name}</p>
                          {g.email && <p style={{fontSize:10,color:"#8B6914",opacity:0.6}}>{g.email}</p>}
                          <p style={{fontSize:9,color:"#8B6914",opacity:0.38,letterSpacing:"0.08em"}}>
                            Added {g.createdAt}
                          </p>
                        </td>
                        {/* passes */}
                        <td>
                          <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",
                            width:30,height:30,borderRadius:"50%",
                            background:"rgba(201,169,110,0.12)",border:"1px solid rgba(201,169,110,0.3)",
                            fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:"#8B6914"}}>
                            {g.passes}
                          </span>
                        </td>
                        {/* status */}
                        <td><Badge status={g.status}/></td>
                        {/* link */}
                        <td>
                          <div style={{display:"flex",flexDirection:"column",gap:5}}>
                            <code style={{fontSize:10,color:"#5C4A2A",opacity:0.6,
                              wordBreak:"break-all",lineHeight:1.4}}>
                              {mkLink(g.token)}
                            </code>
                            <CopyBtn text={mkLink(g.token)}/>
                          </div>
                        </td>
                        {/* actions */}
                        <td>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            <a href={waHref(g)} target="_blank" rel="noopener noreferrer"
                              style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 10px",
                                fontSize:9,letterSpacing:"0.13em",textTransform:"uppercase",
                                textDecoration:"none",borderRadius:1,cursor:"pointer",
                                background:"rgba(42,122,42,0.08)",color:"#2A6A24",
                                border:"1px solid rgba(42,122,42,0.22)"}}>
                              <IconWA/> WhatsApp
                            </a>
                            <button onClick={()=>removeGuest(g.id)}
                              style={{padding:"5px 10px",fontSize:9,letterSpacing:"0.13em",
                                textTransform:"uppercase",cursor:"pointer",borderRadius:1,
                                fontFamily:"inherit",background:"rgba(160,50,50,0.07)",
                                color:"#943030",border:"1px solid rgba(148,48,48,0.22)"}}>
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary footer */}
              <div style={{display:"flex",alignItems:"center",gap:12,marginTop:16}}>
                <div style={{flex:1,height:1,background:"linear-gradient(to right,transparent,rgba(201,169,110,0.25))"}}/>
                <span style={{fontSize:9,letterSpacing:"0.22em",textTransform:"uppercase",
                  color:"#8B6914",opacity:0.55}}>
                  Showing {list.length} of {guests.length} guests
                </span>
                <div style={{flex:1,height:1,background:"linear-gradient(to left,transparent,rgba(201,169,110,0.25))"}}/>
              </div>
            </div>
          )}

          {/* ══ NEW INVITATION ════════════════════════════════ */}
          {tab==="create" && (
            <div className="fade-up" style={{maxWidth:500}}>
              <div style={{...card,padding:"34px 30px"}}>
                <Corners/>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontWeight:300,
                  fontSize:"1.05rem",color:"#5C4A2A",lineHeight:1.7,marginBottom:28,opacity:0.85}}>
                  Each invitation is assigned a unique token link that unlocks the personalised
                  web invitation for that guest.
                </p>

                <div style={{display:"flex",flexDirection:"column",gap:18}}>
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
                      placeholder="393331234567" style={inp}/>
                  </div>

                  <div>
                    <label style={lbl}>Email <span style={{opacity:.5,fontWeight:300}}>(optional)</span></label>
                    <input value={nf.email} onChange={e=>setNf(n=>({...n,email:e.target.value}))}
                      placeholder="guest@email.com" style={inp}/>
                  </div>

                  <div>
                    <label style={lbl}>Passes Reserved</label>
                    <div style={{display:"flex",gap:8}}>
                      {["1","2","3","4"].map(n=>(
                        <button key={n} type="button" onClick={()=>setNf(f=>({...f,passes:n}))}
                          style={{width:46,height:46,cursor:"pointer",borderRadius:1,
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
            <div className="fade-up" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

              {/* Editor */}
              <div style={{...card,padding:"28px 26px"}}>
                <Corners/>
                <p style={{fontSize:9,letterSpacing:"0.28em",textTransform:"uppercase",
                  color:"#C9A96E",marginBottom:14}}>Edit Template</p>

                <p style={{fontSize:11,color:"#8B6914",lineHeight:1.7,marginBottom:16,opacity:0.75}}>
                  Use these variables anywhere in your message:
                </p>
                <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
                  {["{name}","{passes}","{link}"].map(v=>(
                    <code key={v} style={{fontSize:11,padding:"3px 8px",borderRadius:1,
                      background:"rgba(201,169,110,0.13)",color:"#8B6914",
                      border:"1px solid rgba(201,169,110,0.3)"}}>{v}</code>
                  ))}
                </div>

                <textarea rows={13} value={waTpl} onChange={e=>setWaTpl(e.target.value)}
                  style={{...inp,resize:"vertical",lineHeight:1.75,fontFamily:"inherit",fontSize:13}}/>

                <p style={{fontSize:10,color:"#8B6914",opacity:0.45,marginTop:10}}>
                  Changes apply instantly — every WhatsApp link in the guest list reflects this template.
                </p>
              </div>

              {/* Live preview */}
              <div style={{...card,padding:"28px 26px"}}>
                <Corners/>
                <p style={{fontSize:9,letterSpacing:"0.28em",textTransform:"uppercase",
                  color:"#C9A96E",marginBottom:14}}>
                  Live Preview
                  <span style={{fontSize:9,opacity:.5,fontWeight:300,letterSpacing:"0.1em",
                    marginLeft:10,textTransform:"none"}}>Elena Moretti · 2 passes</span>
                </p>

                {/* faux WhatsApp bubble */}
                <div style={{background:"#E5DDD5",borderRadius:10,padding:18,minHeight:240}}>
                  <div style={{background:"#fff",borderRadius:"0 10px 10px 10px",padding:"12px 16px",
                    display:"inline-block",maxWidth:"90%",
                    boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
                    <pre style={{fontFamily:"inherit",fontSize:13,lineHeight:1.75,
                      color:"#1a1a1a",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0}}>
                      {waTpl
                        .replace(/{name}/g,SEED_GUESTS[0].name)
                        .replace(/{passes}/g,String(SEED_GUESTS[0].passes))
                        .replace(/{link}/g,`${BASE_URL}/?token=${SEED_GUESTS[0].token}`)}
                    </pre>
                  </div>
                  <p style={{fontSize:10,color:"#666",marginTop:6,textAlign:"right"}}>
                    {new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                  </p>
                </div>

                {/* quick-send to first guest */}
                <div style={{marginTop:16}}>
                  <p style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",
                    color:"#8B6914",opacity:0.55,marginBottom:8}}>Quick test send</p>
                  <a href={waHref(guests[0])} target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:7,padding:"9px 16px",
                      fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",
                      textDecoration:"none",borderRadius:1,
                      background:"rgba(42,122,42,0.09)",color:"#2A6A24",
                      border:"1px solid rgba(42,122,42,0.24)"}}>
                    <IconWA/> Send to {guests[0].name}
                  </a>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}