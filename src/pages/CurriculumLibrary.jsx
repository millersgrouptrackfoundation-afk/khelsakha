import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { ChevronRight, Loader2 } from "lucide-react"

export default function CurriculumLibrary() {
  const [view, setView] = useState("shelf")
  const [books, setBooks] = useState([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [selectedBook, setSelectedBook] = useState(null)
  const [chapters, setChapters] = useState([])
  const [warmupGames, setWarmupGames] = useState([])
  const [cooldownGames, setCooldownGames] = useState([])
  const [loadingBook, setLoadingBook] = useState(false)
  const [libraryTab, setLibraryTab] = useState("activities")
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    setLoadingBooks(true)
    const { data } = await supabase
      .from("curriculum_books")
      .select("*")
      .order("sort_order")
    setBooks(data || [])
    setLoadingBooks(false)
  }

  const openBook = async (book) => {
    setSelectedBook(book)
    setView("book")
    setLibraryTab("activities")
    setLoadingBook(true)
    const { data: chapterData } = await supabase
      .from("curriculum_chapters")
      .select("*, curriculum_activities(*)")
      .eq("book_id", book.id)
      .order("sort_order")
    const sortedChapters = (chapterData || []).map(c => ({
      ...c,
      curriculum_activities: (c.curriculum_activities || []).sort((a, b) => a.sort_order - b.sort_order)
    }))
    setChapters(sortedChapters)

    const { data: gamesData } = await supabase
      .from("curriculum_games")
      .select("*")
      .eq("book_id", book.id)
      .order("sort_order")
    setWarmupGames((gamesData || []).filter(g => g.game_type === "warmup"))
    setCooldownGames((gamesData || []).filter(g => g.game_type === "cooldown"))
    setLoadingBook(false)
  }

  const goToChapter = (chapter) => {
    setSelectedChapter(chapter)
    setSelectedActivity(null)
    setView("chapter")
  }

  const goToActivity = (activity) => {
    setSelectedActivity(activity)
    setView("activity")
  }

  const goBack = () => {
    if (view === "activity") { setView("chapter"); setSelectedActivity(null) }
    else if (view === "chapter") { setView("book"); setSelectedChapter(null) }
    else if (view === "book") { setView("shelf"); setSelectedBook(null); setChapters([]) }
  }

  const skillworldBooks = books.filter(b => b.format === "skillworld")
  const sportBooks = books.filter(b => b.format === "sport" || b.format?.startsWith("sport"))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>Curriculum Library</h1>
        <p className="text-gray-600 mt-1">MGTF · Khelo. Seekho. Badho.</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
        <span className="cursor-pointer font-semibold hover:text-[#1A3B2E]" onClick={() => { setView("shelf"); setSelectedBook(null); setSelectedChapter(null); setSelectedActivity(null) }}>Library</span>
        {selectedBook && <><ChevronRight size={14} /><span className="cursor-pointer font-semibold hover:text-[#1A3B2E]" onClick={() => { setView("book"); setSelectedChapter(null); setSelectedActivity(null) }}>{selectedBook.label}</span></>}
        {selectedChapter && <><ChevronRight size={14} /><span className="cursor-pointer font-semibold hover:text-[#1A3B2E]" onClick={() => { setView("chapter"); setSelectedActivity(null) }}>{selectedChapter.name}</span></>}
        {selectedActivity && <><ChevronRight size={14} /><span className="font-semibold text-[#1A3B2E]">{selectedActivity.code}</span></>}
      </div>

      {view === "shelf" && (
        <div>
          {loadingBooks ? (
            <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
              <Loader2 size={20} className="animate-spin" /> Loading curriculum library...
            </div>
          ) : books.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
              <p className="text-4xl mb-3">📚</p>
              <p>No curriculum books loaded yet.</p>
            </div>
          ) : (
            <>
              {skillworldBooks.length > 0 && (
                <>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Foundation Years — Skill Worlds</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    {skillworldBooks.map(book => (
                      <div key={book.id} onClick={() => openBook(book)}
                        className="bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all"
                        style={{borderLeft:`5px solid ${book.color}`}}>
                        <div className="text-3xl mb-3">{book.icon}</div>
                        <div className="font-bold text-[#1A3B2E]">{book.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{book.age_group}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {sportBooks.length > 0 && (
                <>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Middle Years — Sport Chapters</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {sportBooks.map(book => (
                      <div key={book.id} onClick={() => openBook(book)}
                        className="bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all"
                        style={{borderLeft:`5px solid ${book.color}`}}>
                        <div className="text-3xl mb-3">{book.icon}</div>
                        <div className="font-bold text-[#1A3B2E]">{book.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{book.age_group}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {view === "book" && selectedBook && (
        <div>
          <button onClick={goBack} className="mb-5 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back</button>
          <div className="rounded-2xl p-5 text-white mb-6" style={{background:`linear-gradient(135deg,${selectedBook.color},${selectedBook.color}aa)`}}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">KhelSakha Curriculum</div>
            <div className="font-black text-2xl flex items-center gap-3"><span className="text-3xl">{selectedBook.icon}</span>{selectedBook.label}</div>
            <div className="text-sm opacity-85 mt-1">{selectedBook.age_group}</div>
          </div>

          {loadingBook ? (
            <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" /> Loading chapters...
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-6 flex-wrap">
                <button onClick={() => setLibraryTab("activities")} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${libraryTab==="activities"?"bg-[#1A3B2E] text-white":"bg-white text-gray-500 border border-gray-200"}`}>
                  🎮 Chapters
                </button>
                <button onClick={() => setLibraryTab("warmup")} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${libraryTab==="warmup"?"bg-[#1A3B2E] text-white":"bg-white text-gray-500 border border-gray-200"}`}>
                  🔥 Warm-up Games ({warmupGames.length})
                </button>
                <button onClick={() => setLibraryTab("cooldown")} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${libraryTab==="cooldown"?"bg-[#1A3B2E] text-white":"bg-white text-gray-500 border border-gray-200"}`}>
                  🌙 Cool-down Games ({cooldownGames.length})
                </button>
              </div>

              {libraryTab === "activities" && (
                chapters.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No chapters found for this book yet.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapters.map(chapter => (
                      <div key={chapter.id} onClick={() => goToChapter(chapter)}
                        className="bg-white rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0"
                            style={{background:selectedBook.color+"18", color:selectedBook.color}}>
                            {chapter.code}
                          </div>
                          <div>
                            <div className="font-bold text-[#1A3B2E]">{chapter.name}</div>
                            <div className="text-xs text-gray-400">{(chapter.curriculum_activities||[]).length} activities</div>
                          </div>
                        </div>
                        {chapter.intro && <p className="text-xs text-gray-500 line-clamp-2">{chapter.intro}</p>}
                      </div>
                    ))}
                  </div>
                )
              )}

              {libraryTab === "warmup" && (
                <div className="space-y-3">
                  {warmupGames.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No warm-up games recorded for this book.</div>
                  ) : warmupGames.map(g => <GameCard key={g.id} game={g} accentColor="#f97316" />)}
                </div>
              )}

              {libraryTab === "cooldown" && (
                <div className="space-y-3">
                  {cooldownGames.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-gray-400">No cool-down games recorded for this book.</div>
                  ) : cooldownGames.map(g => <GameCard key={g.id} game={g} accentColor="#8b5cf6" />)}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {view === "chapter" && selectedChapter && (
        <div>
          <button onClick={goBack} className="mb-5 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back</button>
          <div className="rounded-2xl p-5 text-white mb-6" style={{background:selectedBook.color}}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{selectedBook.label} · Chapter</div>
            <div className="font-black text-2xl">{selectedChapter.code} · {selectedChapter.name}</div>
          </div>

          {(selectedChapter.intro || (selectedChapter.why_teach||[]).length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {selectedChapter.intro && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="font-bold text-xs uppercase tracking-wider mb-3" style={{color:selectedBook.color}}>What Is This Chapter?</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedChapter.intro}</p>
                </div>
              )}
              {(selectedChapter.why_teach||[]).length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="font-bold text-xs uppercase tracking-wider mb-3" style={{color:selectedBook.color}}>Why Teach It?</div>
                  {selectedChapter.why_teach.map((w,i) => (
                    <div key={i} className="flex gap-2 mb-2 text-sm"><span className="text-green-500 font-bold flex-shrink-0">→</span><span className="text-gray-700">{w}</span></div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(selectedChapter.stages||[]).length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
              <div className="font-bold text-xs uppercase tracking-wider mb-4" style={{color:selectedBook.color}}>Development Stages</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedChapter.stages.map((s,i) => {
                  const colors = ["#ef4444","#f59e0b","#22c55e"]
                  const bgs = ["#fef2f2","#fffbeb","#f0fdf4"]
                  return (
                    <div key={i} className="rounded-xl p-4" style={{background:bgs[i]||"#f9fafb", borderTop:`3px solid ${colors[i]||"#9ca3af"}`}}>
                      <div className="font-bold text-xs mb-2" style={{color:colors[i]||"#374151"}}>Stage {s.level} — {s.label}</div>
                      <div className="text-xs text-gray-700 leading-relaxed">{s.signs}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="font-bold text-[#1A3B2E] mb-4">Activities ({(selectedChapter.curriculum_activities||[]).length})</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(selectedChapter.curriculum_activities||[]).map(activity => (
              <div key={activity.id} onClick={() => goToActivity(activity)}
                className="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                style={{borderLeft:`4px solid ${selectedBook.color}`}}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:selectedBook.color+"18",color:selectedBook.color}}>{activity.code}</span>
                </div>
                <div className="font-bold text-sm text-[#1A3B2E] mb-1">{activity.name}</div>
                {activity.subtitle && <div className="text-xs text-gray-400 mb-2 italic">{activity.subtitle}</div>}
                <div className="text-xs text-gray-500 line-clamp-3">{activity.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "activity" && selectedActivity && selectedChapter && (
        <div>
          <button onClick={goBack} className="mb-5 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back to {selectedChapter.name}</button>
          <div className="rounded-2xl p-6 text-white mb-6" style={{background:`linear-gradient(135deg,${selectedBook.color},${selectedBook.color}aa)`}}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{selectedActivity.code}</div>
            <div className="font-black text-2xl mb-2">{selectedActivity.name}</div>
            {selectedActivity.subtitle && <div className="text-sm opacity-90 italic">{selectedActivity.subtitle}</div>}
            {selectedActivity.formation && <div className="text-sm opacity-90 mt-2">📍 {selectedActivity.formation}</div>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="font-bold text-xs uppercase tracking-wider mb-3" style={{color:selectedBook.color}}>Activity Description</div>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedActivity.description}</p>
              </div>
              {(selectedActivity.variations||[]).length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="font-bold text-xs uppercase tracking-wider mb-3" style={{color:selectedBook.color}}>Variations</div>
                  {selectedActivity.variations.map((v,i) => (
                    <div key={i} className="flex gap-2 mb-2 text-sm"><span className="font-bold flex-shrink-0" style={{color:selectedBook.color}}>→</span><span className="text-gray-700">{v}</span></div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              {(selectedActivity.equipment||[]).length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">🎒 Equipment</div>
                  {selectedActivity.equipment.map((e,i) => (
                    <div key={i} className="flex gap-2 mb-1.5 text-sm"><span style={{color:selectedBook.color}}>•</span>{e}</div>
                  ))}
                </div>
              )}
              {[
                {label:"⚠️ Safety Tip", text:selectedActivity.safety_tip, color:"#ef4444"},
                {label:"🥑 Nutrition Tip", text:selectedActivity.nutrition_tip, color:"#22c55e"},
                {label:"💡 Life Skill", text:selectedActivity.lifeskill, color:"#8b5cf6"}
              ].filter(t => t.text).map(tip => (
                <div key={tip.label} className="bg-white rounded-2xl p-4 shadow-sm" style={{borderTop:`3px solid ${tip.color}`}}>
                  <div className="font-bold text-xs mb-2" style={{color:tip.color}}>{tip.label}</div>
                  <div className="text-sm text-gray-700 leading-relaxed">{tip.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function GameCard({ game, accentColor }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{borderTop:`3px solid ${accentColor}`}}>
      <div onClick={() => setExpanded(e => !e)} className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50">
        <div className="font-bold text-sm text-[#1A3B2E]">{game.name}</div>
        <span className="text-gray-400 text-xs">{expanded?"▲":"▼"}</span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed mt-3 mb-3">{game.setup}</p>
          {game.variations && (
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Variations</p>
              <p className="text-xs text-gray-600">{game.variations}</p>
            </div>
          )}
          {game.equipment && <p className="text-xs text-gray-400 mb-3">🎒 {game.equipment}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {[
              {label:"⚠ Safety", text:game.safety_tip, color:"#ef4444"},
              {label:"🥑 Nutrition", text:game.nutrition_tip, color:"#22c55e"},
              {label:"💡 Life Skill", text:game.lifeskill, color:"#8b5cf6"}
            ].filter(t => t.text).map(tip => (
              <div key={tip.label} className="bg-gray-50 rounded-xl p-2.5" style={{borderTop:`2px solid ${tip.color}`}}>
                <div className="text-xs font-bold mb-1" style={{color:tip.color}}>{tip.label}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{tip.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
