import { useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"

const PHASES = [
  { id:"warmup",   label:"WARM-UP",       emoji:"🔥", seconds:300, color:"#f97316", dark:"#7c2d12", ring:"#fb923c" },
  { id:"core",     label:"CORE ACTIVITY", emoji:"🎯", seconds:780, color:"#2563eb", dark:"#1e3a8a", ring:"#60a5fa" },
  { id:"cooldown", label:"COOL-DOWN",     emoji:"🌙", seconds:300, color:"#8b5cf6", dark:"#4c1d95", ring:"#a78bfa" },
  { id:"wrapup",   label:"WRAP-UP",       emoji:"📢", seconds:150, color:"#059669", dark:"#064e3b", ring:"#34d399" },
]

const SUB_GAMES = {
  warmup:[
    { name:"Body Part Touch",   time:"4 min", kit:"None",         why:"Zero setup — call body parts, kids react instantly" },
    { name:"Morning Rush",      time:"5 min", kit:"None",         why:"Narrative warm-up, no equipment, instant energy" },
    { name:"Tail Chase",        time:"4 min", kit:"Bibs",         why:"Kids already have bibs — tuck and go in 10 seconds" },
    { name:"Cups and Cones",    time:"5 min", kit:"Cones",        why:"Cones already out — flip them, play immediately" },
    { name:"Number Sprint",     time:"5 min", kit:"Bean bags",    why:"Uses what's in your hand — fast team game" },
    { name:"Vegetable Market",  time:"4 min", kit:"None",         why:"Call-and-respond game, no setup, all abilities" },
  ],
  core:[
    { name:"Skip Like A...",    time:"12 min", kit:"None",        why:"Pure imagination — works if everything else is lost" },
    { name:"Clean Your Side",   time:"12 min", kit:"Bean bags",   why:"Maximum throwing reps, any space, instant reset" },
    { name:"Tail Chase (Core)", time:"15 min", kit:"Bibs",        why:"Dodging, evasion, spatial awareness — zero setup" },
    { name:"Island Rescue",     time:"12 min", kit:"Hoops",       why:"Hoops flat on ground — kids love it every time" },
    { name:"Collect and Skip",  time:"12 min", kit:"Bean bags + hoops", why:"Combines two skills — great when core game fails" },
    { name:"Target Throw",      time:"12 min", kit:"Bean bags + hoops", why:"Self-paced — works for all ability levels" },
  ],
  cooldown:[
    { name:"Slow Motion Replay",time:"5 min", kit:"None",         why:"No setup — replay session in slow motion" },
    { name:"Statue Garden",     time:"4 min", kit:"None",         why:"Freeze shapes — calm and fun, zero equipment" },
    { name:"Cloud Float",       time:"5 min", kit:"None",         why:"Breathing + walking — perfect session closer" },
    { name:"Shape Makers",      time:"5 min", kit:"None",         why:"Pairs form letters — literacy link, calm energy" },
  ],
  wrapup:[
    { name:"Nutrition Q&A",     time:"2 min", kit:"None",         why:"Ask one food question — kids shout answers" },
    { name:"Life Skill Shout",  time:"2 min", kit:"None",         why:"Name today's life skill — who can say why it matters?" },
    { name:"3-2-1 Review",      time:"2 min", kit:"None",         why:"3 things learned, 2 they liked, 1 they'll practise" },
  ],
}

function fmt(s) {
  return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`
}

export default function SessionCoach() {
  const { profile } = useAuth()
  const [screen, setScreen] = useState("setup")
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(PHASES[0].seconds)
  const [running, setRunning] = useState(false)
  const [whistleCount, setWhistleCount] = useState(0)
  const [whistleFlash, setWhistleFlash] = useState(false)
  const [subPhase, setSubPhase] = useState(null)
  const [customTimes, setCustomTimes] = useState({ warmup:5, core:13, cooldown:5, wrapup:3 })
  const [phaseComplete, setPhaseComplete] = useState(false)
  const [sessionLog, setSessionLog] = useState([])
  const [saving, setSaving] = useState(false)
  const [sessionMeta, setSessionMeta] = useState({ className:"", activity:"", notes:"" })
  const intervalRef = useRef(null)

  const phase = PHASES[phaseIdx]
  const totalSecs = customTimes[phase.id] * 60
  const pct = timeLeft / totalSecs
  const R = 120
  const CIRC = 2 * Math.PI * R
  const strokeDash = CIRC - CIRC * pct
  const urgentColor = timeLeft <= 30 && !phaseComplete ? "#ef4444" : phase.color
  const urgentRing  = timeLeft <= 30 && !phaseComplete ? "#ef4444" : phase.ring

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        setRunning(false)
        setPhaseComplete(true)
        if (navigator?.vibrate) navigator.vibrate([200,100,200,100,400])
        return 0
      }
      return prev - 1
    })
  }, [])

  useEffect(() => {
    if (running) intervalRef.current = setInterval(tick, 1000)
    else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [running, tick])

  function startSession() {
    setPhaseIdx(0)
    setTimeLeft(customTimes[PHASES[0].id] * 60)
    setRunning(false)
    setWhistleCount(0)
    setPhaseComplete(false)
    setSessionLog([])
    setScreen("session")
  }

  function nextPhase() {
    const next = phaseIdx + 1
    setSessionLog(prev => [...prev, { phase:phase.label, whistles:whistleCount, duration:customTimes[phase.id] }])
    if (next >= PHASES.length) { setRunning(false); setScreen("done"); return }
    setPhaseIdx(next)
    setTimeLeft(customTimes[PHASES[next].id] * 60)
    setRunning(false)
    setPhaseComplete(false)
    setWhistleCount(0)
  }

  function tapWhistle() {
    setWhistleCount(c => c + 1)
    setWhistleFlash(true)
    if (navigator?.vibrate) navigator.vibrate(80)
    setTimeout(() => setWhistleFlash(false), 180)
  }

  async function saveSession() {
    if (!profile?.school_id) return
    setSaving(true)
    const totalWhistles = sessionLog.reduce((a,b) => a + b.whistles, 0) + whistleCount
    const totalMin = Object.values(customTimes).reduce((a,b) => a+b, 0)
    await supabase.from("coach_sessions").insert([{
      school_id: profile.school_id,
      teacher_id: profile.id,
      class_name: sessionMeta.className || "General",
      activity_name: sessionMeta.activity || "PE Session",
      session_date: new Date().toISOString().split("T")[0],
      duration_minutes: totalMin,
      total_whistle_signals: totalWhistles,
      phase_log: JSON.stringify(sessionLog),
      notes: sessionMeta.notes || null,
    }])
    setSaving(false)
    alert("Session saved!")
  }

  // ── SETUP ──
  if (screen === "setup") return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⏱</div>
          <h1 className="text-white text-2xl font-black">Session Coach</h1>
          <p className="text-gray-500 text-sm mt-1">Set timings and start your PE session</p>
        </div>

        <div className="bg-[#0f172a] rounded-2xl p-4 mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class / Group</label>
          <input value={sessionMeta.className} onChange={e => setSessionMeta({...sessionMeta, className:e.target.value})}
            placeholder="e.g. Class 5A" className="w-full px-4 py-2 bg-[#1e293b] text-white rounded-xl text-sm border border-[#334155] outline-none focus:border-orange-500" />
        </div>

        <div className="bg-[#0f172a] rounded-2xl p-4 mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Today's Activity</label>
          <input value={sessionMeta.activity} onChange={e => setSessionMeta({...sessionMeta, activity:e.target.value})}
            placeholder="e.g. Skipping — K1.3 Skip the River" className="w-full px-4 py-2 bg-[#1e293b] text-white rounded-xl text-sm border border-[#334155] outline-none focus:border-orange-500" />
        </div>

        {PHASES.map(p => (
          <div key={p.id} className="bg-[#0f172a] rounded-2xl p-4 mb-3 flex items-center gap-4 border border-opacity-20" style={{borderColor:p.color+"33"}}>
            <span className="text-2xl w-8 text-center">{p.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-xs uppercase tracking-wider" style={{color:p.color}}>{p.label}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCustomTimes(t => ({...t,[p.id]:Math.max(1,t[p.id]-1)}))}
                className="w-9 h-9 rounded-lg border text-lg font-bold" style={{borderColor:p.color+"55",color:p.color,background:"transparent"}}>−</button>
              <span className="text-white font-black text-lg w-10 text-center">{customTimes[p.id]}<span className="text-xs text-gray-500 font-normal">m</span></span>
              <button onClick={() => setCustomTimes(t => ({...t,[p.id]:Math.min(30,t[p.id]+1)}))}
                className="w-9 h-9 rounded-lg border text-lg font-bold" style={{borderColor:p.color+"55",color:p.color,background:"transparent"}}>+</button>
            </div>
          </div>
        ))}

        <div className="bg-[#0f172a] rounded-xl p-3 mb-6 text-center">
          <span className="text-gray-500 text-sm">Total: </span>
          <span className="text-white font-black">{Object.values(customTimes).reduce((a,b)=>a+b,0)} min</span>
        </div>

        <button onClick={startSession} className="w-full py-5 rounded-2xl text-white text-lg font-black"
          style={{background:"linear-gradient(135deg,#f97316,#ef4444)",boxShadow:"0 8px 32px rgba(249,115,22,0.4)"}}>
          START SESSION →
        </button>
      </div>
    </div>
  )

  // ── SUB GAMES ──
  if (screen === "sub") {
    const games = SUB_GAMES[subPhase] || SUB_GAMES.core
    const ph = PHASES.find(p => p.id === subPhase)
    return (
      <div className="min-h-screen bg-[#0a0f1e] p-5">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setScreen("session")} className="w-11 h-11 rounded-xl bg-[#1e293b] text-white text-xl border-none cursor-pointer">←</button>
            <div>
              <div className="font-black text-xs uppercase tracking-widest" style={{color:ph?.color}}>INSTANT SUB</div>
              <div className="text-white font-black text-lg">{ph?.emoji} {ph?.label}</div>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-5">Pick any game below — all work right now with what's already on the field.</p>
          {games.map((g,i) => (
            <div key={i} onClick={() => setScreen("session")} className="bg-[#0f172a] rounded-2xl p-5 mb-3 cursor-pointer"
              style={{border:`1.5px solid ${ph?.color}33`}}>
              <div className="flex justify-between items-start mb-2">
                <div className="text-white font-black text-base">{g.name}</div>
                <div className="flex gap-2 ml-3 flex-shrink-0">
                  <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{background:ph?.color+"22",color:ph?.color}}>⏱ {g.time}</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-[#1e293b] text-gray-400">🎒 {g.kit}</span>
                </div>
              </div>
              <div className="text-gray-500 text-sm">→ {g.why}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── DONE ──
  if (screen === "done") {
    const totalWhistles = sessionLog.reduce((a,b) => a+b.whistles, 0) + whistleCount
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="text-6xl mb-3">🏆</div>
          <h2 className="text-white text-2xl font-black mb-1">Session Complete!</h2>
          <p className="text-gray-500 text-sm mb-6">Great work, Coach.</p>
          <div className="bg-[#0f172a] rounded-2xl p-5 mb-5 border border-[#1e293b]">
            {[...sessionLog, {phase:PHASES[phaseIdx].label, whistles:whistleCount}].map((l,i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[#1e293b]">
                <span className="text-gray-400 text-sm">{l.phase}</span>
                <span className="text-white font-bold text-sm">🎺 {l.whistles} signals</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-1">
              <span className="text-gray-500 text-sm font-bold">TOTAL</span>
              <span className="font-black text-base" style={{color:"#f97316"}}>🎺 {totalWhistles}</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-left">Session Notes (optional)</label>
            <textarea value={sessionMeta.notes} onChange={e => setSessionMeta({...sessionMeta,notes:e.target.value})}
              placeholder="What went well? What to improve?" rows={3}
              className="w-full px-4 py-3 bg-[#0f172a] text-white rounded-xl text-sm border border-[#1e293b] outline-none resize-none" />
          </div>
          <button onClick={saveSession} disabled={saving}
            className="w-full py-4 rounded-2xl text-white font-black text-base mb-3 disabled:opacity-50"
            style={{background:"linear-gradient(135deg,#059669,#0ea5e9)"}}>
            {saving ? "Saving..." : "💾 Save to KhelSakha"}
          </button>
          <button onClick={() => { setScreen("setup"); setPhaseIdx(0); setWhistleCount(0); setSessionLog([]) }}
            className="w-full py-4 bg-[#1e293b] rounded-2xl text-white font-black text-base border-none cursor-pointer">
            ← New Session
          </button>
        </div>
      </div>
    )
  }

  // ── SESSION ──
  return (
    <div className="min-h-screen flex flex-col items-center p-5 pb-8" style={{
      background:`radial-gradient(ellipse at 50% 20%, ${phaseComplete ? phase.color+"33" : phase.dark+"88"} 0%, #0a0f1e 70%)`,
      fontFamily:"'Inter',system-ui,sans-serif", transition:"background 0.6s"
    }}>
      <div className="w-full max-w-sm">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-7">
          <button onClick={() => { setRunning(false); setScreen("setup") }}
            className="px-4 py-2 bg-[#0f172a] border border-[#1e293b] rounded-xl text-gray-500 text-xs font-bold cursor-pointer">
            ✕ END
          </button>
          <div className="flex gap-1.5">
            {PHASES.map((p,i) => (
              <div key={p.id} style={{
                width: i===phaseIdx ? 24 : 8, height:8, borderRadius:4,
                background: i<=phaseIdx ? p.color : "#1e293b", transition:"all 0.3s"
              }} />
            ))}
          </div>
          <button onClick={() => { setSubPhase(phase.id); setRunning(false); setScreen("sub") }}
            className="px-4 py-2 bg-[#0f172a] rounded-xl text-xs font-bold cursor-pointer border"
            style={{borderColor:phase.color+"55",color:phase.color}}>
            ⚡ SUB
          </button>
        </div>

        {/* Phase label */}
        <div className="text-center mb-2">
          <div className="font-black text-xs uppercase tracking-widest" style={{color:urgentColor}}>
            {phase.emoji} {phase.label}
          </div>
          {sessionMeta.activity && <div className="text-gray-600 text-xs mt-1">{sessionMeta.activity}</div>}
        </div>

        {/* Arc timer */}
        <div className="flex justify-center mb-6 relative cursor-pointer" onClick={() => !phaseComplete && setRunning(r => !r)}>
          <svg width={300} height={300} style={{transform:"rotate(-90deg)"}}>
            <circle cx={150} cy={150} r={R} fill="none" stroke="#0f172a" strokeWidth={18} />
            <circle cx={150} cy={150} r={R} fill="none" stroke={urgentRing} strokeWidth={22}
              strokeDasharray={CIRC} strokeDashoffset={strokeDash} strokeLinecap="round"
              style={{filter:"blur(8px)",opacity:0.35,transition:"stroke-dashoffset 1s linear, stroke 0.3s"}} />
            <circle cx={150} cy={150} r={R} fill="none" stroke={urgentRing} strokeWidth={14}
              strokeDasharray={CIRC} strokeDashoffset={strokeDash} strokeLinecap="round"
              style={{transition:"stroke-dashoffset 1s linear, stroke 0.3s"}} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {phaseComplete ? (
              <><div className="text-5xl mb-1">✅</div><div className="text-white font-black text-lg">DONE!</div></>
            ) : (
              <><div className="text-white font-black leading-none" style={{fontSize:timeLeft>=600?52:64,letterSpacing:"-2px",fontVariantNumeric:"tabular-nums"}}>{fmt(timeLeft)}</div>
              <div className="text-gray-600 text-sm mt-2 font-semibold">{running?"tap to pause":"tap to start"}</div></>
            )}
          </div>
        </div>

        {/* Next/Reset button */}
        {phaseComplete ? (
          <button onClick={nextPhase} className="w-full py-5 rounded-2xl text-white text-lg font-black mb-4 border-none cursor-pointer"
            style={{background:`linear-gradient(135deg,${phase.color},${PHASES[Math.min(phaseIdx+1,3)].color})`,boxShadow:`0 8px 32px ${phase.color}44`}}>
            {phaseIdx < PHASES.length-1 ? `→ ${PHASES[phaseIdx+1].emoji} ${PHASES[phaseIdx+1].label}` : "🏆 FINISH SESSION"}
          </button>
        ) : (
          <button onClick={() => { setTimeLeft(customTimes[phase.id]*60); setRunning(false); setPhaseComplete(false) }}
            className="w-full py-4 mb-4 bg-[#0f172a] border border-[#1e293b] rounded-2xl text-gray-500 text-sm font-bold cursor-pointer">
            ↺ Reset Phase
          </button>
        )}

        {/* Whistle counter */}
        <div className="bg-[#0f172a] rounded-2xl p-5 border" style={{borderColor:whistleFlash?"#fff":"#1e293b",transition:"border-color 0.15s"}}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Stop Signals</div>
              <div className="text-white font-bold text-sm mt-1">Tap every whistle blow</div>
            </div>
            <button onClick={() => setWhistleCount(0)} className="text-[#334155] text-xs font-bold bg-transparent border-none cursor-pointer">reset</button>
          </div>
          <button onClick={tapWhistle} className="w-full py-5 rounded-2xl border-none cursor-pointer flex items-center justify-center gap-4"
            style={{background:whistleFlash?"#fff":"#1e293b",transition:"background 0.1s"}}>
            <span className="text-3xl">🎺</span>
            <span className="font-black" style={{fontSize:56,color:whistleFlash?"#0a0f1e":"#fff",fontVariantNumeric:"tabular-nums",lineHeight:1}}>{whistleCount}</span>
          </button>
          <div className="text-center mt-3 text-xs font-semibold text-[#334155]">
            {whistleCount===0?"No signals yet":whistleCount<=5?`${whistleCount} signals — good control`:whistleCount<=10?`${whistleCount} signals — monitor class`:`${whistleCount} signals — consider reducing 🔔`}
          </div>
        </div>
      </div>
    </div>
  )
}
