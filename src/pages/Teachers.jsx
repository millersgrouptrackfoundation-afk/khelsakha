import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { Plus, Edit, Trash2, Phone, Mail, CheckCircle } from "lucide-react"

const ROLES = ["Physical Education Teacher","Sports Coach","Athletics Coach","Football Coach","Cricket Coach","Yoga Instructor","Martial Arts Coach","Swimming Coach","Sports Mentor","Other"]
const GRADES = ["Playgroup","Nursery","KG","1","2","3","4","5","6","7","8","9","10","11","12"]

const Teachers = () => {
  const { profile } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [fullName, setFullName] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [role, setRole] = useState("Physical Education Teacher")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")
  const [joiningDate, setJoiningDate] = useState("")
  const [qualification, setQualification] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [assignedGrades, setAssignedGrades] = useState([])
  const [status, setStatus] = useState("active")

  useEffect(() => { if (profile?.school_id) fetchTeachers() }, [profile?.school_id])

  const showToast = (msg, type="success") => {
    setToast({msg, type})
    setTimeout(() => setToast(null), 3000)
  }

  const fetchTeachers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("teachers")
      .select("*")
      .eq("school_id", profile.school_id)
      .order("full_name")
    setTeachers(data || [])
    setLoading(false)
  }

  const save = async () => {
    if (!fullName.trim()) { showToast("Please enter teacher name", "error"); return }
    setSaving(true)
    const payload = {
      full_name: fullName.trim(),
      employee_id: employeeId || null,
      role,
      phone: phone || null,
      email: email || null,
      gender: gender || null,
      joining_date: joiningDate || null,
      qualification: qualification || null,
      specialization: specialization || null,
      assigned_grades: JSON.stringify(assignedGrades),
      status,
      school_id: profile.school_id
    }
    const { error } = editing
      ? await supabase.from("teachers").update(payload).eq("id", editing.id)
      : await supabase.from("teachers").insert([payload])
    setSaving(false)
    if (error) { showToast(`Error: ${error.message}`, "error"); return }
    showToast(editing ? `${fullName} updated` : `${fullName} added successfully`)
    resetForm()
    fetchTeachers()
  }

  const resetForm = () => {
    setShowForm(false); setEditing(null)
    setFullName(""); setEmployeeId(""); setRole("Physical Education Teacher")
    setPhone(""); setEmail(""); setGender(""); setJoiningDate("")
    setQualification(""); setSpecialization(""); setAssignedGrades([]); setStatus("active")
  }

  const openEdit = (t) => {
    setEditing(t)
    setFullName(t.full_name); setEmployeeId(t.employee_id||""); setRole(t.role||"Physical Education Teacher")
    setPhone(t.phone||""); setEmail(t.email||""); setGender(t.gender||"")
    setJoiningDate(t.joining_date||""); setQualification(t.qualification||"")
    setSpecialization(t.specialization||"")
    setAssignedGrades(Array.isArray(t.assigned_grades)?t.assigned_grades:JSON.parse(t.assigned_grades||"[]"))
    setStatus(t.status||"active")
    setShowForm(true)
  }

  const del = async (id, name) => {
    if (!confirm(`Remove ${name}?`)) return
    const { error } = await supabase.from("teachers").delete().eq("id", id)
    if (!error) { showToast(`${name} removed`); fetchTeachers() }
    else showToast("Failed to delete", "error")
  }

  const toggleGrade = (grade) => {
    setAssignedGrades(prev =>
      prev.includes(grade) ? prev.filter(g=>g!==grade) : [...prev, grade]
    )
  }

  const initials = (name) => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()
  const avatarColors = ["#1A3B2E","#E76F51","#2563eb","#8b5cf6","#059669","#d97706"]
  const getColor = (name) => avatarColors[name.charCodeAt(0) % avatarColors.length]

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
          <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Teachers</h1>
          <p className="text-gray-600 mt-1">{teachers.length} sports staff members</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true) }}
            className="bg-[#E76F51] text-white px-6 py-2 rounded-full hover:bg-[#d65f41] transition-colors flex items-center gap-2 text-sm font-medium">
            <Plus size={18} /> Add Teacher
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 max-w-2xl">
          <h2 className="text-xl font-bold text-[#1A3B2E] mb-6">{editing?"Edit Teacher":"Add Sports Staff"}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input value={fullName} onChange={e=>setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input value={employeeId} onChange={e=>setEmployeeId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  placeholder="e.g. EMP001" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select value={role} onChange={e=>setRole(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  placeholder="Phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  placeholder="email@school.com" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={gender} onChange={e=>setGender(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                <input type="date" value={joiningDate} onChange={e=>setJoiningDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={status} onChange={e=>setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                <input value={qualification} onChange={e=>setQualification(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  placeholder="e.g. B.P.Ed, M.P.Ed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input value={specialization} onChange={e=>setSpecialization(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]"
                  placeholder="e.g. Athletics, Football" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Grades</label>
              <div className="flex flex-wrap gap-2">
                {GRADES.map(g => (
                  <button key={g} type="button" onClick={() => toggleGrade(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      assignedGrades.includes(g)
                        ? "bg-[#1A3B2E] text-white border-[#1A3B2E]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}>
                    Grade {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={resetForm}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-600 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={save} disabled={!fullName.trim() || saving}
                className="flex-1 py-2.5 bg-[#E76F51] text-white rounded-xl hover:bg-[#d65f41] disabled:opacity-50 text-sm font-semibold">
                {saving ? "Saving..." : editing ? "Update Teacher" : "Add Teacher"}
              </button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Loading...</div>
      ) : teachers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-5xl mb-4">👨‍🏫</p>
          <h3 className="font-bold text-[#1A3B2E] text-lg mb-2">No teachers added yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Add your PE teachers and sports coaches so you can assign classes and run evaluations.
          </p>
          <button onClick={() => setShowForm(true)}
            className="bg-[#E76F51] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d65f41] transition-colors">
            Add First Teacher
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map(teacher => {
            const grades = Array.isArray(teacher.assigned_grades)
              ? teacher.assigned_grades
              : JSON.parse(teacher.assigned_grades||"[]")
            return (
              <div key={teacher.id} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{background:getColor(teacher.full_name)}}>
                      {initials(teacher.full_name)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1A3B2E]">{teacher.full_name}</p>
                      <p className="text-xs text-gray-500">{teacher.role}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${teacher.status==="active"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>
                    {teacher.status}
                  </span>
                </div>
                <div className="space-y-1.5 mb-4">
                  {teacher.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone size={12} /> {teacher.phone}
                    </div>
                  )}
                  {teacher.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail size={12} /> {teacher.email}
                    </div>
                  )}
                  {teacher.specialization && (
                    <p className="text-xs text-gray-500">🏅 {teacher.specialization}</p>
                  )}
                </div>
                {grades.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {grades.map(g => (
                      <span key={g} className="text-xs bg-[#1A3B2E]/10 text-[#1A3B2E] px-2 py-0.5 rounded-full font-medium">
                        Gr {g}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => openEdit(teacher)}
                    className="flex-1 py-1.5 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => del(teacher.id, teacher.full_name)}
                    className="py-1.5 px-3 border border-red-200 rounded-xl text-xs text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Teachers
