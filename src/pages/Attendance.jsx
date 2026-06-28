import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

const Attendance = () => {
  const { profile } = useAuth()
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { fetchClasses() }, [])
  useEffect(() => { if (selectedClass) fetchStudents() }, [selectedClass, date])

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("*").eq("school_id", profile?.school_id)
    setClasses(data || [])
  }

  const fetchStudents = async () => {
    setLoading(true)
    const { data: studentData } = await supabase.from("students").select("*").eq("class_id", selectedClass).order("full_name")
    setStudents(studentData || [])
    const { data: attData } = await supabase.from("attendance").select("*").eq("class_id", selectedClass).eq("date", date)
    const attMap = {}
    attData?.forEach(a => { attMap[a.student_id] = a.status })
    setAttendance(attMap)
    setLoading(false)
  }

  const markAll = (status) => {
    const newAtt = {}
    students.forEach(s => { newAtt[s.id] = status })
    setAttendance(newAtt)
  }

  const saveAttendance = async () => {
    setLoading(true)
    for (const student of students) {
      const status = attendance[student.id] || "absent"
      await supabase.from("attendance").upsert({
        student_id: student.id,
        class_id: selectedClass,
        school_id: profile?.school_id,
        date,
        status,
        marked_by: profile?.id
      }, { onConflict: "student_id,date" })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setLoading(false)
  }

  const statusColors = {
    present: "bg-green-100 text-green-700 border-green-300",
    absent: "bg-red-100 text-red-700 border-red-300",
    late: "bg-yellow-100 text-yellow-700 border-yellow-300",
    excused: "bg-blue-100 text-blue-700 border-blue-300"
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Attendance</h1>
        <p className="text-gray-600 mt-1">Mark daily attendance for your class</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
              <option value="">Choose a class...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
          </div>
        </div>
      </div>

      {selectedClass && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="font-semibold text-[#1A3B2E]">{students.length} students</p>
            <div className="flex gap-2">
              <button onClick={() => markAll("present")} className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">All Present</button>
              <button onClick={() => markAll("absent")} className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">All Absent</button>
            </div>
          </div>

          {loading ? <p className="text-center py-8 text-gray-500">Loading...</p> : (
            <div className="space-y-3">
              {students.map(student => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-[#F9F7F3] rounded-xl">
                  <div>
                    <p className="font-medium text-[#1A3B2E]">{student.full_name}</p>
                    <p className="text-xs text-gray-500">Roll: {student.roll_number || "N/A"}</p>
                  </div>
                  <div className="flex gap-2">
                    {["present","absent","late","excused"].map(status => (
                      <button
                        key={status}
                        onClick={() => setAttendance({...attendance, [student.id]: status})}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${attendance[student.id] === status ? statusColors[status] : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {students.length > 0 && (
            <button onClick={saveAttendance} disabled={loading} className="mt-6 w-full py-3 bg-[#E76F51] text-white rounded-full font-medium hover:bg-[#d65f41] transition-colors disabled:opacity-50">
              {saved ? "✓ Saved!" : loading ? "Saving..." : "Save Attendance"}
            </button>
          )}

          {students.length === 0 && !loading && (
            <p className="text-center py-8 text-gray-500">No students in this class yet. Add students first.</p>
          )}
        </div>
      )}

      {!selectedClass && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-gray-500">Select a class to mark attendance</p>
        </div>
      )}
    </div>
  )
}

export default Attendance
