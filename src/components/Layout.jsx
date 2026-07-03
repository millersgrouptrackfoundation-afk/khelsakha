import { useState, useEffect, useRef } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import TopBar from "./TopBar"
import { Menu } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const sidebarRef = useRef(null)
  const { profile } = useAuth()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [mobileOpen])

  useEffect(() => {
    setMobileOpen(false)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F7F3]">

      {/* ── MOBILE BACKDROP ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          style={{transition:"opacity 0.25s"}}
        />
      )}

      {/* ── SIDEBAR — desktop always visible, mobile overlay ── */}
      <div
        ref={sidebarRef}
        className="md:relative md:flex md:flex-shrink-0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 40,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .sidebar-wrapper {
              position: relative !important;
              transform: translateX(0) !important;
              z-index: auto !important;
            }
          }
        `}</style>
        <div className="sidebar-wrapper" style={{height:"100vh"}}>
          <Sidebar onClose={() => setMobileOpen(false)} />
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <p className="text-sm text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString("en-IN", {weekday:"long", day:"numeric", month:"long"})}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[#1A3B2E]">{profile?.full_name}</p>
              <p className="text-xs text-gray-400 capitalize">{profile?.role?.replace("_"," ")}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#E76F51] flex items-center justify-center text-white font-bold text-sm">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
