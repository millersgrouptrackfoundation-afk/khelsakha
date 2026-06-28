import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

const Settings = () => {
  const { profile, signOut } = useAuth()
  const [school, setSchool] = useState(null)
  const [schoolForm, setSchoolForm] = useState({ name:"", address:"" })
  const [saved, setSaved] = useState(false)
  const isAdmin = profile?.role === "school_admin"

  useEffect(() => { if (profile?.school_id) fetchSchool() }, [profile])

  const fetchSchool = async () => {
    const { data } = await supabase.from("schools").select("*").eq("id", profile.school_id).single()
    setSchool(data)
    setSchoolForm({ name: data?.name || "", address: data?.address || "" })
  }

  const saveSchool = async () => {
    await supabase.from("schools").update(schoolForm).eq("id", profile.school_id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Settings</h1>
        <p className="text-gray-600 mt-1">{isAdmin ? "Manage your account and school" : "Your account"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-semibold text-[#1A3B2E] mb-4">Your Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#E76F51] flex items-center justify-center text-white text-2xl font-bold">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-semibold text-[#1A3B2E]">{profile?.full_name}</p>
              <p className="text-sm text-gray-500 capitalize">{profile?.role?.replace("_", " ")}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Role</span>
              <span className="font-medium capitalize bg-[#1A3B2E] text-white px-2 py-0.5 rounded-full text-xs">{profile?.role?.replace("_"," ")}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">School</span>
              <span className="font-medium text-xs text-gray-600">{school?.name || "—"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Subscription</span>
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium capitalize">{school?.subscription_tier || "trial"}</span>
            </div>
          </div>
          <button onClick={signOut} className="mt-6 w-full py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium">
            Sign Out
          </button>
        </div>

        {isAdmin && school && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-[#1A3B2E] mb-4">School Details</h2>
            <p className="text-xs text-gray-400 mb-4">Only school admins can edit these settings</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input value={schoolForm.name} onChange={e => setSchoolForm({...schoolForm, name:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={schoolForm.address} onChange={e => setSchoolForm({...schoolForm, address:e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
              </div>
              <button onClick={saveSchool} className="w-full py-2 bg-[#E76F51] text-white rounded-xl hover:bg-[#d65f41] transition-colors text-sm font-medium">
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {!isAdmin && school && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-[#1A3B2E] mb-4">School Info</h2>
            <div className="space-y-3 text-sm">
              <div className="p-4 bg-[#F9F7F3] rounded-xl">
                <p className="text-xs text-gray-400 uppercase mb-1">School Name</p>
                <p className="font-medium text-[#1A3B2E]">{school.name}</p>
              </div>
              <div className="p-4 bg-[#F9F7F3] rounded-xl">
                <p className="text-xs text-gray-400 uppercase mb-1">Address</p>
                <p className="font-medium text-[#1A3B2E]">{school.address || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
