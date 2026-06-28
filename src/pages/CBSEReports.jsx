import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { FileText, Download, Search } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const CBSEReports = () => {
  const { profile } = useAuth()
  const [students, setStudents] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")
  const [scores, setScores] = useState(null)
  const [attStats, setAttStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState({
    academicYear: "2024-25",
    term: "term1",
    examinerName: profile?.full_name || "",
    schoolName: ""
  })

  useEffect(() => { fetchStudents(); fetchSchool() }, [])

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("students").select("*, classes(name)")
      .eq("school_id", profile?.school_id).order("full_name")
    setStudents(data || [])
  }

  const fetchSchool = async () => {
    const { data } = await supabase.from("schools").select("name").eq("id", profile?.school_id).single()
    if (data) setMeta(prev => ({...prev, schoolName: data.name}))
  }

  const selectStudent = async (student) => {
    setSelected(student)
    setLoading(true)
    const { data: s } = await supabase
      .from("skill_scores").select("*")
      .eq("student_id", student.id)
      .order("assessed_at", {ascending:false}).limit(1)
    setScores(s?.[0] || null)
    const { data: a } = await supabase
      .from("attendance").select("status").eq("student_id", student.id)
    const total = a?.length || 0
    const present = a?.filter(x => x.status === "present").length || 0
    setAttStats(total > 0 ? { total, present, pct: Math.round((present/total)*100) } : null)
    setLoading(false)
  }

  const getGrade = (score) => {
    if (score >= 9) return "A+"
    if (score >= 8) return "A"
    if (score >= 7) return "B"
    if (score >= 6) return "C"
    if (score >= 5) return "D"
    return "E"
  }

  const getAvg = () => {
    if (!scores) return 0
    return (scores.speed + scores.stamina + scores.strength + scores.agility + scores.technique + scores.teamwork) / 6
  }

  const generatePDF = () => {
    if (!selected) return
    if (!scores) { alert("No skill scores found for this student. Please add skill scores first."); return }

    const doc = new jsPDF()
    const avg = getAvg()

    doc.setFillColor(26, 59, 46)
    doc.rect(0, 0, 210, 35, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("KhelSakha", 105, 14, {align:"center"})
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Physical Education Assessment Report — CBSE Compliant", 105, 22, {align:"center"})
    doc.text("Miller Group Track Foundation (MGTF)", 105, 29, {align:"center"})

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(9)
    doc.text(`School: ${meta.schoolName}`, 20, 45)
    doc.text(`Academic Year: ${meta.academicYear}`, 20, 51)
    doc.text(`Term: ${meta.term.replace("term", "Term ")}`, 20, 57)
    doc.text(`Date Generated: ${new Date().toLocaleDateString("en-IN")}`, 20, 63)

    doc.text(`Student: ${selected.full_name}`, 115, 45)
    doc.text(`Class: ${selected.classes?.name || "N/A"}`, 115, 51)
    doc.text(`Roll No: ${selected.roll_number || "N/A"}`, 115, 57)
    doc.text(`Examiner: ${meta.examinerName}`, 115, 63)

    doc.setDrawColor(26, 59, 46)
    doc.setLineWidth(0.5)
    doc.line(20, 68, 190, 68)

    doc.setFontSize(11)
    doc.setTextColor(26, 59, 46)
    doc.setFont("helvetica", "bold")
    doc.text("Skill Assessment Results", 20, 76)

    autoTable(doc, {
      startY: 80,
      head: [["Skill Parameter", "Score (out of 10)", "Grade", "Remarks"]],
      body: [
        ["Speed", scores.speed.toString(), getGrade(scores.speed), scores.speed >= 8 ? "Excellent" : scores.speed >= 6 ? "Good" : "Needs Improvement"],
        ["Stamina", scores.stamina.toString(), getGrade(scores.stamina), scores.stamina >= 8 ? "Excellent" : scores.stamina >= 6 ? "Good" : "Needs Improvement"],
        ["Strength", scores.strength.toString(), getGrade(scores.strength), scores.strength >= 8 ? "Excellent" : scores.strength >= 6 ? "Good" : "Needs Improvement"],
        ["Agility", scores.agility.toString(), getGrade(scores.agility), scores.agility >= 8 ? "Excellent" : scores.agility >= 6 ? "Good" : "Needs Improvement"],
        ["Technique", scores.technique.toString(), getGrade(scores.technique), scores.technique >= 8 ? "Excellent" : scores.technique >= 6 ? "Good" : "Needs Improvement"],
        ["Teamwork", scores.teamwork.toString(), getGrade(scores.teamwork), scores.teamwork >= 8 ? "Excellent" : scores.teamwork >= 6 ? "Good" : "Needs Improvement"],
      ],
      theme: "grid",
      headStyles: { fillColor:[26,59,46], textColor:[255,255,255], fontSize:9, fontStyle:"bold" },
      bodyStyles: { fontSize:9, textColor:[60,60,60] },
      alternateRowStyles: { fillColor:[249,247,243] },
      columnStyles: { 0:{fontStyle:"bold"}, 2:{fontStyle:"bold", textColor:[231,111,81]} }
    })

    const y = doc.lastAutoTable.finalY + 10

    doc.setFillColor(26, 59, 46)
    doc.roundedRect(20, y, 80, 22, 3, 3, "F")
    doc.setTextColor(255,255,255)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Overall Grade", 60, y + 8, {align:"center"})
    doc.setFontSize(16)
    doc.text(getGrade(avg), 60, y + 17, {align:"center"})

    doc.setFillColor(249, 247, 243)
    doc.roundedRect(110, y, 80, 22, 3, 3, "F")
    doc.setTextColor(26,59,46)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Attendance", 150, y + 8, {align:"center"})
    doc.setFontSize(13)
    doc.text(attStats ? `${attStats.pct}% (${attStats.present}/${attStats.total})` : "N/A", 150, y + 17, {align:"center"})

    if (scores.notes) {
      doc.setTextColor(60,60,60)
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.text("Coach Notes:", 20, y + 32)
      doc.setFont("helvetica", "normal")
      const lines = doc.splitTextToSize(scores.notes, 170)
      doc.text(lines, 20, y + 38)
    }

    const sigY = 240
    doc.setDrawColor(180,180,180)
    doc.line(20, sigY, 80, sigY)
    doc.line(130, sigY, 190, sigY)
    doc.setFontSize(8)
    doc.setTextColor(120,120,120)
    doc.text("PE Teacher Signature", 50, sigY + 5, {align:"center"})
    doc.text("Principal Signature", 160, sigY + 5, {align:"center"})
    doc.text(meta.examinerName, 50, sigY + 10, {align:"center"})

    doc.setFillColor(249,247,243)
    doc.rect(0, 278, 210, 20, "F")
    doc.setFontSize(7)
    doc.setTextColor(150,150,150)
    doc.text("Generated by KhelSakha v6 | Miller Group Track Foundation | This is a computer-generated report", 105, 285, {align:"center"})
    doc.text(`Report ID: KS-${Date.now()} | Generated on ${new Date().toLocaleString("en-IN")}`, 105, 290, {align:"center"})

    doc.save(`CBSE_PE_Report_${selected.full_name.replace(/\s+/g,"_")}_${meta.term}.pdf`)
  }

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (s.roll_number||"").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>CBSE Reports</h1>
        <p className="text-gray-600 mt-1">Generate CBSE-compliant PE assessment reports with one click</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="font-semibold text-[#1A3B2E] text-sm mb-3">Select Student</p>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm" />
          </div>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {filtered.map(s => (
              <button key={s.id} onClick={() => selectStudent(s)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm ${selected?.id===s.id ? "bg-[#E76F51] text-white" : "bg-[#F9F7F3] text-[#1A3B2E] hover:bg-[#f0ece6]"}`}>
                <p className="font-medium">{s.full_name}</p>
                <p className="text-xs opacity-70">{s.classes?.name} • Roll: {s.roll_number||"N/A"}</p>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-center py-6 text-gray-400 text-sm">No students found</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1A3B2E]">{selected.full_name}</h2>
                  <p className="text-sm text-gray-500">{selected.classes?.name} • Roll: {selected.roll_number||"N/A"}</p>
                </div>
                <button onClick={generatePDF} className="bg-[#E76F51] text-white px-5 py-2.5 rounded-full hover:bg-[#d65f41] flex items-center gap-2 text-sm font-medium shadow-sm">
                  <Download size={16} /> Export PDF
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Academic Year</label>
                  <input value={meta.academicYear} onChange={e => setMeta({...meta,academicYear:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Term</label>
                  <select value={meta.term} onChange={e => setMeta({...meta,term:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
                    <option value="term1">Term 1</option>
                    <option value="term2">Term 2</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Examiner Name</label>
                  <input value={meta.examinerName} onChange={e => setMeta({...meta,examinerName:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-400">Loading student data...</div>
              ) : scores ? (
                <>
                  <h3 className="font-semibold text-[#1A3B2E] text-sm mb-3">Latest Skill Assessment</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {["speed","stamina","strength","agility","technique","teamwork"].map(skill => (
                      <div key={skill} className="bg-[#F9F7F3] rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-[#E76F51]">{scores[skill]}</p>
                        <p className="text-xs text-gray-500 capitalize mt-0.5">{skill}</p>
                        <p className="text-xs font-bold text-[#1A3B2E] mt-1">{getGrade(scores[skill])}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-[#1A3B2E] text-white rounded-xl p-4 text-center">
                      <p className="text-xs text-white/60 mb-1">Overall Grade</p>
                      <p className="text-3xl font-bold">{getGrade(getAvg())}</p>
                    </div>
                    <div className="flex-1 bg-[#F9F7F3] rounded-xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Attendance</p>
                      <p className="text-3xl font-bold text-[#E76F51]">{attStats ? `${attStats.pct}%` : "N/A"}</p>
                      {attStats && <p className="text-xs text-gray-400 mt-1">{attStats.present}/{attStats.total} days</p>}
                    </div>
                  </div>
                  {scores.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-400 uppercase mb-1">Coach Notes</p>
                      <p className="text-sm text-gray-600">{scores.notes}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 font-medium">No skill scores yet for {selected.full_name}</p>
                  <p className="text-gray-400 text-sm mt-1">Add skill scores first, then generate the report</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
              <FileText size={48} className="mx-auto mb-4 text-gray-200" />
              <p className="font-medium text-gray-500">Select a student to generate their CBSE report</p>
              <p className="text-sm mt-1">Reports include skill scores, attendance, grades and examiner signature</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CBSEReports
