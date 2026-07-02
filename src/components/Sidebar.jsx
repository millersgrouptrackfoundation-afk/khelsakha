import { NavLink } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  LayoutDashboard, Users, ClipboardCheck, BarChart3,
  BookOpen, FileText, ClipboardList, CalendarDays,
  Package, Settings, LogOut, ChevronLeft, ChevronRight,
  Bot, Timer, CalendarClock, Library, UserCheck, School, GraduationCap
} from "lucide-react"
import { useState } from "react"

const Sidebar = () => {
  const { profile, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const role = profile?.role

  const adminLinks = [
    { to:"/dashboard", icon:LayoutDashboard, label:"Dashboard" },
    { to:"/classes", icon:School, label:"Classes" },
    { to:"/teachers", icon:GraduationCap, label:"Teachers" },
    { to:"/students", icon:Users, label:"Students" },
    { to:"/attendance", icon:ClipboardCheck, label:"Attendance" },
    { to:"/skill-scores", icon:BarChart3, label:"Skill Scores" },
    { to:"/lesson-plans", icon:BookOpen, label:"Lesson Plans" },
    { to:"/cbsereports", icon:FileText, label:"CBSE Reports" },
    { to:"/coach-evaluations", icon:ClipboardList, label:"Coach Eval" },
    { to:"/events", icon:CalendarDays, label:"Events" },
    { to:"/equipment", icon:Package, label:"Equipment" },
    { to:"/aimentor", icon:Bot, label:"AI Mentor" },
    { to:"/settings", icon:Settings, label:"Settings" },
  ]

  const teacherLinks = [
    { to:"/dashboard", icon:LayoutDashboard, label:"Dashboard" },
    { to:"/student-tracker", icon:UserCheck, label:"Student Tracker" },
    { to:"/attendance", icon:ClipboardCheck, label:"Attendance" },
    { to:"/skill-scores", icon:BarChart3, label:"Skill Scores" },
    { to:"/curriculum", icon:Library, label:"Curriculum" },
    { to:"/lesson-plans", icon:BookOpen, label:"Lesson Plans" },
    { to:"/cbsereports", icon:FileText, label:"CBSE Reports" },
    { to:"/events", icon:CalendarDays, label:"Events" },
    { to:"/planning-admin", icon:CalendarClock, label:"Planning" },
    { to:"/session-coach", icon:Timer, label:"Session Coach" },
    { to:"/aimentor", icon:Bot, label:"AI Mentor" },
    { to:"/settings", icon:Settings, label:"Settings" },
  ]

  const guardianLinks = [
    { to:"/dashboard", icon:LayoutDashboard, label:"My Child" },
    { to:"/events", icon:CalendarDays, label:"Events" },
    { to:"/settings", icon:Settings, label:"Settings" },
  ]

  const links = role === "guardian" ? guardianLinks : role === "school_admin" ? adminLinks : teacherLinks

  return (
    <aside className={`${collapsed?"w-20":"w-64"} bg-[#1A3B2E] h-screen sticky top-0 flex flex-col transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div>
            <h1 className="font-bold text-white text-lg" style={{fontFamily:"Playfair Display,serif"}}>KhelSakha</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">School Sports OS</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-auto">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? "bg-[#E76F51] text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <link.icon size={18} className="flex-shrink-0" />
            {!collapsed && link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        {!collapsed && (
          <div className="px-3 py-2 bg-white/10 rounded-xl mb-2">
            <p className="text-xs font-medium text-white truncate">{profile?.full_name}</p>
            <p className="text-[10px] text-white/50 capitalize">{profile?.role?.replace("_"," ")}</p>
          </div>
        )}
        <button onClick={signOut}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${collapsed?"justify-center":""}`}>
          <LogOut size={18} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
