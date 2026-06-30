import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { Plus, Edit, Trash2, Search, Star, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"

const Students = () => {
  const { profile } = useAuth()
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState("")
  const [filterGrade, setFilterGrade] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [form, setForm] = useState({
    full_name:"", roll_number:"", class_id:"", date_of_birth:"", gender:"",
    medical_flags:[], emergency_contact:{name:"",phone:"",relation:""},
    talent_notes:"", is_talent_flagged:false
  })
  const medicalOptions = ["Asthma","Allergies","Heart Condition","Epilepsy","Diabetes","Physical Disability","Other"]

  useEffect(() => { fetchStudents(); fetchClasses() }, [profile])

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("students").select("*, classes(name, grade, section)")
      .eq("school_id", profile?.school_id).order("full_name")
    setStudents(data || [])
  }

  const fetchClasses = async () => {
    const { data } = await supabase
      .from("classes").select("*")
      .eq("school_id", profile?.school_id).order("grade")
    setClasses(data || [])
  }

  const save = async () => {
    const payload = {
      full_name: form.full_name,
      roll_number: form.roll_number || null,
      class_id: form.class_id || null,
      date_of_birth: form.date_of_birth || null,
      gender: form.gender || null,
      medical_flags: JSON.stringify(form.medical_flags),
      emergency_contact: JSON.stringify(form.emergency_contact),
      talent_notes: form.talent_notes || null,
      is_talent_flagged: form.is_talent_flagged,
      school_id: profile?.school_id
    }
    if (editing) {
      await supabase.from("students").update(payload).eq("id", editing.id)
    } else {
      await supabase.from("students").insert([payload])
    }
    resetForm()
    fetchStudents()
  }

  const resetForm = () => {
    setShowForm(false); setEditing(null)
    setForm({ full_name:"", roll_number:"", class_id:"", date_of_birth:"", gender:"",
      medical_flags:[], emergency_contact:{name:"",phone:"",relation:""},
      talent_notes:"", is_talent_flagged:false })
  }

  const del = async (id) => {
    if (!confirm("Delete this student?")) return
    await supabase.from("students").delete().eq("id", id)
    fetchStudents()
  }

  const openEdit = (student) => {
    setEditing(student)
    setForm({
      full_name: student.full_name, roll_number: student.roll_number||"",
      class_id: student.class_id||"", date_of_birth: student.date_of_birth||"",
      gender: student.gender||"",
      medical_flags: Array.isArray(student.medical_flags)?student.medical_flags:JSON.parse(student.medical_flags||"[]"),
      emergency_contact: typeof student.emergency_contact==="object"&&student.emergency_contact?student.emergency_contact:JSON.parse(student.emergency_contact||"{}"),
      talent_notes: student.talent_notes||"", is_talent_flagged: student.is_talent_flagged||false
    })
    setShowForm(true)
  }

  const toggleMedical = (flag) => {
    setForm(prev => ({...prev,
      medical_flags: prev.medical_flags.includes(flag)
        ? prev.medical_flags.filter(f=>f!==flag)
        : [...prev.medical_flags, flag]
    }))
  }

  const grades = [...new Set(classes.map(c => c.grade).filter(Boolean))]
  const filtered = students.filter(s => {
    const matchSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) || (s.roll_number||"").toLowerCase().includes(search.toLowerCase())
    const matchGrade = !filterGrade || s.classes?.grade === filterGrade
    return matchSearch && matchGrade
  })

  if (classes.length === 0 && !showForm) return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Students</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <p className="text-5xl mb-4">👨‍🎓</p>
        <h3 className="font-bold text-[#1A3B2E] text-lg mb-2">Create classes first</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
          Before adding students you need to create your school classes. Go to Classes and add your grades and sections.
        </p>
        <Link to="/classes"
          className="bg-[#E76F51] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d65f41] transition-colors inline-block">
          Go to Classes →
        </Link>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Students</h1>
          <p className="text-gray-600 mt-1">{students.length} students enrolled across {classes.length} classes</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }}
          className="bg-[#E76F51] text-white px-6 py-2 rounded-full hover:bg-[#d65f41] transition-colors flex items-center gap-2 text-sm font-medium">
          <Plus size={18} /> Add Student
        </button>
      </div>

      {!showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or roll number..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm" />
          </div>
          <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm">
            <option value="">All Grades</option>
            {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-[#1A3B2E] mb-6">{editing ? "Edit Student" : "New Student"}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input value={form.full_name} onChange={e => setForm({...form,full_name:e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="Student name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input value={form.roll_number} onChange={e => setForm({...form,roll_number:e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="e.g. 101" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select value={form.class_id} onChange={e => setForm({...form,class_id:e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                  <option value="">Select class...</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" value={form.date_of_birth} onChange={e => setForm({...form,date_of_birth:e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={form.gender} onChange={e => setForm({...form,gender:e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Flags</label>
              <div className="flex flex-wrap gap-2">
                {medicalOptions.map(flag => (
                  <button key={flag} type="button" onClick={() => toggleMedical(flag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.medical_flags.includes(flag) ? "bg-red-100 text-red-700 border-red-300" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                    {flag}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Emergency Contact Name</label>
                <input value={form.emergency_contact.name} onChange={e => setForm({...form,emergency_contact:{...form.emergency_contact,name:e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="Name" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                <input value={form.emergency_contact.phone} onChange={e => setForm({...form,emergency_contact:{...form.emergency_contact,phone:e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="Phone" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Relation</label>
                <input value={form.emergency_contact.relation} onChange={e => setForm({...form,emergency_contact:{...form.emergency_contact,relation:e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="e.g. Father" />
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <input type="checkbox" id="talent" checked={form.is_talent_flagged} onChange={e => setForm({...form,is_talent_flagged:e.target.checked})} className="w-4 h-4 accent-[#E76F51]" />
              <label htmlFor="talent" className="text-sm font-medium text-amber-800 flex items-center gap-2">
                <Star size={14} className="fill-amber-500 text-amber-500" /> Flag as talented athlete
              </label>
            </div>
            {form.is_talent_flagged && (
              <textarea value={form.talent_notes} onChange={e => setForm({...form,talent_notes:e.target.value})} rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" placeholder="Describe athletic potential..." />
            )}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={resetForm} className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-600">Cancel</button>
              <button type="button" onClick={save} disabled={!form.full_name}
                className="flex-1 py-2 bg-[#E76F51] text-white rounded-xl hover:bg-[#d65f41] disabled:opacity-50">
                {editing?"Update":"Add"} Student
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(student => (
            <div key={student.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded===student.id?null:student.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A3B2E] flex items-center justify-center text-white font-bold text-sm">
                    {student.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#1A3B2E]">{student.full_name}</p>
                      {student.is_talent_flagged && <Star size={14} className="fill-amber-400 text-amber-400" />}
                      {(Array.isArray(student.medical_flags)?student.medical_flags:JSON.parse(student.medical_flags||"[]")).length>0 && <AlertTriangle size={14} className="text-red-500" />}
                    </div>
                    <p className="text-xs text-gray-500">
                      {student.roll_number&&`Roll: ${student.roll_number}`}
                      {student.classes?.name&&` · ${student.classes.name}`}
                      {student.gender&&` · ${student.gender}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={e=>{e.stopPropagation();openEdit(student)}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                  <button type="button" onClick={e=>{e.stopPropagation();del(student.id)}} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  {expanded===student.id?<ChevronUp size={18} className="text-gray-400"/>:<ChevronDown size={18} className="text-gray-400"/>}
                </div>
              </div>
              {expanded===student.id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Medical Flags</p>
                      {(()=>{const flags=Array.isArray(student.medical_flags)?student.medical_flags:JSON.parse(student.medical_flags||"[]");return flags.length>0?(<div className="flex flex-wrap gap-1">{flags.map(f=><span key={f} className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs border border-red-200">{f}</span>)}</div>):<p className="text-gray-400">None</p>})()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Emergency Contact</p>
                      {(()=>{const ec=typeof student.emergency_contact==="object"&&student.emergency_contact?student.emergency_contact:JSON.parse(student.emergency_contact||"{}");return ec.name?<p className="text-gray-600 text-xs">{ec.name} ({ec.relation}) — {ec.phone}</p>:<p className="text-gray-400">Not set</p>})()}
                    </div>
                    {student.talent_notes&&<div className="col-span-2"><p className="text-xs text-gray-400 uppercase mb-1">Talent Notes</p><p className="text-amber-700 bg-amber-50 p-2 rounded-lg text-xs">{student.talent_notes}</p></div>}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length===0 && students.length===0 && (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
              <p className="text-4xl mb-3">👤</p>
              <p className="font-medium text-gray-600 mb-1">No students yet</p>
              <p className="text-sm text-gray-400">Click Add Student to enroll your first student</p>
            </div>
          )}
          {filtered.length===0 && students.length>0 && (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
              <p>No students match your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Students
