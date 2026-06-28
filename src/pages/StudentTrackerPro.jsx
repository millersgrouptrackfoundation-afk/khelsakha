import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

const SKILLS = ["Skipping","Throwing","Catching","Dodging","Landing","Side Stepping"]
const SKILL_SHORT = { Skipping:"SKP", Throwing:"THR", Catching:"CAT", Dodging:"DOD", Landing:"LND", "Side Stepping":"SST" }
const STAGES = [
  { level:0, label:"—", color:"#475569", bg:"#1e293b", text:"Not assessed" },
  { level:1, label:"Stage 1", color:"#ef4444", bg:"#450a0a", text:"Initial" },
  { level:2, label:"Stage 2", color:"#f59e0b", bg:"#451a03", text:"Transition" },
  { level:3, label:"Stage 3", color:"#22c55e", bg:"#052e16", text:"Mature" },
]
const FLAGS = [
  { id:"support", emoji:"🔴", label:"Needs Support", color:"#ef4444" },
  { id:"parents", emoji:"🟡", label:"Show Parents", color:"#f59e0b" },
  { id:"talent", emoji:"⭐", label:"Talent", color:"#22c55e" },
  { id:"watch", emoji:"🔵", label:"Watch Closely", color:"#3b82f6" },
]
const OBS_TEMPLATES = [
  "Struggling with hop phase","Great throw today — opposite foot forward",
  "Balance improved significantly","Needs encouragement — shy in group",
  "Excellent teamwork and leadership","Fast learner — move to Stage 3",
  "Absent — follow up next session","Brilliant catch — ready for distance",
  "Needs one-to-one support","Showed outstanding sportsmanship",
]

function todayStr() { return new Date().toISOString().split("T")[0] }
function fmtDate(d) { return new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short" }) }
function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() }
function avatarColor(name) {
  const colors = ["#f97316","#3b82f6","#22c55e","#a855f7","#ec4899","#0ea5e9","#14b8a6","#f59e0b"]
  let h = 0; for (const c of name) h = (h*31+c.charCodeAt(0))&0xffff
  return colors[h%colors.length]
}

export default function StudentTrackerPro() {
  const { profile } = useAuth()
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState("")
  const [view, setView] = useState("roster")
  const [activeTab, setActiveTab] = useState("roster")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [search, setSearch] = useState("")
  const [filterFlag, setFilterFlag] = useState(null)
  const [obsModal, setObsModal] = useState(null)
  const [obsText, setObsText] = useState("")
  const [obsSkill, setObsSkill] = useState("")
  const [skillModal, setSkillModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchClasses() }, [profile])
  useEffect(() => { if (selectedClassId) fetchStudents() }, [selectedClassId])

  const fetchClasses = async () => {
    if (!profile?.school_id) return
    const { data } = await supabase.from("classes").select("*").eq("school_id", profile.school_id).order("name")
    setClasses(data || [])
    if (data?.length > 0) setSelectedClassId(data[0].id)
  }

  const fetchStudents = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("students")
      .select("*, tracker_skills(*), tracker_observations(*), tracker_attendance(*)")
      .eq("class_id", selectedClassId)
      .order("full_name")
    setStudents(data || [])
    setLoading(false)
  }

  const getSkillLevel = (student, skill) => {
    const rec = student.tracker_skills?.find(s => s.skill_name === skill)
    return rec?.stage_level || 0
  }

  const getFlags = (student) => {
    return student.tracker_skills?.find(s => s.skill_name === "__flags__")?.notes
      ? JSON.parse(student.tracker_skills.find(s => s.skill_name === "__flags__").notes)
      : []
  }

  const getObs = (student) => student.tracker_observations || []
  const getAtt = (student) => student.tracker_attendance || []

  const updateSkill = async (studentId, skill, level) => {
    setSaving(true)
    const existing = students.find(s => s.id===studentId)?.tracker_skills?.find(s => s.skill_name===skill)
    if (existing) {
      await supabase.from("tracker_skills").update({ stage_level:level }).eq("id", existing.id)
    } else {
      await supabase.from("tracker_skills").insert([{
        student_id:studentId, school_id:profile.school_id,
        skill_name:skill, stage_level:level
      }])
    }
    setSaving(false)
    setSkillModal(null)
    fetchStudents()
  }

  const toggleFlag = async (studentId, flagId) => {
    const stu = students.find(s => s.id===studentId)
    const currentFlags = getFlags(stu)
    const newFlags = currentFlags.includes(flagId)
      ? currentFlags.filter(f => f!==flagId)
      : [...currentFlags, flagId]
    const existing = stu.tracker_skills?.find(s => s.skill_name==="__flags__")
    if (existing) {
      await supabase.from("tracker_skills").update({ notes:JSON.stringify(newFlags) }).eq("id", existing.id)
    } else {
      await supabase.from("tracker_skills").insert([{
        student_id:studentId, school_id:profile.school_id,
        skill_name:"__flags__", stage_level:0, notes:JSON.stringify(newFlags)
      }])
    }
    fetchStudents()
  }

  const saveObs = async () => {
    if (!obsText.trim() || !obsModal) return
    await supabase.from("tracker_observations").insert([{
      student_id:obsModal, school_id:profile.school_id,
      teacher_id:profile.id, observation_date:todayStr(),
      observation_text:obsText.trim(), skill_tag:obsSkill||null
    }])
    setObsModal(null); setObsText(""); setObsSkill("")
    fetchStudents()
  }

  const toggleAttendance = async (studentId) => {
    const stu = students.find(s => s.id===studentId)
    const existing = getAtt(stu).find(a => a.attendance_date===todayStr())
    if (existing) {
      const next = existing.status==="present" ? "absent" : "present"
      await supabase.from("tracker_attendance").update({ status:next }).eq("id", existing.id)
    } else {
      await supabase.from("tracker_attendance").insert([{
        student_id:studentId, school_id:profile.school_id,
        teacher_id:profile.id, attendance_date:todayStr(), status:"present"
      }])
    }
    fetchStudents()
  }

  const markAll = async (status) => {
    for (const stu of filtered) {
      const existing = getAtt(stu).find(a => a.attendance_date===todayStr())
      if (existing) {
        await supabase.from("tracker_attendance").update({ status }).eq("id", existing.id)
      } else {
        await supabase.from("tracker_attendance").insert([{
          student_id:stu.id, school_id:profile.school_id,
          teacher_id:profile.id, attendance_date:todayStr(), status
        }])
      }
    }
    fetchStudents()
  }

  const filtered = students.filter(s => {
    if (search && !s.full_name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterFlag && !getFlags(s).includes(filterFlag)) return false
    return true
  })

  const presentToday = students.filter(s => getAtt(s).find(a => a.attendance_date===todayStr() && a.status==="present")).length
  const flaggedCount = students.filter(s => getFlags(s).length > 0).length
  const talentCount = students.filter(s => getFlags(s).includes("talent")).length

  if (view === "profile" && selectedStudent) {
    const stu = students.find(s => s.id===selectedStudent)
    if (!stu) { setView("roster"); return null }
    const ac = avatarColor(stu.full_name)
    const att = getAtt(stu)
    const presentDays = att.filter(a => a.status==="present").length
    const flags = getFlags(stu)
    const obs = getObs(stu)

    return (
      <div className="min-h-screen bg-[#0a0f1e] text-white" style={{fontFamily:"'Inter',system-ui,sans-serif"}}>
        <div className="p-5" style={{background:`linear-gradient(135deg,${ac}33,#0a0f1e)`}}>
          <button onClick={() => setView("roster")} className="mb-5 px-4 py-2 bg-[#0f172a] border border-[#1e293b] rounded-xl text-gray-400 text-sm font-bold cursor-pointer">← Back</button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0" style={{background:ac}}>{initials(stu.full_name)}</div>
            <div className="flex-1">
              <div className="font-black text-xl">{stu.full_name}</div>
              <div className="text-gray-400 text-sm mt-1">Roll {stu.roll_number} · {classes.find(c=>c.id===selectedClassId)?.name}</div>
            </div>
            <button onClick={() => setObsModal(stu.id)} className="px-4 py-2 rounded-xl text-white text-sm font-bold border-none cursor-pointer" style={{background:ac}}>+ Log</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {FLAGS.map(f => {
              const on = flags.includes(f.id)
              return (
                <button key={f.id} onClick={() => toggleFlag(stu.id, f.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all"
                  style={{borderColor:on?f.color:"#1e293b",background:on?f.color+"22":"transparent",color:on?f.color:"#475569"}}>
                  {f.emoji} {f.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-[#0f172a] rounded-2xl p-4 border border-[#1e293b]">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attendance</div>
              <div className="text-sm font-bold text-green-400">{presentDays}/{att.length} sessions</div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {att.slice(-20).map(a => (
                <div key={a.id} title={a.attendance_date} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{background:a.status==="present"?"#22c55e":"#ef444433",color:"#fff"}}>
                  {new Date(a.attendance_date).getDate()}
                </div>
              ))}
              {att.length===0 && <div className="text-gray-600 text-sm">No attendance recorded yet</div>}
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-2xl p-4 border border-[#1e293b]">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Skill Levels</div>
            {SKILLS.map(skill => {
              const level = getSkillLevel(stu, skill)
              const stage = STAGES[level]
              return (
                <div key={skill} onClick={() => setSkillModal({studentId:stu.id,skill})}
                  className="flex items-center gap-3 py-2.5 border-b border-[#1e293b] cursor-pointer">
                  <div className="flex-1 font-semibold text-sm">{skill}</div>
                  <div className="flex gap-1">
                    {[1,2,3].map(l => <div key={l} className="w-2.5 h-2.5 rounded-full" style={{background:level>=l?STAGES[l].color:"#1e293b"}} />)}
                  </div>
                  <div className="text-xs font-bold w-24 text-right" style={{color:stage.color}}>{stage.text}</div>
                  <div className="text-gray-600 text-xs">›</div>
                </div>
              )
            })}
          </div>

          <div className="bg-[#0f172a] rounded-2xl p-4 border border-[#1e293b]">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Observations ({obs.length})</div>
            </div>
            {obs.length===0 && <div className="text-gray-600 text-sm">No observations yet. Tap + Log above.</div>}
            {obs.map(o => (
              <div key={o.id} className="py-2.5 border-b border-[#1e293b]">
                {o.skill_tag && <span className="text-xs font-bold px-2 py-0.5 rounded mr-2" style={{background:"#431407",color:"#f97316"}}>{o.skill_tag}</span>}
                <span className="text-sm text-gray-300">{o.observation_text}</span>
                <div className="text-xs text-gray-600 mt-1">{fmtDate(o.observation_date)}</div>
              </div>
            ))}
          </div>
        </div>

        {obsModal && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center">
            <div className="bg-[#0f172a] rounded-t-3xl w-full max-w-lg p-6 border border-[#1e293b] max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <div className="font-bold text-lg">Log Note — {students.find(s=>s.id===obsModal)?.full_name?.split(" ")[0]}</div>
                <button onClick={() => { setObsModal(null); setObsText(""); setObsSkill("") }} className="text-gray-500 text-xl bg-transparent border-none cursor-pointer">✕</button>
              </div>
              <div className="mb-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Notes</div>
                <div className="flex gap-2 flex-wrap">
                  {OBS_TEMPLATES.map((t,i) => (
                    <button key={i} onClick={() => setObsText(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all"
                      style={{background:obsText===t?"#2563eb":"#0a0f1e",color:obsText===t?"#fff":"#94a3b8",borderColor:obsText===t?"#2563eb":"#1e293b"}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={obsText} onChange={e => setObsText(e.target.value)} placeholder="Or type your own note..." rows={3}
                className="w-full px-4 py-3 bg-[#0a0f1e] text-white rounded-xl border border-[#1e293b] outline-none text-sm resize-none mb-4" />
              <div className="mb-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tag a Skill (optional)</div>
                <div className="flex gap-2 flex-wrap">
                  {["", ...SKILLS].map(s => (
                    <button key={s} onClick={() => setObsSkill(s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all"
                      style={{background:obsSkill===s?"#431407":"#0a0f1e",color:obsSkill===s?"#f97316":"#64748b",borderColor:obsSkill===s?"#f97316":"#1e293b"}}>
                      {s||"General"}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={saveObs} disabled={!obsText.trim()}
                className="w-full py-4 rounded-xl text-white font-bold text-sm border-none cursor-pointer disabled:opacity-50"
                style={{background:obsText.trim()?"#2563eb":"#1e293b"}}>
                Save Note
              </button>
            </div>
          </div>
        )}

        {skillModal && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-5">
            <div className="bg-[#0f172a] rounded-2xl w-full max-w-sm p-6 border border-[#1e293b]">
              <div className="flex justify-between items-center mb-2">
                <div className="font-black text-lg">{skillModal.skill}</div>
                <button onClick={() => setSkillModal(null)} className="text-gray-500 text-xl bg-transparent border-none cursor-pointer">✕</button>
              </div>
              <div className="text-gray-500 text-sm mb-5">{students.find(s=>s.id===skillModal.studentId)?.full_name}</div>
              {STAGES.map(stage => {
                const current = getSkillLevel(students.find(s=>s.id===skillModal.studentId), skillModal.skill)
                return (
                  <div key={stage.level} onClick={() => updateSkill(skillModal.studentId, skillModal.skill, stage.level)}
                    className="flex items-center gap-3 p-4 rounded-xl mb-2 cursor-pointer border transition-all"
                    style={{background:current===stage.level?stage.bg:"#0a0f1e",borderColor:current===stage.level?stage.color:"#1e293b"}}>
                    <div className="flex gap-1">
                      {stage.level===0 ? <div className="w-2.5 h-2.5 rounded-full bg-[#334155]" /> :
                        [1,2,3].map(l => <div key={l} className="w-2.5 h-2.5 rounded-full" style={{background:l<=stage.level?stage.color:"#1e293b"}} />)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm" style={{color:stage.color}}>{stage.label} — {stage.text}</div>
                    </div>
                    {current===stage.level && <div style={{color:stage.color}}>✓</div>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white" style={{fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div className="bg-[#0f172a] border-b border-[#1e293b] p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Class</div>
            <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}
              className="bg-transparent text-white font-black text-lg border-none outline-none cursor-pointer">
              {classes.map(c => <option key={c.id} value={c.id} className="bg-[#0f172a]">{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            {label:"Present", val:`${presentToday}/${students.length}`, color:"#22c55e"},
            {label:"Flagged", val:flaggedCount, color:"#ef4444"},
            {label:"Talent", val:talentCount, color:"#f59e0b"},
          ].map(s => (
            <div key={s.label} className="bg-[#0a0f1e] rounded-xl p-3 text-center border border-[#1e293b]">
              <div className="text-xl font-black" style={{color:s.color}}>{s.val}</div>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-0">
          {[{id:"roster",label:"Roster"},{id:"skills",label:"Skills Grid"},{id:"flags",label:"Flags"}].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="flex-1 py-2.5 border-none bg-transparent font-bold text-sm cursor-pointer border-b-2 transition-all"
              style={{color:activeTab===t.id?"#2563eb":"#475569",borderBottomColor:activeTab===t.id?"#2563eb":"transparent"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-[#0f172a]">
        <input placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#0f172a] text-white rounded-xl border border-[#1e293b] outline-none text-sm mb-3" />
        <div className="flex gap-2 flex-wrap">
          {FLAGS.map(f => (
            <button key={f.id} onClick={() => setFilterFlag(filterFlag===f.id?null:f.id)}
              className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border transition-all"
              style={{borderColor:filterFlag===f.id?f.color:"#1e293b",background:filterFlag===f.id?f.color+"22":"transparent",color:filterFlag===f.id?f.color:"#475569"}}>
              {f.emoji} {f.label}
            </button>
          ))}
          {(search||filterFlag) && <button onClick={() => {setSearch("");setFilterFlag(null)}} className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border border-[#1e293b] text-red-400 bg-transparent">✕ Clear</button>}
        </div>
      </div>

      {activeTab==="roster" && (
        <div>
          <div className="px-4 py-2.5 border-b border-[#0f172a] flex gap-2 items-center">
            <span className="text-gray-500 text-xs font-bold">Mark all:</span>
            <button onClick={() => markAll("present")} className="px-3 py-1 rounded-lg border text-xs font-bold cursor-pointer" style={{borderColor:"#22c55e",background:"#22c55e22",color:"#22c55e"}}>✓ Present</button>
            <button onClick={() => markAll("absent")} className="px-3 py-1 rounded-lg border text-xs font-bold cursor-pointer" style={{borderColor:"#ef4444",background:"#ef444422",color:"#ef4444"}}>✕ Absent</button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading students...</div>
          ) : filtered.length===0 ? (
            <div className="text-center py-12 text-gray-600">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-bold">No students found</div>
            </div>
          ) : filtered.map(stu => {
            const att = getAtt(stu).find(a => a.attendance_date===todayStr())
            const ac = avatarColor(stu.full_name)
            const flags = getFlags(stu)
            const obs = getObs(stu)
            const todayObs = obs.filter(o => o.observation_date===todayStr())
            return (
              <div key={stu.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#0f172a]">
                <div onClick={() => toggleAttendance(stu.id)}
                  className="w-10 h-10 rounded-xl flex-shrink-0 cursor-pointer flex items-center justify-center text-base font-black border-2 transition-all"
                  style={{background:att?.status==="present"?"#22c55e":att?.status==="absent"?"#ef444433":"#0f172a",borderColor:att?.status==="present"?"#22c55e":att?.status==="absent"?"#ef4444":"#1e293b",color:att?.status==="present"?"#fff":att?.status==="absent"?"#ef4444":"#334155"}}>
                  {att?.status==="present"?"✓":att?.status==="absent"?"✕":<span className="text-xs">{stu.roll_number}</span>}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setSelectedStudent(stu.id); setView("profile") }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm truncate">{stu.full_name}</span>
                    {flags.map(fid => { const f=FLAGS.find(x=>x.id===fid); return f?<span key={fid} className="text-xs">{f.emoji}</span>:null })}
                  </div>
                  <div className="flex gap-1">
                    {SKILLS.slice(0,4).map(skill => {
                      const level = getSkillLevel(stu, skill)
                      return <div key={skill} className="w-2 h-2 rounded-full" style={{background:level===0?"#1e293b":STAGES[level].color}} />
                    })}
                    {todayObs.length>0 && <span className="text-xs font-bold ml-1" style={{color:"#f97316"}}>+{todayObs.length}</span>}
                  </div>
                </div>
                <button onClick={() => { setObsModal(stu.id); setSelectedStudent(stu.id) }}
                  className="w-9 h-9 rounded-xl border border-[#1e293b] bg-[#0f172a] text-base cursor-pointer flex-shrink-0">📝</button>
              </div>
            )
          })}
        </div>
      )}

      {activeTab==="skills" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#0f172a]">
                <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide sticky left-0 bg-[#0f172a]">Student</th>
                {SKILLS.map(s => <th key={s} className="py-3 px-2 text-center text-xs font-bold text-gray-500 min-w-[52px]">{SKILL_SHORT[s]}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((stu,i) => (
                <tr key={stu.id} style={{background:i%2===0?"#0a0f1e":"#0c1220"}}>
                  <td className="py-2 px-4 sticky left-0 cursor-pointer" style={{background:i%2===0?"#0a0f1e":"#0c1220"}}
                    onClick={() => { setSelectedStudent(stu.id); setView("profile") }}>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0" style={{background:avatarColor(stu.full_name)}}>{initials(stu.full_name)}</div>
                      <span className="font-semibold text-sm truncate max-w-[80px]">{stu.full_name.split(" ")[0]}</span>
                    </div>
                  </td>
                  {SKILLS.map(skill => {
                    const level = getSkillLevel(stu, skill)
                    const stage = STAGES[level]
                    return (
                      <td key={skill} className="py-2 px-1 text-center cursor-pointer" onClick={() => setSkillModal({studentId:stu.id,skill})}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto text-xs font-black border"
                          style={{background:level===0?"#0f172a":stage.bg,borderColor:level===0?"#1e293b":stage.color,color:stage.color}}>
                          {level===0?"—":level}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 text-xs text-gray-600">
            Tap any cell to update · <span style={{color:"#ef4444"}}>■ S1</span> · <span style={{color:"#f59e0b"}}>■ S2</span> · <span style={{color:"#22c55e"}}>■ S3</span>
          </div>
        </div>
      )}

      {activeTab==="flags" && (
        <div className="p-4">
          {FLAGS.map(flag => {
            const flagged = filtered.filter(s => getFlags(s).includes(flag.id))
            if (flagged.length===0) return null
            return (
              <div key={flag.id} className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{flag.emoji}</span>
                  <span className="font-bold text-sm" style={{color:flag.color}}>{flag.label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:flag.color+"22",color:flag.color}}>{flagged.length}</span>
                </div>
                {flagged.map(stu => (
                  <div key={stu.id} onClick={() => { setSelectedStudent(stu.id); setView("profile") }}
                    className="flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer border" style={{background:"#0f172a",borderColor:flag.color+"33"}}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0" style={{background:avatarColor(stu.full_name)}}>{initials(stu.full_name)}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{stu.full_name}</div>
                      <div className="text-xs text-gray-500">Roll {stu.roll_number} · {getObs(stu).length} notes</div>
                    </div>
                    <div className="flex gap-1">
                      {SKILLS.slice(0,4).map(skill => {
                        const level = getSkillLevel(stu, skill)
                        return <div key={skill} className="w-2 h-2 rounded-full" style={{background:level===0?"#1e293b":STAGES[level].color}} />
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
          {filtered.filter(s => getFlags(s).length>0).length===0 && (
            <div className="text-center py-12 text-gray-600">
              <div className="text-4xl mb-3">🏳️</div>
              <div className="font-bold">No flagged students</div>
              <div className="text-sm mt-2">Open a student profile and add a flag</div>
            </div>
          )}
        </div>
      )}

      {skillModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-5">
          <div className="bg-[#0f172a] rounded-2xl w-full max-w-sm p-6 border border-[#1e293b]">
            <div className="flex justify-between items-center mb-2">
              <div className="font-black text-lg">{skillModal.skill}</div>
              <button onClick={() => setSkillModal(null)} className="text-gray-500 text-xl bg-transparent border-none cursor-pointer">✕</button>
            </div>
            <div className="text-gray-500 text-sm mb-5">{students.find(s=>s.id===skillModal.studentId)?.full_name}</div>
            {STAGES.map(stage => {
              const current = getSkillLevel(students.find(s=>s.id===skillModal.studentId), skillModal.skill)
              return (
                <div key={stage.level} onClick={() => updateSkill(skillModal.studentId, skillModal.skill, stage.level)}
                  className="flex items-center gap-3 p-4 rounded-xl mb-2 cursor-pointer border transition-all"
                  style={{background:current===stage.level?stage.bg:"#0a0f1e",borderColor:current===stage.level?stage.color:"#1e293b"}}>
                  <div className="flex gap-1">
                    {stage.level===0?<div className="w-2.5 h-2.5 rounded-full bg-[#334155]"/>:
                      [1,2,3].map(l=><div key={l} className="w-2.5 h-2.5 rounded-full" style={{background:l<=stage.level?stage.color:"#1e293b"}}/>)}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm" style={{color:stage.color}}>{stage.label} — {stage.text}</div>
                  </div>
                  {current===stage.level && <div style={{color:stage.color}}>✓</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
