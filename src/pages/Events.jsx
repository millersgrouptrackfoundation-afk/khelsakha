import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { Plus, Trash2, Calendar } from "lucide-react"

const Events = () => {
  const { profile } = useAuth()
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:"", description:"", event_date:"", event_type:"" })
  const isAdmin = profile?.role === "school_admin"
  const isGuardian = profile?.role === "guardian"

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").eq("school_id", profile?.school_id).order("event_date")
    setEvents(data || [])
  }

  const save = async () => {
    await supabase.from("events").insert([{ ...form, school_id:profile?.school_id, created_by:profile?.id }])
    setShowForm(false)
    setForm({ title:"", description:"", event_date:"", event_type:"" })
    fetchEvents()
  }

  const del = async (id) => {
    if (!confirm("Delete event?")) return
    await supabase.from("events").delete().eq("id", id)
    fetchEvents()
  }

  const today = new Date().toISOString().split("T")[0]
  const upcoming = events.filter(e => e.event_date >= today)
  const past = events.filter(e => e.event_date < today)

  const typeColors = {
    "Sports Day":"bg-orange-100 text-orange-700",
    "Inter-House":"bg-blue-100 text-blue-700",
    "Inter-School":"bg-purple-100 text-purple-700",
    "Practice":"bg-green-100 text-green-700",
    "Other":"bg-gray-100 text-gray-700"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Events</h1>
          <p className="text-gray-600 mt-1">
            {isGuardian ? "Upcoming events at your child school" : isAdmin ? "Manage school sports events" : "Events at your school"}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(true)} className="bg-[#E76F51] text-white px-6 py-2 rounded-full hover:bg-[#d65f41] transition-colors flex items-center gap-2 text-sm font-medium">
            <Plus size={18} /> Add Event
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 max-w-lg">
          <h2 className="font-bold text-[#1A3B2E] mb-4">New Event</h2>
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Event title" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
            <input type="date" value={form.event_date} onChange={e => setForm({...form,event_date:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
            <select value={form.event_type} onChange={e => setForm({...form,event_type:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
              <option value="">Event type...</option>
              {["Sports Day","Inter-House","Inter-School","Practice","Other"].map(t => <option key={t}>{t}</option>)}
            </select>
            <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} placeholder="Description (optional)" rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51]" />
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-600">Cancel</button>
              <button onClick={save} disabled={!form.title || !form.event_date} className="flex-1 py-2 bg-[#E76F51] text-white rounded-xl disabled:opacity-50">Save Event</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-[#1A3B2E] mb-3">Upcoming ({upcoming.length})</h2>
          <div className="space-y-3">
            {upcoming.map(event => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#E76F51] text-white rounded-xl p-3 text-center min-w-[56px]">
                    <p className="text-[10px] uppercase">{new Date(event.event_date).toLocaleDateString("en",{month:"short"})}</p>
                    <p className="text-xl font-bold leading-none">{new Date(event.event_date).getDate()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A3B2E]">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {event.event_type && <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[event.event_type]||typeColors["Other"]}`}>{event.event_type}</span>}
                      {event.description && <p className="text-xs text-gray-500">{event.description}</p>}
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => del(event.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                )}
              </div>
            ))}
            {upcoming.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
                <Calendar size={36} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-400">{isGuardian ? "No upcoming events for your child" : "No upcoming events"}</p>
                {isAdmin && <button onClick={() => setShowForm(true)} className="mt-3 text-sm text-[#E76F51] hover:underline">Add first event →</button>}
              </div>
            )}
          </div>
        </div>

        {past.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-400 mb-3">Past ({past.length})</h2>
            <div className="space-y-2 opacity-60">
              {past.slice(0,5).map(event => (
                <div key={event.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-200 text-gray-600 rounded-xl p-2 text-center min-w-[48px]">
                      <p className="text-[10px]">{new Date(event.event_date).toLocaleDateString("en",{month:"short"})}</p>
                      <p className="text-lg font-bold leading-none">{new Date(event.event_date).getDate()}</p>
                    </div>
                    <p className="font-medium text-gray-600 text-sm">{event.title}</p>
                  </div>
                  {isAdmin && <button onClick={() => del(event.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
