import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

const CoachEvaluations = () => {
  const { profile } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [evals, setEvals] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({teacher_id:"",attire:3,punctuality:3,lesson_execution:3,equipment_use:3,student_engagement:3,conduct:3,safety:3,physical_punishment_flag:false,incident_description:"",overall_notes:""})

  useEffect(() => { fetchTeachers(); fetchEvals() }, [])

  const fetchTeachers = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("school_id", profile?.school_id).eq("role","pe_teacher")
    setTeachers(data || [])
  }

  const fetchEvals = async () => {
    const { data } = await supabase.from("coach_evaluations").select("*, profiles!teacher_id(full_name)").eq("school_id", profile?.school_id).order("evaluated_at", {ascending:false})
    setEvals(data || [])
  }

  const save = async () => {
    await supabase.from("coach_evaluations").insert([{...form, school_id: profile?.school_id, evaluated_by: profile?.id}])
    setShowForm(false)
    setForm({teacher_id:"",attire:3,punctuality:3,lesson_execution:3,equipment_use:3,student_engagement:3,conduct:3,safety:3,physical_punishment_flag:false,incident_description:"",overall_notes:""})
    fetchEvals()
  }

  const categories = ["attire","punctuality","lesson_execution","equipment_use","student_engagement","conduct","safety"]
  const getAvg = (ev) => {
    const total = categories.reduce((s,c) => s + (ev[c] || 0), 0)
    return (total / categories.length).toFixed(1)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Coach Evaluations</h1>
          <p className="text-gray-600 mt-1">Evaluate PE teacher performance</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-[#E76F51] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#d65f41]">+ New Evaluation</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 max-w-2xl">
          <h2 className="font-bold text-[#1A3B2E] mb-4">New Evaluation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Teacher</label>
              <select value={form.teacher_id} onChange={e => setForm({...form,teacher_id:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                <option value="">Choose teacher...</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </div>
            {categories.map(cat => (
              <div key={cat}>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700 capitalize">{cat.replace(/_/g," ")}</label>
                  <span className="text-sm font-bold text-[#E76F51]">{form[cat]}/5</span>
                </div>
                <input type="range" min="1" max="5" value={form[cat]} onChange={e => setForm({...form,[cat]:parseInt(e.target.value)})} className="w-full accent-[#E76F51]" />
              </div>
            ))}
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl">
              <input type="checkbox" id="flag" checked={form.physical_punishment_flag} onChange={e => setForm({...form,physical_punishment_flag:e.target.checked})} className="w-4 h-4" />
              <label htmlFor="flag" className="text-sm font-medium text-red-700">Physical punishment incident reported</label>
            </div>
            {form.physical_punishment_flag && (
              <textarea value={form.incident_description} onChange={e => setForm({...form,incident_description:e.target.value})} placeholder="Describe the incident..." rows={3} className="w-full px-4 py-2 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400" />
            )}
            <textarea value={form.overall_notes} onChange={e => setForm({...form,overall_notes:e.target.value})} placeholder="Overall notes and feedback..." rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-600">Cancel</button>
              <button onClick={save} disabled={!form.teacher_id} className="flex-1 py-2 bg-[#E76F51] text-white rounded-xl disabled:opacity-50">Submit Evaluation</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {evals.map(ev => (
          <div key={ev.id} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-[#1A3B2E]">{ev.profiles?.full_name || "Unknown Teacher"}</p>
                <p className="text-xs text-gray-500">{new Date(ev.evaluated_at).toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#E76F51]">{getAvg(ev)}</p>
                <p className="text-xs text-gray-500">Overall</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <div key={cat} className="text-center bg-[#F9F7F3] rounded-lg p-2">
                  <p className="text-lg font-bold text-[#1A3B2E]">{ev[cat]}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{cat.replace(/_/g," ")}</p>
                </div>
              ))}
            </div>
            {ev.physical_punishment_flag && <div className="mt-3 p-2 bg-red-50 rounded-lg text-xs text-red-700">⚠️ Physical punishment incident reported</div>}
            {ev.overall_notes && <p className="mt-3 text-sm text-gray-600 border-t pt-3">{ev.overall_notes}</p>}
          </div>
        ))}
        {evals.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
            <p className="text-4xl mb-3">📋</p>
            <p>No evaluations yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoachEvaluations
