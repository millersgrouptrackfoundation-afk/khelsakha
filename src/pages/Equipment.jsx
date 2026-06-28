import { useState, useMemo } from "react"
import { Plus, Search, Edit, Trash2, ClipboardCheck, Lightbulb, BookOpen } from "lucide-react"

const CATEGORIES = [
  { id:1, name:"Marking & Boundary", icon:"🎯", items:[
    { sno:1, name:"Saucer Cones (flat disc)", qty:40, unit:"Pcs", priority:"Essential", purpose:"Boundary marking, zones, targets, obstacle courses" },
    { sno:2, name:"Tall Cones (traffic cones)", qty:20, unit:"Pcs", priority:"Essential", purpose:"Goal posts, lane markers, distance markers, targets" },
    { sno:3, name:"Alphabet Marking Cones A-Z", qty:1, unit:"Set", priority:"Recommended", purpose:"Literacy integration, warm-up games, zone labelling" },
    { sno:4, name:"Number Marking Cones 0-9", qty:1, unit:"Set", priority:"Recommended", purpose:"Maths integration, scoring zones, number sprint games" },
    { sno:5, name:"Chalk (coloured sticks)", qty:2, unit:"Box", priority:"Essential", purpose:"Ground marking, distance marking, low-cost boundary lines" },
  ]},
  { id:2, name:"Throwing & Catching", icon:"🤾", items:[
    { sno:1, name:"Bean Bags - Standard", qty:30, unit:"Pcs", priority:"Essential", purpose:"Throwing, catching, target activities, relay games" },
    { sno:2, name:"Foam Balls - Large (20-25 cm)", qty:15, unit:"Pcs", priority:"Essential", purpose:"Catching introduction, group games, dodging activities" },
    { sno:3, name:"Rubber Balls - Medium", qty:20, unit:"Pcs", priority:"Essential", purpose:"Throwing, bouncing, partner games, target throw" },
    { sno:4, name:"Tennis Cricket Balls", qty:10, unit:"Pcs", priority:"Recommended", purpose:"Throwing distance, catching, cricket activities" },
    { sno:5, name:"Plastic Balls - Small", qty:30, unit:"Pcs", priority:"Essential", purpose:"Multi-purpose: throwing, catching, kicking, striking" },
    { sno:6, name:"Foam Javelin", qty:10, unit:"Pcs", priority:"Recommended", purpose:"Athletics throwing, overarm technique development" },
    { sno:7, name:"Flying Discs (frisbee)", qty:10, unit:"Pcs", priority:"Optional", purpose:"Throwing accuracy, team games, disc sports introduction" },
    { sno:8, name:"Skittle Targets (bowling pins)", qty:20, unit:"Pcs", priority:"Essential", purpose:"Target throwing, rolling accuracy" },
  ]},
  { id:3, name:"Ball Sports", icon:"⚽", items:[
    { sno:1, name:"Football - Size 3", qty:10, unit:"Pcs", priority:"Essential", purpose:"Football skills, kicking, dribbling, mini games" },
    { sno:2, name:"Football - Size 4", qty:6, unit:"Pcs", priority:"Recommended", purpose:"Football - older children, inter-class matches" },
    { sno:3, name:"Basketball - Size 3", qty:10, unit:"Pcs", priority:"Essential", purpose:"Basketball intro, dribbling, shooting, Class 1-3" },
    { sno:4, name:"Basketball - Size 5", qty:6, unit:"Pcs", priority:"Recommended", purpose:"Basketball - Class 4 and above, competition size" },
    { sno:5, name:"Volleyball - Size 5", qty:4, unit:"Pcs", priority:"Recommended", purpose:"Volleyball intro, net games, striking skills" },
    { sno:6, name:"Hand Pump with needle", qty:2, unit:"Pcs", priority:"Essential", purpose:"Inflating all balls - essential maintenance tool" },
  ]},
  { id:4, name:"Movement & Agility", icon:"🏃", items:[
    { sno:1, name:"Hula Hoops (standard)", qty:15, unit:"Pcs", priority:"Essential", purpose:"Skipping, targets, Musical Hoops, throwing into, jumping" },
    { sno:2, name:"Agility Ladder (6 metre)", qty:2, unit:"Pcs", priority:"Essential", purpose:"Footwork, coordination, agility circuits, warm-up" },
    { sno:3, name:"Step Hurdles - 6 inch (low)", qty:10, unit:"Pcs", priority:"Essential", purpose:"Jumping, hurdling, footwork drills, agility circuits" },
    { sno:4, name:"Step Hurdles - 9 inch (med)", qty:10, unit:"Pcs", priority:"Recommended", purpose:"Intermediate jumping, hurdling, coordination circuits" },
    { sno:5, name:"Step Hurdles - 12 inch (high)", qty:10, unit:"Pcs", priority:"Optional", purpose:"Advanced jumping, hurdling, Class 4 and above" },
    { sno:6, name:"Balance Beam Set", qty:1, unit:"Set", priority:"Recommended", purpose:"Balance skill development, beam walking, obstacle courses" },
    { sno:7, name:"Tunnel (crawl-through)", qty:1, unit:"Pc", priority:"Recommended", purpose:"Obstacle courses, adventure activities, motor development" },
    { sno:8, name:"Flexi-Poles", qty:10, unit:"Pcs", priority:"Recommended", purpose:"Slalom dribbling, agility, boundary markers" },
    { sno:9, name:"Sack Bags (sack race)", qty:24, unit:"Pcs", priority:"Optional", purpose:"Sports day events, sack race, cooperative games" },
  ]},
  { id:5, name:"Team & Cooperative", icon:"👥", items:[
    { sno:1, name:"Bibs (coloured vests)", qty:24, unit:"Pcs", priority:"Essential", purpose:"Team identification in all group games and sports" },
    { sno:2, name:"Mesh Storage Bags", qty:4, unit:"Pcs", priority:"Essential", purpose:"Ball and equipment storage, session pack-up" },
    { sno:3, name:"Parachute - 12ft, 12 handles", qty:1, unit:"Pc", priority:"Recommended", purpose:"Group cooperation games, warm-up, motor skill development" },
    { sno:4, name:"Skipping Ropes - Individual (3m)", qty:30, unit:"Pcs", priority:"Essential", purpose:"Skipping skill development, warm-up, cardio fitness" },
    { sno:5, name:"Long Rope - Group (7-10m)", qty:4, unit:"Pcs", priority:"Recommended", purpose:"Group skipping, long rope games, cooperation activities" },
  ]},
  { id:6, name:"Assessment & Admin", icon:"📋", items:[
    { sno:1, name:"Sports Mentor Log Book", qty:1, unit:"Per mentor", priority:"Essential", purpose:"Daily session recording, attendance, observations" },
    { sno:2, name:"Student Fitness Report Cards", qty:1, unit:"Per child", priority:"Essential", purpose:"Individual fitness portfolio, parent sharing" },
    { sno:3, name:"Measuring Tape - 10 metre", qty:2, unit:"Pcs", priority:"Essential", purpose:"Distance throw measurement, broad jump, sprint setup" },
    { sno:4, name:"Stopwatch", qty:2, unit:"Pcs", priority:"Essential", purpose:"Timing activities, fitness tests, sprint timing" },
    { sno:5, name:"Whistle", qty:2, unit:"Pcs", priority:"Essential", purpose:"Stop signal, session control - essential safety tool" },
    { sno:6, name:"Clipboard with pen", qty:1, unit:"Per mentor", priority:"Essential", purpose:"Recording during sessions, assessment sheets" },
    { sno:7, name:"First Aid Kit", qty:1, unit:"Per school", priority:"Essential", purpose:"Injury management - mandatory for all sports sessions" },
  ]},
  { id:7, name:"KhelSakha Extras", icon:"✨", items:[
    { sno:1, name:"Foam Noodles", qty:10, unit:"Pcs", priority:"Recommended", purpose:"Safe striking, boundary tools, balance activities" },
    { sno:2, name:"Juggling Scarves", qty:30, unit:"Pcs", priority:"Recommended", purpose:"Hand-eye coordination, catching intro, rhythm activities" },
    { sno:3, name:"Balance Discs (wobble cushions)", qty:10, unit:"Pcs", priority:"Optional", purpose:"Balance development, proprioception, cool-down stretching" },
    { sno:4, name:"Reaction Balls", qty:10, unit:"Pcs", priority:"Optional", purpose:"Hand-eye reaction, catching challenge, advanced skill work" },
    { sno:5, name:"Yoga Mats", qty:10, unit:"Pcs", priority:"Recommended", purpose:"Yoga sessions, cool-down stretching, floor activities" },
    { sno:6, name:"Target Boards", qty:2, unit:"Pcs", priority:"Recommended", purpose:"Throwing accuracy, striking skills, self-challenge scoring" },
  ]},
]

const DIY = [
  { item:"Cones", diy:"Plastic water bottles half-filled with sand · Chalk circles · Old bricks" },
  { item:"Bean Bags", diy:"Socks filled with rice or sand · Small cloth bags with dry lentils" },
  { item:"Hoops", diy:"Chalk circles on the ground · Old bicycle tyres · Ring of cones" },
  { item:"Balls", diy:"Newspaper scrunched tightly and wrapped in tape · Socks rolled into a ball" },
  { item:"Bibs/Team Vests", diy:"Strips of old cloth tucked into waistbands · Rubber bands on wrists" },
  { item:"Spot Markers", diy:"Chalk dots · Leaves placed flat · Bottle caps" },
  { item:"Skipping Ropes", diy:"Old sarees or dupattas tied end to end · Jute rope from hardware shop" },
  { item:"Skittle Targets", diy:"Plastic bottles filled with sand · Stacked small stones" },
  { item:"Agility Ladder", diy:"Chalk lines drawn parallel at 30 cm intervals · Rope lengths laid parallel" },
  { item:"Balance Beam", diy:"Raised bricks laid flat · A chalk line 5 cm wide · A plank of wood" },
  { item:"Measuring Tape", diy:"A rope knotted at every metre · A bamboo stick of known length" },
  { item:"Whistle", diy:"Clapping a fixed pattern (two claps = stop) · Hand drum" },
]

const PRIORITY_STYLES = {
  Essential:   { bg:"#fef2f2", text:"#991b1b", dot:"#ef4444" },
  Recommended: { bg:"#fffbeb", text:"#92400e", dot:"#f59e0b" },
  Optional:    { bg:"#eff6ff", text:"#1e40af", dot:"#3b82f6" },
}

function PriorityBadge({ priority }) {
  const s = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Optional
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
      style={{ background:s.bg, color:s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background:s.dot }} />
      {priority}
    </span>
  )
}

export default function Equipment() {
  const [tab, setTab] = useState("master")
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [prioFilter, setPrioFilter] = useState("all")
  const [schoolItems, setSchoolItems] = useState(() => {
    let sno = 1
    return CATEGORIES.flatMap(cat => cat.items.map(item => ({
      id: `s${sno}`, sno:sno++, category:cat.name, icon:cat.icon,
      name:item.name, qty:item.qty, unit:item.unit,
      priority:item.priority, purpose:item.purpose,
      condition:"good", notes:""
    })))
  })
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:"", category:"", qty:1, unit:"Pcs", priority:"Essential", purpose:"", condition:"good", notes:"" })

  const allItems = useMemo(() => {
    let total=0, essential=0, recommended=0, optional=0
    CATEGORIES.forEach(c => c.items.forEach(i => {
      total++
      if(i.priority==="Essential") essential++
      else if(i.priority==="Recommended") recommended++
      else optional++
    }))
    return { total, essential, recommended, optional }
  }, [])

  const filteredCategories = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      items: cat.items.filter(item => {
        if(catFilter !== "all" && cat.id !== Number(catFilter)) return false
        if(prioFilter !== "all" && item.priority !== prioFilter) return false
        if(search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.purpose.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
    })).filter(c => c.items.length > 0)
  }, [catFilter, prioFilter, search])

  const saveForm = () => {
    if (!form.name?.trim()) return
    if (editing) {
      setSchoolItems(prev => prev.map(i => i.id === editing.id ? {...i, ...form} : i))
    } else {
      setSchoolItems(prev => [...prev, { ...form, id:`s${Date.now()}`, sno:prev.length+1 }])
    }
    setShowForm(false); setEditing(null)
    setForm({ name:"", category:"", qty:1, unit:"Pcs", priority:"Essential", purpose:"", condition:"good", notes:"" })
  }

  const openEdit = (item) => { setEditing(item); setForm({...item}); setShowForm(true) }
  const deleteItem = (id) => { if(!confirm("Remove item?")) return; setSchoolItems(prev => prev.filter(i => i.id !== id).map((i,idx) => ({...i,sno:idx+1}))) }

  const conditionColors = { good:"bg-green-100 text-green-700", fair:"bg-yellow-100 text-yellow-700", poor:"bg-red-100 text-red-700" }

  const TABS = [
    { id:"master", label:"Master List", icon:"📋" },
    { id:"school", label:"School Inventory", icon:"🏫" },
    { id:"diy", label:"DIY Alternatives", icon:"💡" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Equipment Manager</h1>
        <p className="text-gray-600 mt-1">MGTF KhelSakha equipment register and inventory</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label:"Total Items", value:allItems.total, color:"bg-blue-50 text-blue-700" },
          { label:"Essential", value:allItems.essential, color:"bg-red-50 text-red-700" },
          { label:"Recommended", value:allItems.recommended, color:"bg-amber-50 text-amber-700" },
          { label:"Optional", value:allItems.optional, color:"bg-indigo-50 text-indigo-700" },
        ].map((s,i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-[#1A3B2E]">{s.value}</p>
            <p className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${s.color}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 bg-white rounded-2xl shadow-sm p-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${tab===t.id ? "bg-[#1A3B2E] text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {tab === "master" && (
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search equipment or purpose..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm" />
            </div>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            <select value={prioFilter} onChange={e => setPrioFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E76F51]">
              <option value="all">All Priorities</option>
              <option>Essential</option>
              <option>Recommended</option>
              <option>Optional</option>
            </select>
          </div>

          {filteredCategories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-sm mb-5 overflow-hidden">
              <div className="bg-[#1A3B2E] text-white px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-bold">{cat.name}</span>
                </div>
                <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs font-medium">{cat.items.length} items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F9F7F3]">
                    <tr>
                      {["#","Name","Qty","Unit","Priority","Purpose"].map(h => (
                        <th key={h} className="text-left py-2.5 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cat.items.map((item, i) => (
                      <tr key={item.sno} className={i%2===0?"bg-white":"bg-gray-50/50"}>
                        <td className="py-3 px-4 text-[#E76F51] font-bold text-xs">{item.sno}</td>
                        <td className="py-3 px-4 font-semibold text-[#1A3B2E]">{item.name}</td>
                        <td className="py-3 px-4 font-bold">{item.qty}</td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{item.unit}</td>
                        <td className="py-3 px-4"><PriorityBadge priority={item.priority} /></td>
                        <td className="py-3 px-4 text-gray-500 text-xs max-w-xs">{item.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "school" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{schoolItems.length} items in your inventory</p>
            <button onClick={() => { setEditing(null); setShowForm(true) }} className="bg-[#E76F51] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#d65f41] flex items-center gap-2">
              <Plus size={16} /> Add Item
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
              <h3 className="font-bold text-[#1A3B2E] mb-4">{editing ? "Edit Item" : "Add Item"}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Item Name *</label>
                  <input value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm" placeholder="e.g. Football Size 4" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                  <input type="number" value={form.qty} onChange={e => setForm({...form,qty:parseInt(e.target.value)||1})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Unit</label>
                  <input value={form.unit} onChange={e => setForm({...form,unit:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm" placeholder="Pcs / Set / Pc" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form,priority:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm">
                    <option>Essential</option><option>Recommended</option><option>Optional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Condition</label>
                  <select value={form.condition} onChange={e => setForm({...form,condition:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm">
                    <option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Purpose / Notes</label>
                  <input value={form.purpose} onChange={e => setForm({...form,purpose:e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm" placeholder="What is this used for?" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-600 text-sm">Cancel</button>
                <button onClick={saveForm} className="flex-1 py-2 bg-[#E76F51] text-white rounded-xl text-sm font-medium">{editing?"Update":"Add"} Item</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F9F7F3]">
                  <tr>
                    {["#","Name","Qty","Unit","Priority","Condition","Actions"].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schoolItems.map((item, i) => (
                    <tr key={item.id} className={i%2===0?"bg-white":"bg-gray-50/50"}>
                      <td className="py-3 px-4 text-[#E76F51] font-bold text-xs">{item.sno}</td>
                      <td className="py-3 px-4 font-semibold text-[#1A3B2E]">{item.name}</td>
                      <td className="py-3 px-4 font-bold">{item.qty}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{item.unit}</td>
                      <td className="py-3 px-4"><PriorityBadge priority={item.priority} /></td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${conditionColors[item.condition]}`}>{item.condition}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={14} /></button>
                          <button onClick={() => deleteItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "diy" && (
        <div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-amber-800">Zero-budget alternatives</p>
              <p className="text-sm text-amber-700 mt-1">Every item on this list can be replaced with locally available materials. Use these when budget is limited or equipment is not yet available.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DIY.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
                <p className="font-bold text-[#1A3B2E] mb-2">{d.item}</p>
                <div className="space-y-1.5">
                  {d.diy.split(" · ").map((alt, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-[#E76F51] mt-0.5 flex-shrink-0">→</span>
                      <p className="text-sm text-gray-600">{alt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
