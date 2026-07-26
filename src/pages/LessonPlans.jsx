import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { Plus, Edit, Trash2, Search, BookOpen } from "lucide-react"

const GRADES = ["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5"]

const LessonPlans = () => {
  const { profile } = useAuth()
  const [plans, setPlans] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState("")
  const [filterGrade, setFilterGrade] = useState("")
  const [filterSport, setFilterSport] = useState("")
  const [tab, setTab] = useState("library")
  const [form, setForm] = useState({ title:"", sport:"", age_group:"", duration_minutes:45, objectives:"", warm_up:"", main_activity:"", cool_down:"", equipment_needed:"" })

  useEffect(() => { fetchPlans() }, [])

  const fetchPlans = async () => {
    const { data } = await supabase.from("lesson_plans").select("*")
      .or(`school_id.eq.${profile?.school_id},is_template.eq.true`)
      .order("title")
    setPlans(data || [])
  }

  const save = async () => {
    if (editing) {
      await supabase.from("lesson_plans").update(form).eq("id", editing.id)
    } else {
      await supabase.from("lesson_plans").insert([{ ...form, school_id:profile?.school_id, created_by:profile?.id, is_template:false }])
    }
    setShowForm(false); setEditing(null)
    setForm({ title:"", sport:"", age_group:"", duration_minutes:45, objectives:"", warm_up:"", main_activity:"", cool_down:"", equipment_needed:"" })
    fetchPlans()
  }

  const del = async (id) => {
    if (!confirm("Delete this plan?")) return
    await supabase.from("lesson_plans").delete().eq("id", id)
    fetchPlans()
  }

  const openEdit = (plan) => {
    setEditing(plan)
    setForm({ title:plan.title, sport:plan.sport||"", age_group:plan.age_group||"", duration_minutes:plan.duration_minutes||45, objectives:plan.objectives||"", warm_up:plan.warm_up||"", main_activity:plan.main_activity||"", cool_down:plan.cool_down||"", equipment_needed:plan.equipment_needed||"" })
    setShowForm(true)
  }

  const copyPlan = async (plan) => {
    await supabase.from("lesson_plans").insert([{
      title: `${plan.title} (My Copy)`,
      sport: plan.sport, age_group: plan.age_group,
      duration_minutes: plan.duration_minutes,
      objectives: plan.objectives, warm_up: plan.warm_up,
      main_activity: plan.main_activity, cool_down: plan.cool_down,
      equipment_needed: plan.equipment_needed,
      school_id: profile?.school_id, created_by: profile?.id, is_template: false
    }])
    fetchPlans()
    setTab("mine")
  }

  const templatePlans = plans.filter(p => p.is_template)
  const myPlans = plans.filter(p => !p.is_template && p.school_id === profile?.school_id)

  const gradeOf = (plan) => (plan.title || "").split(" · ")[0] || ""

  const sportsForGrade = [...new Set(
    templatePlans.filter(p => !filterGrade || gradeOf(p) === filterGrade).map(p => p.sport).filter(Boolean)
  )].sort()

  const filterPlans = (list) => list.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchGrade = !filterGrade || gradeOf(p) === filterGrade
    const matchSport = !filterSport || p.sport === filterSport
    return matchSearch && matchGrade && matchSport
  })

  const displayPlans = tab === "library" ? filterPlans(templatePlans) : filterPlans(myPlans)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Lesson Plans</h1>
          <p className="text-gray-600 mt-1">MGTF library ({templatePlans.length} plans) + your custom plans</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="bg-[#E76F51] text-white px-6 py-2 rounded-full hover:bg-[#d65f41] flex items-center gap-2 text-sm font-medium">
          <Plus size={18} /> New Plan
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab("library")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${tab==="library" ? "bg-[#1A3B2E] text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
          MGTF Library ({templatePlans.length})
        </button>
        <button onClick={() => setTab("mine")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${tab==="mine" ? "bg-[#1A3B2E] text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
          My Plans ({myPlans.length})
        </button>
      </div>

      {!showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plans..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm" />
          </div>
          {tab === "library" && (
            <>
              <select value={filterGrade} onChange={e => { setFilterGrade(e.target.value); setFilterSport("") }} className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm">
                <option value="">All Grades</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={filterSport} onChange={e => setFilterSport(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm">
                <option value="">All Chapters / Sports</option>
                {sportsForGrade.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </>
          )}
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-[#1A3B2E] mb-6">{editing ? "Edit Plan" : "New Lesson Plan"}</h2>
          <div className="space-y-4">
            <input value={form.title} onChange={e => setForm({...form,title:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="Plan title *" />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sport / Chapter</label>
                <input value={form.sport} onChange={e => setForm({...form,sport:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="e.g. Basketball" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Age Group</label>
                <input value={form.age_group} onChange={e => setForm({...form,age_group:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="e.g. Age 8-9 years" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Duration (min)</label>
                <input type="number" value={form.duration_minutes} onChange={e => setForm({...form,duration_minutes:parseInt(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
              </div>
            </div>
            {["objectives","warm_up","main_activity","cool_down","equipment_needed"].map(field => (
              <div key={field}>
                <label className="block text-xs text-gray-500 mb-1 capitalize">{field.replace(/_/g," ")}</label>
                <textarea value={form[field]} onChange={e => setForm({...form,[field]:e.target.value})} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder={`Enter ${field.replace(/_/g," ")}...`} />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-600">Cancel</button>
              <button onClick={save} disabled={!form.title} className="flex-1 py-2 bg-[#E76F51] text-white rounded-xl disabled:opacity-50">{editing?"Update":"Save"} Plan</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayPlans.map(plan => (
            <div key={plan.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-[#1A3B2E] leading-snug">{plan.title}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {plan.sport && <span className="bg-[#E76F51]/10 text-[#E76F51] px-2 py-0.5 rounded-full text-xs">{plan.sport}</span>}
                    {plan.age_group && <span className="bg-[#1A3B2E]/10 text-[#1A3B2E] px-2 py-0.5 rounded-full text-xs">{plan.age_group}</span>}
                    {plan.duration_minutes && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{plan.duration_minutes}min</span>}
                    {plan.is_template && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">MGTF</span>}
                  </div>
                </div>
              </div>
              {plan.objectives && <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{plan.objectives}</p>}
              <div className="flex gap-2 mt-auto">
                {plan.is_template ? (
                  <button onClick={() => copyPlan(plan)} className="flex-1 py-1.5 bg-[#1A3B2E] text-white rounded-xl text-xs font-medium hover:bg-[#0d2318]">Use This Plan</button>
                ) : (
                  <>
                    <button onClick={() => openEdit(plan)} className="flex-1 py-1.5 border border-gray-300 rounded-xl text-xs text-gray-600 hover:bg-gray-50">Edit</button>
                    <button onClick={() => del(plan.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={14} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
          {displayPlans.length === 0 && (
            <div className="col-span-3 bg-white rounded-2xl p-12 text-center text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 text-gray-300" />
              <p>{tab==="library" ? "No MGTF plans match your filters" : "No custom plans yet — use the MGTF Library to get started!"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LessonPlans
