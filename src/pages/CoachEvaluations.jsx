import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"
import { CheckCircle } from "lucide-react"

const CATEGORIES = [
  { key:"attire", label:"Attire & Appearance", desc:"Professional dress, sports kit, ID card" },
  { key:"punctuality", label:"Punctuality", desc:"On time for sessions, registers attendance" },
  { key:"lesson_execution", label:"Lesson Execution", desc:"Clear instructions, good pacing, structured session" },
  { key:"equipment_use", label:"Equipment Use", desc:"Safe setup, proper use, post-session storage" },
  { key:"student_engagement", label:"Student Engagement", desc:"All students involved, differentiation, feedback given" },
  { key:"conduct", label:"Professional Conduct", desc:"Respectful language, role model behaviour" },
  { key:"safety", label:"Safety Awareness", desc:"Warm-up, cool-down, injury prevention followed" },
]

const CoachEvaluations = () => {
  const { profile } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [scores, setScores] = useState({ attire:3, punctuality:3, lesson_execution:3, equipment_use:3, student_engagement:3, conduct:3, safety:3 })
  const [punishmentFlag, setPunishmentFlag] = useState(false)
  const [incidentDesc, setIncidentDesc] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => { if (profile?.school_id) { fetchTeachers(); fetchEvaluations() } }, [profile?.school_id])

  const showToast = (msg, type="success") => {
    setToast({msg, type})
    setTimeout(() => setToast(null), 3000)
  }

  const fetchTeachers = async () => {
    const { data } = await supabase
      .from("teachers").select("*")
      .eq("school_id", profile.school_id)
      .eq("status", "active")
      .order("full_name")
    setTeachers(data || [])
  }

  const fetchEvaluations = async () => {
    const { data } = await supabase
      .from("coach_evaluations").select("*")
      .eq("school_id", profile.school_id)
      .order("evaluated_at", {ascending:false})
    setEvaluations(data || [])
  }

  const save = async () => {
    if (!selectedTeacher) { showToast("Please select a teacher", "error"); return }
    setSaving(true)
    const avg = Object.values(scores).reduce((a,b)=>a+b,0) / 7
    const { error } = await supabase.from("coach_evaluations").insert([{
      school_id: profile.school_id,
      evaluated_by: profile.id,
      teacher_name: teachers.find(t=>t.id===selectedTeacher)?.full_name,
      teacher_id_ref: selectedTeacher,
      ...scores,
      physical_punishment_flag: punishmentFlag,
      incident_description: incidentDesc || null,
      overall_notes: notes || null,
      overall_score: parseFloat(avg.toFixed(1))
    }])
    setSaving(false)
    if (error) { showToast(`Error: ${error.message}`, "error"); return }
    showToast("Evaluation saved successfully")
    setShowForm(false)
    setSelectedTeacher("")
    setScores({ attire:3, punctuality:3, lesson_execution:3, equipment_use:3, student_engagement:3, conduct:3, safety:3 })
    setPunishmentFlag(false); setIncidentDesc(""); setNotes("")
    fetchEvaluations()
  }

  const avg = (Object.values(scores).reduce((a,b)=>a+b,0)/7).toFixed(1)
  const getGrade = (s) => s>=4.5?"Excellent":s>=3.5?"Good":s>=2.5?"Satisfactory":s>=1.5?"Needs Improvement":"Poor"
  const getColor = (s) => s>=4.5?"text-green-600":s>=3.5?"text-blue-600":s>=2.5?"text-amber-600":"text-red-600"

  if (teachers.length === 0 && !showForm) return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Coach Evaluations</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <p className="text-5xl mb-4">👨‍🏫</p>
        <h3 className="font-bold text-[#1A3B2E] text-lg mb-2">No teachers found</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Add your PE teachers and sports coaches first before running evaluations.
        </p>
        <Link to="/teachers" className="bg-[#E76F51] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d65f41] transition-colors inline-block">
          Add Teachers →
        </Link>
      </div>
    </div>
  )

  return (
    <div>
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-white text-sm font-semibold ${toast.type==="error"?"bg-red-500":"bg-[#1A3B2E]"}`}>
          {toast.type!=="error" && <CheckCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Coach Evaluations</h1>
          <p className="text-gray-600 mt-1">{evaluations.length} evaluations completed</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="bg-[#E76F51] text-white px-6 py-2 rounded-full hover:bg-[#d65f41] transition-colors text-sm font-medium">
            + New Evaluation
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl mb-6">
          <h2 className="text-xl font-bold text-[#1A3B2E] mb-6">New Coach Evaluation</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Teacher *</label>
              <select value={selectedTeacher} onChange={e=>setSelectedTeacher(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                <option value="">Choose teacher...</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name} — {t.role}</option>)}
              </select>
            </div>

            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <div key={cat.key}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-[#1A3B2E]">{cat.label}</p>
                      <p className="text-xs text-gray-400">{cat.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-[#E76F51]">{scores[cat.key]}</span>
                      <span className="text-xs text-gray-400">/5</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(v => (
                      <button key={v} type="button" onClick={() => setScores(s=>({...s,[cat.key]:v}))}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${
                          scores[cat.key]===v
                            ? "bg-[#1A3B2E] text-white border-[#1A3B2E]"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1A3B2E] text-white rounded-xl">
              <span className="font-semibold">Overall Score</span>
              <div className="text-right">
                <span className="text-3xl font-black">{avg}</span>
                <span className="text-white/60 text-sm ml-1">/5</span>
                <p className="text-xs text-white/70 mt-0.5">{getGrade(parseFloat(avg))}</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-3 mb-2">
                <input type="checkbox" id="punishment" checked={punishmentFlag} onChange={e=>setPunishmentFlag(e.target.checked)} className="w-4 h-4 accent-red-500" />
                <label htmlFor="punishment" className="text-sm font-semibold text-red-700">⚠️ Physical punishment observed</label>
              </div>
              {punishmentFlag && (
                <textarea value={incidentDesc} onChange={e=>setIncidentDesc(e.target.value)} rows={2}
                  className="w-full px-3 py-2 border border-red-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 mt-2"
                  placeholder="Describe the incident..." />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Notes</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm"
                placeholder="General observations, strengths, areas for improvement..." />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-600 text-sm">Cancel</button>
              <button type="button" onClick={save} disabled={!selectedTeacher||saving}
                className="flex-1 py-2.5 bg-[#E76F51] text-white rounded-xl disabled:opacity-50 text-sm font-semibold hover:bg-[#d65f41]">
                {saving?"Saving...":"Save Evaluation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {evaluations.length > 0 && (
        <div className="space-y-3">
          {evaluations.map(ev => (
            <div key={ev.id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-[#1A3B2E]">{ev.teacher_name || "Teacher"}</p>
                  <p className="text-xs text-gray-400">{new Date(ev.evaluated_at).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"})}</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${getColor(ev.overall_score||0)}`}>{ev.overall_score||"—"}</p>
                  <p className="text-xs text-gray-400">{getGrade(ev.overall_score||0)}</p>
                </div>
              </div>
              {ev.physical_punishment_flag && (
                <div className="p-2 bg-red-50 rounded-lg text-xs text-red-600 font-semibold mb-2">⚠️ Physical punishment flagged</div>
              )}
              {ev.overall_notes && <p className="text-sm text-gray-500">{ev.overall_notes}</p>}
            </div>
          ))}
        </div>
      )}

      {evaluations.length === 0 && !showForm && (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium text-gray-500">No evaluations yet</p>
          <p className="text-sm mt-1">Click New Evaluation to assess a teacher</p>
        </div>
      )}
    </div>
  )
}

export default CoachEvaluations
