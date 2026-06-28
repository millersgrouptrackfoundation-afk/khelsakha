import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"

const SkillScores = () => {
  const { profile } = useAuth()
  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState(null)
  const [scores, setScores] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({speed:5,stamina:5,strength:5,agility:5,technique:5,teamwork:5,notes:""})
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchStudents() }, [])
  useEffect(() => { if (selected) fetchScores() }, [selected])

  const fetchStudents = async () => {
    const { data } = await supabase.from("students").select("*").eq("school_id", profile?.school_id).order("full_name")
    setStudents(data || [])
  }

  const fetchScores = async () => {
    const { data } = await supabase.from("skill_scores").select("*").eq("student_id", selected).order("assessed_at", {ascending: false})
    setScores(data || [])
  }

  const saveScore = async () => {
    setLoading(true)
    await supabase.from("skill_scores").insert([{...form, student_id: selected, school_id: profile?.school_id, assessed_by: profile?.id}])
    setShowForm(false)
    fetchScores()
    setLoading(false)
  }

  const latest = scores[0]
  const radarData = latest ? [
    {skill:"Speed", value: latest.speed},
    {skill:"Stamina", value: latest.stamina},
    {skill:"Strength", value: latest.strength},
    {skill:"Agility", value: latest.agility},
    {skill:"Technique", value: latest.technique},
    {skill:"Teamwork", value: latest.teamwork},
  ] : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Skill Scores</h1>
        <p className="text-gray-600 mt-1">Track and assess student athletic skills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="font-semibold text-[#1A3B2E] mb-3">Select Student</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {students.map(s => (
              <button key={s.id} onClick={() => { setSelected(s.id); setShowForm(false) }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selected === s.id ? "bg-[#E76F51] text-white" : "bg-[#F9F7F3] text-[#1A3B2E] hover:bg-[#f0ece6]"}`}>
                <p className="font-medium text-sm">{s.full_name}</p>
                <p className="text-xs opacity-70">Roll: {s.roll_number || "N/A"}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selected && (
            <>
              {latest && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#1A3B2E]">Latest Assessment</h3>
                    <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[#E76F51] text-white rounded-full text-sm hover:bg-[#d65f41] transition-colors">+ New Score</button>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" tick={{fontSize:12}} />
                        <Radar dataKey="value" stroke="#E76F51" fill="#E76F51" fillOpacity={0.3} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {radarData.map(d => (
                      <div key={d.skill} className="text-center bg-[#F9F7F3] rounded-xl p-3">
                        <p className="text-2xl font-bold text-[#E76F51]">{d.value}</p>
                        <p className="text-xs text-gray-500">{d.skill}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!latest && !showForm && (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <p className="text-4xl mb-4">📊</p>
                  <p className="text-gray-500 mb-4">No scores yet for this student</p>
                  <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-[#E76F51] text-white rounded-full hover:bg-[#d65f41] transition-colors">Add First Score</button>
                </div>
              )}

              {showForm && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-semibold text-[#1A3B2E] mb-4">New Assessment</h3>
                  <div className="space-y-4">
                    {["speed","stamina","strength","agility","technique","teamwork"].map(skill => (
                      <div key={skill}>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-gray-700 capitalize">{skill}</label>
                          <span className="text-sm font-bold text-[#E76F51]">{form[skill]}/10</span>
                        </div>
                        <input type="range" min="1" max="10" value={form[skill]}
                          onChange={e => setForm({...form, [skill]: parseInt(e.target.value)})}
                          className="w-full accent-[#E76F51]" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="Coach notes..." />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
                      <button onClick={saveScore} disabled={loading} className="flex-1 py-2 bg-[#E76F51] text-white rounded-xl hover:bg-[#d65f41] disabled:opacity-50">{loading ? "Saving..." : "Save Score"}</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {!selected && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <p className="text-4xl mb-4">🏃</p>
              <p className="text-gray-500">Select a student to view or add skill scores</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SkillScores
