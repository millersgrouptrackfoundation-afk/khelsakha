import { useAuth } from "../contexts/AuthContext"
import { Bell, Menu } from "lucide-react"

const TopBar = ({ sidebarOpen, setSidebarOpen }) => {
  const { profile } = useAuth()

  const roleLabel = {
    school_admin: "School Admin",
    pe_teacher: "PE Teacher",
    guardian: "Guardian"
  }

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-[#1A3B2E]">{profile?.full_name}</p>
          <p className="text-xs text-gray-400">{roleLabel[profile?.role] || profile?.role}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#E76F51] flex items-center justify-center text-white font-bold text-sm">
          {profile?.full_name?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  )
}

export default TopBar
