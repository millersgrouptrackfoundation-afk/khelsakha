import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { Plus, Trash2, Users } from "lucide-react"

const Classes = () => {
  const { profile } = useAuth()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ grade:"1", section:"", capacity:"30" })

  const grades = ["Playgroup","Nursery","KG","1","2","3","4","5","6","7","8","9","10","11","12"]
  const sections = ["A","B","C","D","E","F"]

  useEffect(() => { fetchClasses() }, [profile])

  const fetchClasses = async () => {
    if (!profile?.school_id) return
    setLoading(true)
    const { data } = await supabase
      .from("classes")
      .select("*, students(count)")
      .eq("school_id", profile.school_id)
      .order("grade")
    setClasses(data || [])
    setLoading(false)
  }

  const getClassName = (grade, section) => {
    if (section) return `Class ${grade}-${section}`
    return `Class ${grade}`
  }

  const save = async () => {
    if (!form.grade) return
    const name = getClassName(form.grade, form.section)
    const { error } = await supabase.from("classes").insert([{
      name,
      grade: form.grade,
      section: form.section || null,
      school_id: profile.school_id
    }])
    if (!error) {
      setShowForm(false)
      setForm({ grade:"1", section:"", capacity:"30" })
      fetchClasses()
    }
  }

  const deleteClass = async (id) => {
    if (!confirm("Delete this class? Students in this class will be unassigned.")) return
    await supabase.from("classes").delete().eq("id", id)
    fetchClasses()
  }

  const gradeGroups = classes.reduce((acc, cls) => {
    const g = cls.grade || "Other"
    if (!acc[g]) acc[g] = []
    acc[g].push(cls)
    return acc
  }, {})

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Classes</h1>
          <p className="text-gray-600 mt-1">{classes.length} classes · manage grades and sections</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-[#E76F51] text-white px-6 py-2 rounded-full hover:bg-[#d65f41] transition-colors flex items-center gap-2 text-sm font-medium">
          <Plus size={18} /> Add Class
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 max-w-md">
          <h2 className="font-bold text-[#1A3B2E] mb-5">New Class</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
                <select value={form.grade} onChange={e => setForm({...form, grade:e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm">
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select value={form.section} onChange={e => setForm({...form, section:e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm">
                  <option value="">No Section</option>
                  {sections.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="p-4 bg-[#F9F7F3] rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Class will be created as:</p>
              <p className="font-bold text-[#1A3B2E] text-lg">{getClassName(form.grade, form.section)}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-600 text-sm">Cancel</button>
              <button onClick={save}
                className="flex-1 py-2.5 bg-[#E76F51] text-white rounded-xl text-sm font-semibold hover:bg-[#d65f41]">
                Create Class
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Loading classes...</div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-5xl mb-4">🏫</p>
          <h3 className="font-bold text-[#1A3B2E] text-lg mb-2">No classes yet</h3>
          <p className="text-gray-500 text-sm mb-6">Create your first class to start enrolling students</p>
          <div className="max-w-xs mx-auto text-left space-y-2 mb-6">
            {["Create classes (Grade + Section)","Add students to each class","Mark attendance by class","Generate CBSE reports"].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E76F51] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i+1}</div>
                <p className="text-sm text-gray-600">{step}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-[#E76F51] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d65f41] transition-colors">
            Create First Class
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(gradeGroups).map(([grade, gradeClasses]) => (
            <div key={grade} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-[#1A3B2E] text-white">
                <p className="font-bold text-sm">Grade {grade}</p>
              </div>
              <div className="divide-y divide-gray-100">
                {gradeClasses.map(cls => (
                  <div key={cls.id} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#E76F51]/10 flex items-center justify-center">
                        <span className="font-black text-[#E76F51]">{cls.section || grade.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A3B2E]">{cls.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users size={12} className="text-gray-400" />
                          <p className="text-xs text-gray-400">
                            {cls.students?.[0]?.count || 0} students
                          </p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => deleteClass(cls.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Classes
