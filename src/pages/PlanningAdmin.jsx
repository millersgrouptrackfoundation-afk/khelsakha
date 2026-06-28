import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { Plus, Trash2, Edit, Printer, CheckSquare, Square } from "lucide-react"

const SKILLS = ["Skipping","Throwing","Catching","Dodging","Landing","Side Stepping"]
const SKILL_COLORS = {
  Skipping:"#f97316", Throwing:"#3b82f6", Catching:"#22c55e",
  Dodging:"#a855f7", Landing:"#ef4444", "Side Stepping":"#0ea5e9"
}
const WARMUP_GAMES = [
  "Cups and Cones","Body Part Touch","Island Rescue","Number Sprint",
  "Tail Chase","Morning Rush","Vegetable Market","Shark Attack",
  "Four Corners","Traffic Lights","Freeze Dance","Chain Tag"
]
const COOLDOWN_GAMES = [
  "Slow Motion Replay","Statue Garden","Cloud Float","Shape Makers",
  "Breathing Circle","Yoga Stretch","Silent Walk","Story Stretch"
]
const ACTIVITIES = {
  Skipping:["K1.1 Skip Like A...","K1.2 Musical Hoops Skip","K1.3 Skip the River","K1.4 Skip and Freeze","K1.5 Shadow Skip","K1.6 Jump the River","K1.7 Collect and Skip","K1.8 Shape Makers"],
  Throwing:["T1.1 Partner Roll & Throw","T1.2 Basket Raid","T1.3 Clean Your Side","T1.4 Through the Gate","T1.5 Distance Challenge","T1.6 Bounce Pass","T1.7 Target Throw","T1.8 Pinball Alley"],
  Catching:["C1.1 Roll & React","C1.2 Bounce & React","C1.3 Hot Potato","C1.4 Sit & Bounce","C1.5 Bounce Pass","C1.6 Wall Catch","C1.7 Juggle It","C1.8 Partner Distance"],
  Dodging:["D1.1 Let's Dodge","D1.2 Shunk Tag","D1.3 Shark Attack","D1.4 Three Blind Mice","D1.5 Drop the Biscuit","D1.6 Frost and Sun","D1.7 Fox and Hen","D1.8 Mirror Dodge"],
  Landing:["L1.1 Motorbike Landing","L1.2 Crossovers","L1.3 Wind Stance","L1.4 Jump the Zone","L1.5 Box Landing","L1.6 Soft Feet","L1.7 River Jump","L1.8 Target Landing"],
  "Side Stepping":["SS1.1 Touch the Spot","SS1.2 Closing the Space","SS1.3 Fox and Hen","SS1.4 Lateral Relay","SS1.5 Cone Weave","SS1.6 Shadow Step","SS1.7 Mirror Lane","SS1.8 Side Gate"]
}
const EQUIPMENT_MAP = {
  Skipping:["Skipping ropes (30)","Saucer cones","Hoops (15)","Whistle"],
  Throwing:["Bean bags (30)","Rubber balls (20)","Skittle targets","Measuring tape","Whistle"],
  Catching:["Foam balls (15)","Rubber balls (20)","Hoops (10)","Whistle"],
  Dodging:["Bibs (24)","Saucer cones","Hoops (10)","Whistle"],
  Landing:["Hoops (10)","Saucer cones","Agility ladder","Whistle"],
  "Side Stepping":["Saucer cones","Agility ladder","Bibs (24)","Whistle"],
  "Cups and Cones":["Saucer cones (30)"],
  "Body Part Touch":["Whistle"],
  "Island Rescue":["Hoops (15)","Whistle"],
  "Number Sprint":["Bean bags (20)","Hoops (5)","Whistle"],
  "Tail Chase":["Bibs (30)","Whistle"],
  "Morning Rush":["Whistle"],
  "Slow Motion Replay":["Whistle"],
  "Statue Garden":["Whistle"],
  "Cloud Float":["Whistle"],
  "Shape Makers":["Whistle"]
}
const ALWAYS_CARRY = ["First Aid Kit","Water bottle","Mentor Log Book","Clipboard + pen","Stopwatch"]

function getEquipment(session) {
  const set = new Set(ALWAYS_CARRY)
  ;[session.skill, session.warmup, session.cooldown].forEach(k => {
    ;(EQUIPMENT_MAP[k] || []).forEach(e => set.add(e))
  })
  return [...set]
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })
}
function fmtShort(d) {
  return new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short" })
}
function dayName(d) {
  return new Date(d).toLocaleDateString("en-IN", { weekday:"short" })
}
function todayStr() { return new Date().toISOString().split("T")[0] }

export default function PlanningAdmin() {
  const { profile } = useAuth()
  const [tab, setTab] = useState("planner")
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editSession, setEditSession] = useState(null)
  const [checkedItems, setCheckedItems] = useState({})
  const [printSession, setPrintSession] = useState(null)
  const [form, setForm] = useState({
    session_date: todayStr(), week_number:1, skill:"Skipping",
    activity:ACTIVITIES.Skipping[0], warmup:WARMUP_GAMES[0],
    cooldown:COOLDOWN_GAMES[0], class_name:"", notes:"", delivered:false
  })

  useEffect(() => { fetchSessions() }, [profile])

  const fetchSessions = async () => {
    if (!profile?.school_id) return
    setLoading(true)
    const { data } = await supabase
      .from("planning_sessions")
      .select("*")
      .eq("school_id", profile.school_id)
      .order("session_date", { ascending:true })
    setSessions(data || [])
    setLoading(false)
  }

  const saveSession = async () => {
    const payload = {
      ...form,
      school_id: profile.school_id,
      teacher_id: profile.id
    }
    if (editSession) {
      await supabase.from("planning_sessions").update(payload).eq("id", editSession.id)
    } else {
      await supabase.from("planning_sessions").insert([payload])
    }
    setShowForm(false)
    setEditSession(null)
    resetForm()
    fetchSessions()
  }

  const deleteSession = async (id) => {
    if (!confirm("Delete this session?")) return
    await supabase.from("planning_sessions").delete().eq("id", id)
    if (selectedId === id) setSelectedId(null)
    fetchSessions()
  }

  const toggleDelivered = async (session) => {
    await supabase.from("planning_sessions").update({ delivered:!session.delivered }).eq("id", session.id)
    fetchSessions()
  }

  const resetForm = () => setForm({
    session_date:todayStr(), week_number:1, skill:"Skipping",
    activity:ACTIVITIES.Skipping[0], warmup:WARMUP_GAMES[0],
    cooldown:COOLDOWN_GAMES[0], class_name:"", notes:"", delivered:false
  })

  const openEdit = (sess) => {
    setEditSession(sess)
    setForm({
      session_date:sess.session_date, week_number:sess.week_number,
      skill:sess.skill, activity:sess.activity, warmup:sess.warmup,
      cooldown:sess.cooldown, class_name:sess.class_name||"",
      notes:sess.notes||"", delivered:sess.delivered||false
    })
    setShowForm(true)
  }

  const toggleCheck = (item) => setCheckedItems(prev => ({...prev, [item]:!prev[item]}))

  const focusSess = selectedId ? sessions.find(s => s.id===selectedId) : sessions.find(s => s.session_date===todayStr()) || sessions.find(s => !s.delivered && s.session_date >= todayStr())
  const equipment = focusSess ? getEquipment(focusSess) : ALWAYS_CARRY
  const checkedCount = equipment.filter(e => checkedItems[e]).length

  const skillGroups = SKILLS.reduce((acc, skill) => {
    const count = sessions.filter(s => s.skill===skill).length
    if (count > 0) acc[skill] = count
    return acc
  }, {})

  const delivered = sessions.filter(s => s.delivered).length

  const TABS = [
    { id:"planner", label:"📅 Term Planner" },
    { id:"checklist", label:"🎒 Equipment Check" },
    { id:"print", label:"🖨️ Session Card" }
  ]

  const inp = "w-full px-4 py-2.5 bg-[#0f172a] text-white rounded-xl border border-[#1e293b] outline-none text-sm focus:border-blue-500"
  const sel = "w-full px-4 py-2.5 bg-[#0f172a] text-white rounded-xl border border-[#1e293b] outline-none text-sm cursor-pointer focus:border-blue-500"

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Planning & Admin</h1>
        <p className="text-gray-600 mt-1">Term planner, equipment checklist and printable session cards</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:"Sessions Planned", value:sessions.length, color:"bg-blue-50 text-blue-700" },
          { label:"Delivered", value:delivered, color:"bg-green-50 text-green-700" },
          { label:"Remaining", value:sessions.length-delivered, color:"bg-orange-50 text-orange-700" },
          { label:"Skills Covered", value:`${Object.keys(skillGroups).length}/6`, color:"bg-purple-50 text-purple-700" },
        ].map((s,i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-[#1A3B2E]">{s.value}</p>
            <p className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 bg-white rounded-2xl shadow-sm p-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab===t.id ? "bg-[#1A3B2E] text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "planner" && (
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Curriculum Coverage</p>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map(skill => {
                const count = skillGroups[skill] || 0
                return (
                  <div key={skill} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm"
                    style={{borderColor:count>0?SKILL_COLORS[skill]:"#e2e8f0", background:count>0?SKILL_COLORS[skill]+"15":"#f8fafc"}}>
                    <div className="w-2 h-2 rounded-full" style={{background:count>0?SKILL_COLORS[skill]:"#cbd5e1"}} />
                    <span className="font-semibold" style={{color:count>0?SKILL_COLORS[skill]:"#94a3b8"}}>{skill}</span>
                    {count > 0 && <span className="text-xs text-gray-500">{count}</span>}
                  </div>
                )
              })}
            </div>
            {SKILLS.filter(s => !skillGroups[s]).length > 0 && (
              <p className="text-xs text-red-500 font-semibold mt-3">
                ⚠ Not yet scheduled: {SKILLS.filter(s => !skillGroups[s]).join(", ")}
              </p>
            )}
          </div>

          <div className="flex justify-end mb-4">
            <button onClick={() => { setEditSession(null); resetForm(); setShowForm(true) }}
              className="bg-[#E76F51] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#d65f41] flex items-center gap-2">
              <Plus size={16} /> Add Session
            </button>
          </div>

          {showForm && (
            <div className="bg-[#0a0f1e] rounded-2xl p-6 mb-5">
              <h3 className="text-white font-bold text-lg mb-5">{editSession ? "Edit Session" : "New Session"}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                  <input type="date" value={form.session_date} onChange={e => setForm({...form,session_date:e.target.value})} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Week #</label>
                  <input type="number" min={1} max={40} value={form.week_number} onChange={e => setForm({...form,week_number:parseInt(e.target.value)||1})} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skill Focus</label>
                  <select value={form.skill} onChange={e => setForm({...form,skill:e.target.value,activity:ACTIVITIES[e.target.value][0]})} className={sel}>
                    {SKILLS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Core Activity</label>
                  <select value={form.activity} onChange={e => setForm({...form,activity:e.target.value})} className={sel}>
                    {(ACTIVITIES[form.skill]||[]).map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Warm-up Game</label>
                  <select value={form.warmup} onChange={e => setForm({...form,warmup:e.target.value})} className={sel}>
                    {WARMUP_GAMES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cool-down Game</label>
                  <select value={form.cooldown} onChange={e => setForm({...form,cooldown:e.target.value})} className={sel}>
                    {COOLDOWN_GAMES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Class / Group</label>
                  <input value={form.class_name} onChange={e => setForm({...form,class_name:e.target.value})} placeholder="e.g. Class 5A" className={inp} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} rows={2} placeholder="Optional notes..." className={`${inp} resize-none`} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowForm(false); setEditSession(null) }} className="flex-1 py-2.5 border border-gray-600 text-gray-400 rounded-xl text-sm">Cancel</button>
                <button onClick={saveSession} className="flex-1 py-2.5 bg-[#E76F51] text-white rounded-xl text-sm font-semibold">{editSession?"Update":"Save"} Session</button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">📅</p>
              <p className="font-semibold text-gray-500">No sessions planned yet</p>
              <p className="text-sm mt-1">Add your first session to build your term plan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(sess => {
                const sc = SKILL_COLORS[sess.skill] || "#64748b"
                const isSelected = selectedId === sess.id
                const isToday = sess.session_date === todayStr()
                return (
                  <div key={sess.id} className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    style={{border:`1.5px solid ${isSelected?sc:isToday?sc+"55":"#f1f5f9"}`}}>
                    <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setSelectedId(isSelected?null:sess.id)}>
                      <div onClick={e => { e.stopPropagation(); toggleDelivered(sess) }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer text-sm font-black border-2 transition-all"
                        style={{background:sess.delivered?sc:"transparent", borderColor:sess.delivered?sc:"#e2e8f0", color:sess.delivered?"#fff":"#94a3b8"}}>
                        {sess.delivered ? "✓" : ""}
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-xs font-bold uppercase tracking-wider" style={{color:sc}}>{sess.skill}</div>
                        <div className="text-xs text-gray-400">{dayName(sess.session_date)} {fmtShort(sess.session_date)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#1A3B2E] truncate">{sess.activity}</div>
                        <div className="text-xs text-gray-400">{sess.warmup} → {sess.cooldown}</div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={e => { e.stopPropagation(); openEdit(sess) }} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-xs cursor-pointer">✏️</button>
                        <button onClick={e => { e.stopPropagation(); setPrintSession(sess); setTab("print") }} className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-xs cursor-pointer">🖨️</button>
                        <button onClick={e => { e.stopPropagation(); deleteSession(sess.id) }} className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-xs cursor-pointer text-red-500">✕</button>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          {[
                            {label:"🔥 Warm-up", val:sess.warmup, color:"#f97316"},
                            {label:"🎯 Core", val:sess.activity, color:sc},
                            {label:"🌙 Cool-down", val:sess.cooldown, color:"#8b5cf6"}
                          ].map(b => (
                            <div key={b.label} className="bg-[#F9F7F3] rounded-xl p-3" style={{borderTop:`2px solid ${b.color}`}}>
                              <div className="text-xs font-bold mb-1" style={{color:b.color}}>{b.label}</div>
                              <div className="text-xs font-semibold text-gray-700">{b.val}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {getEquipment(sess).map(e => (
                            <span key={e} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{e}</span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setCheckedItems({}); setTab("checklist"); setSelectedId(sess.id) }}
                            className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs font-semibold cursor-pointer">
                            🎒 Build Checklist
                          </button>
                          <button onClick={() => { setPrintSession(sess); setTab("print") }}
                            className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-semibold cursor-pointer">
                            🖨️ Print Card
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {tab === "checklist" && (
        <div>
          {focusSess ? (
            <div className="rounded-2xl p-4 mb-5 border" style={{background:SKILL_COLORS[focusSess.skill]+"15", borderColor:SKILL_COLORS[focusSess.skill]+"44"}}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Packing for</p>
              <p className="font-black text-lg text-[#1A3B2E]">{focusSess.activity}</p>
              <p className="text-sm text-gray-500">{fmtDate(focusSess.session_date)} · {focusSess.class_name}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-sm text-gray-500">
              No session selected. Go to Term Planner → select a session → Build Checklist.
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-[#1A3B2E]">Pack Progress</p>
              <p className="font-black text-lg" style={{color:checkedCount===equipment.length?"#22c55e":"#f97316"}}>{checkedCount}/{equipment.length}</p>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{width:`${(checkedCount/equipment.length)*100}%`, background:checkedCount===equipment.length?"#22c55e":"#2563eb"}} />
            </div>
            {checkedCount===equipment.length && <p className="text-sm font-bold text-green-600 mt-2">✅ All packed — you are ready to go!</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="px-5 py-3 bg-[#1A3B2E] text-white text-xs font-bold uppercase tracking-wider">🔒 Always Carry</div>
            {ALWAYS_CARRY.map(item => (
              <div key={item} onClick={() => toggleCheck(item)}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 cursor-pointer transition-colors"
                style={{background:checkedItems[item]?"#f0fdf4":"#fff"}}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                  style={{background:checkedItems[item]?"#1A3B2E":"#fff", border:`2px solid ${checkedItems[item]?"#1A3B2E":"#e2e8f0"}`}}>
                  {checkedItems[item] && <span className="text-white text-xs font-black">✓</span>}
                </div>
                <span className="text-sm font-medium" style={{color:checkedItems[item]?"#374151":"#1e293b", textDecoration:checkedItems[item]?"line-through":"none", opacity:checkedItems[item]?0.6:1}}>{item}</span>
                {checkedItems[item] && <span className="ml-auto text-xs text-green-600 font-bold">✓ packed</span>}
              </div>
            ))}
          </div>

          {focusSess && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
              <div className="px-5 py-3 text-white text-xs font-bold uppercase tracking-wider" style={{background:SKILL_COLORS[focusSess.skill]||"#2563eb"}}>
                🎒 Session Equipment
              </div>
              {equipment.filter(e => !ALWAYS_CARRY.includes(e)).map(item => (
                <div key={item} onClick={() => toggleCheck(item)}
                  className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 cursor-pointer"
                  style={{background:checkedItems[item]?"#f0fdf4":"#fff"}}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{background:checkedItems[item]?SKILL_COLORS[focusSess.skill]:"#fff", border:`2px solid ${checkedItems[item]?SKILL_COLORS[focusSess.skill]:"#e2e8f0"}`}}>
                    {checkedItems[item] && <span className="text-white text-xs font-black">✓</span>}
                  </div>
                  <span className="text-sm font-medium" style={{textDecoration:checkedItems[item]?"line-through":"none", opacity:checkedItems[item]?0.6:1}}>{item}</span>
                  {checkedItems[item] && <span className="ml-auto text-xs text-green-600 font-bold">✓ packed</span>}
                </div>
              ))}
            </div>
          )}

          <button onClick={() => setCheckedItems({})} className="w-full py-3 bg-white border border-gray-200 rounded-2xl text-gray-400 text-sm font-semibold cursor-pointer">
            ↺ Reset Checklist
          </button>
        </div>
      )}

      {tab === "print" && (
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Choose session to print</p>
            <select value={printSession?.id||""} onChange={e => setPrintSession(sessions.find(s => s.id===e.target.value)||null)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
              <option value="">— Select a session —</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{fmtShort(s.session_date)} · {s.skill} · {s.activity}</option>)}
            </select>
          </div>

          {printSession ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-lg mx-auto border border-gray-200">
              <div className="p-6 text-white" style={{background:`linear-gradient(135deg,#1A3B2E,${SKILL_COLORS[printSession.skill]||"#2563eb"})`}}>
                <div className="text-xs font-bold opacity-75 uppercase tracking-widest mb-2">KhelSakha · MGTF Session Card</div>
                <div className="font-black text-xl mb-1">{printSession.activity}</div>
                <div className="text-sm opacity-85 mb-4">{printSession.skill} · Week {printSession.week_number}</div>
                <div className="flex gap-4 text-xs opacity-80 pt-3 border-t border-white/20">
                  <span>📅 {fmtDate(printSession.session_date)}</span>
                  <span>📚 {printSession.class_name||"—"}</span>
                </div>
              </div>
              <div className="p-5">
                {[
                  {label:"🔥 Warm-up", time:"4–6 min", val:printSession.warmup, color:"#f97316", bg:"#fff7ed"},
                  {label:"🎯 Core Activity", time:"10–15 min", val:printSession.activity, color:SKILL_COLORS[printSession.skill]||"#2563eb", bg:"#eff6ff"},
                  {label:"🌙 Cool-down", time:"4–6 min", val:printSession.cooldown, color:"#8b5cf6", bg:"#f5f3ff"},
                  {label:"📢 Wrap-up", time:"2–3 min", val:"Share nutrition tip + life skill message", color:"#059669", bg:"#f0fdf4"},
                ].map(block => (
                  <div key={block.label} className="flex gap-3 mb-3 p-3 rounded-xl" style={{background:block.bg, borderLeft:`4px solid ${block.color}`}}>
                    <div>
                      <div className="text-xs font-bold mb-1" style={{color:block.color}}>{block.label} · {block.time}</div>
                      <div className="text-sm font-semibold text-gray-700">{block.val}</div>
                    </div>
                  </div>
                ))}
                <div className="bg-gray-50 rounded-xl p-4 mt-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">🎒 Equipment</div>
                  <div className="flex flex-wrap gap-1.5">
                    {getEquipment(printSession).map(e => (
                      <span key={e} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-lg font-medium">{e}</span>
                    ))}
                  </div>
                </div>
                {printSession.notes && (
                  <div className="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-xl">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Notes</div>
                    <div className="text-sm text-gray-600">{printSession.notes}</div>
                  </div>
                )}
              </div>
              <div className="px-5 pb-5">
                <button onClick={() => window.print()} className="w-full py-3 bg-[#1A3B2E] text-white rounded-xl font-bold text-sm cursor-pointer">
                  🖨️ Print / Save as PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">🖨️</p>
              <p>Select a session above to preview its card</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
