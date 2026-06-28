import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"
import { Users, ClipboardCheck, CalendarDays, Package, TrendingUp, Star, FileText, BookOpen, Search } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts"

const AdminDashboard = ({ profile, stats, skillAvg, recentActivity }) => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>School Overview</h1>
      <p className="text-gray-500 mt-1">Here is what is happening at your school today</p>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label:"Total Students", value:stats.totalStudents, icon:Users, color:"bg-blue-50 text-blue-700", link:"/students" },
        { label:"Present Today", value:stats.todayAttendance, icon:ClipboardCheck, color:"bg-green-50 text-green-700", link:"/attendance" },
        { label:"Upcoming Events", value:stats.upcomingEvents, icon:CalendarDays, color:"bg-purple-50 text-purple-700", link:"/events" },
        { label:"Equipment Issues", value:stats.poorEquipment, icon:Package, color:"bg-red-50 text-red-700", link:"/equipment" },
      ].map((stat, i) => (
        <Link key={i} to={stat.link} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
            <stat.icon size={20} />
          </div>
          <p className="text-2xl font-bold text-[#1A3B2E]">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
        </Link>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-[#1A3B2E] mb-4">School Skill Averages</h3>
        {skillAvg.length > 0 ? (
          <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={skillAvg}><XAxis dataKey="name" tick={{fontSize:11}} /><YAxis domain={[0,10]} /><Tooltip /><Bar dataKey="avg" fill="#E76F51" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div>
        ) : (
          <div className="h-56 flex flex-col items-center justify-center text-gray-400">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm">No skill data yet</p>
            <Link to="/students" className="text-xs text-[#E76F51] mt-2 hover:underline">Add students to get started</Link>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-[#1A3B2E] mb-4">Recent Assessments</h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#F9F7F3] rounded-xl">
              <div>
                <p className="font-medium text-sm text-[#1A3B2E]">{a.students?.full_name}</p>
                <p className="text-xs text-gray-500">{new Date(a.assessed_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1">
                {["speed","stamina","strength"].map(s => (
                  <span key={s} className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 border">{s[0].toUpperCase()}: {a[s]}</span>
                ))}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">🏃</p>
              <p className="text-sm">No assessments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link to="/coach-evaluations" className="bg-[#1A3B2E] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity">
        <ClipboardCheck size={24} className="mb-2" />
        <p className="font-semibold">Evaluate Teachers</p>
        <p className="text-xs text-white/60 mt-1">Rate PE teacher performance</p>
      </Link>
      <Link to="/cbsereports" className="bg-[#E76F51] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity">
        <FileText size={24} className="mb-2" />
        <p className="font-semibold">CBSE Reports</p>
        <p className="text-xs text-white/60 mt-1">Generate compliance PDFs</p>
      </Link>
      <Link to="/students" className="bg-white border-2 border-[#1A3B2E] text-[#1A3B2E] rounded-2xl p-5 hover:bg-[#F9F7F3] transition-colors">
        <Users size={24} className="mb-2" />
        <p className="font-semibold">Manage Students</p>
        <p className="text-xs text-gray-500 mt-1">Add classes and students</p>
      </Link>
    </div>
  </div>
)

const TeacherDashboard = ({ profile, stats, recentActivity }) => (
  <div>
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>
        Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {profile?.full_name?.split(" ")[0]}!
      </h1>
      <p className="text-gray-500 mt-1">Here are your tasks for today</p>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-8">
      {[
        { label:"My Students", value:stats.totalStudents, icon:Users, color:"bg-blue-50 text-blue-700", link:"/students" },
        { label:"Present Today", value:stats.todayAttendance, icon:ClipboardCheck, color:"bg-green-50 text-green-700", link:"/attendance" },
      ].map((stat, i) => (
        <Link key={i} to={stat.link} className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}><stat.icon size={20} /></div>
          <p className="text-2xl font-bold text-[#1A3B2E]">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
        </Link>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Link to="/attendance" className="bg-[#1A3B2E] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity">
        <ClipboardCheck size={24} className="mb-2" />
        <p className="font-semibold">Mark Attendance</p>
        <p className="text-xs text-white/60 mt-1">Quick daily roll call</p>
      </Link>
      <Link to="/skill-scores" className="bg-[#E76F51] text-white rounded-2xl p-5 hover:opacity-90 transition-opacity">
        <TrendingUp size={24} className="mb-2" />
        <p className="font-semibold">Log Skill Scores</p>
        <p className="text-xs text-white/60 mt-1">Assess students today</p>
      </Link>
      <Link to="/lesson-plans" className="bg-white border-2 border-[#1A3B2E] text-[#1A3B2E] rounded-2xl p-5 hover:bg-[#F9F7F3] transition-colors">
        <BookOpen size={24} className="mb-2" />
        <p className="font-semibold">Lesson Plans</p>
        <p className="text-xs text-gray-500 mt-1">Plan today class</p>
      </Link>
    </div>
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="font-semibold text-[#1A3B2E] mb-4">Recent Assessments</h3>
      {recentActivity.length > 0 ? (
        <div className="space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#F9F7F3] rounded-xl">
              <div>
                <p className="font-medium text-sm text-[#1A3B2E]">{a.students?.full_name}</p>
                <p className="text-xs text-gray-500">{new Date(a.assessed_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1">
                {["speed","stamina","strength"].map(s => (
                  <span key={s} className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 border">{s[0].toUpperCase()}: {a[s]}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm">No assessments yet. Start by adding students.</p>
        </div>
      )}
    </div>
  </div>
)

const GuardianDashboard = ({ profile }) => {
  const [child, setChild] = useState(null)
  const [scores, setScores] = useState(null)
  const [attendance, setAttendance] = useState(null)
  const [linkCode, setLinkCode] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [linkMsg, setLinkMsg] = useState("")

  useEffect(() => { fetchChildData() }, [profile])

  const fetchChildData = async () => {
    const { data: studentData } = await supabase
      .from("students").select("*, classes(name)")
      .eq("guardian_id", profile?.id).single()
    if (studentData) {
      setChild(studentData)
      const { data: scoreData } = await supabase
        .from("skill_scores").select("*")
        .eq("student_id", studentData.id)
        .order("assessed_at", {ascending:false}).limit(1).single()
      setScores(scoreData || null)
      const { data: attData } = await supabase
        .from("attendance").select("status").eq("student_id", studentData.id)
      const total = attData?.length || 0
      const present = attData?.filter(a => a.status==="present").length || 0
      setAttendance(total > 0 ? { total, present, pct:Math.round((present/total)*100) } : null)
    }
  }

  const searchChild = async () => {
    if (!linkCode.trim()) return
    setSearching(true)
    setSearchResults([])
    setLinkMsg("")
    const { data } = await supabase
      .from("students")
      .select("*, classes(name)")
      .or(`roll_number.ilike.%${linkCode}%,full_name.ilike.%${linkCode}%`)
    setSearchResults(data || [])
    if (!data || data.length === 0) setLinkMsg("No student found with that name or roll number.")
    setSearching(false)
  }

  const linkChild = async (student) => {
    await supabase.from("students").update({ guardian_id: profile?.id }).eq("id", student.id)
    setLinkMsg("Child linked successfully!")
    setSearchResults([])
    setLinkCode("")
    fetchChildData()
  }

  const radarData = scores ? [
    {skill:"Speed", value:scores.speed}, {skill:"Stamina", value:scores.stamina},
    {skill:"Strength", value:scores.strength}, {skill:"Agility", value:scores.agility},
    {skill:"Technique", value:scores.technique}, {skill:"Teamwork", value:scores.teamwork},
  ] : []

  if (!child) return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>My Child</h1>
        <p className="text-gray-500 mt-1">Link your child to see their progress</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md">
        <div className="text-center mb-6">
          <p className="text-5xl mb-3">👨‍👧</p>
          <h3 className="font-semibold text-[#1A3B2E] text-lg mb-1">No child linked yet</h3>
          <p className="text-sm text-gray-400">Search by your child name or roll number</p>
        </div>
        <div className="flex gap-2 mb-4">
          <input
            value={linkCode}
            onChange={e => setLinkCode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchChild()}
            placeholder="Child name or roll number..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm"
          />
          <button onClick={searchChild} disabled={searching} className="px-4 py-2 bg-[#E76F51] text-white rounded-xl text-sm font-medium disabled:opacity-50">
            <Search size={18} />
          </button>
        </div>
        {linkMsg && <p className="text-sm text-center text-gray-500 mb-3">{linkMsg}</p>}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-[#F9F7F3] rounded-xl">
                <div>
                  <p className="font-medium text-sm text-[#1A3B2E]">{s.full_name}</p>
                  <p className="text-xs text-gray-500">{s.classes?.name} • Roll: {s.roll_number || "N/A"}</p>
                </div>
                <button onClick={() => linkChild(s)} className="px-3 py-1.5 bg-[#1A3B2E] text-white rounded-full text-xs font-medium">
                  Link
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>{child.full_name}</h1>
        <p className="text-gray-500 mt-1">{child.classes?.name} • Roll No: {child.roll_number || "N/A"}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-[#1A3B2E] mb-4">Attendance</h3>
          {attendance ? (
            <div className="text-center py-4">
              <p className="text-6xl font-bold text-[#E76F51]">{attendance.pct}%</p>
              <p className="text-gray-500 text-sm mt-2">{attendance.present} of {attendance.total} days present</p>
              <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#E76F51] rounded-full transition-all" style={{width:`${attendance.pct}%`}} />
              </div>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400 text-sm">No attendance records yet</p>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-[#1A3B2E] mb-4">Skill Profile</h3>
          {radarData.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" tick={{fontSize:11}} />
                  <Radar dataKey="value" stroke="#E76F51" fill="#E76F51" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400 text-sm">No skill scores recorded yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ totalStudents:0, todayAttendance:0, upcomingEvents:0, poorEquipment:0 })
  const [recentActivity, setRecentActivity] = useState([])
  const [skillAvg, setSkillAvg] = useState([])

  useEffect(() => { if (profile?.school_id) fetchStats() }, [profile])

  const fetchStats = async () => {
    const { count: sc } = await supabase.from("students").select("*",{count:"exact",head:true}).eq("school_id",profile.school_id)
    const today = new Date().toISOString().split("T")[0]
    const { data: att } = await supabase.from("attendance").select("*").eq("school_id",profile.school_id).eq("date",today).eq("status","present")
    const { data: ev } = await supabase.from("events").select("*").eq("school_id",profile.school_id).gte("event_date",today)
    const { data: eq } = await supabase.from("equipment").select("*").eq("school_id",profile.school_id).eq("condition","poor")
    setStats({ totalStudents:sc||0, todayAttendance:att?.length||0, upcomingEvents:ev?.length||0, poorEquipment:eq?.length||0 })
    const { data: scores } = await supabase.from("skill_scores").select("*, students(full_name)").eq("school_id",profile.school_id).order("assessed_at",{ascending:false}).limit(5)
    setRecentActivity(scores||[])
    const { data: all } = await supabase.from("skill_scores").select("*").eq("school_id",profile.school_id).limit(100)
    if (all?.length > 0) {
      setSkillAvg(["speed","stamina","strength","agility","technique","teamwork"].map(s => ({
        name: s.charAt(0).toUpperCase()+s.slice(1),
        avg: (all.reduce((sum,r)=>sum+(r[s]||0),0)/all.length).toFixed(1)
      })))
    }
  }

  if (profile?.role === "guardian") return <GuardianDashboard profile={profile} />
  if (profile?.role === "pe_teacher") return <TeacherDashboard profile={profile} stats={stats} recentActivity={recentActivity} />
  return <AdminDashboard profile={profile} stats={stats} skillAvg={skillAvg} recentActivity={recentActivity} />
}

export default Dashboard
