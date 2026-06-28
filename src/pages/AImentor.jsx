import { useState, useRef, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Send, Bot } from "lucide-react"

const AImentor = () => {
  const { profile } = useAuth()
  const [messages, setMessages] = useState([
    {role:"assistant", content:"Hi! I am your KhelSakha AI Coaching Mentor. I can help you with lesson planning, student assessment strategies, sports coaching tips, CBSE PE guidelines, and more. What would you like help with today?"}
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}) }, [messages])

  const suggestions = [
    "Create a 45-min athletics lesson plan for Grade 8",
    "How to assess student fitness for CBSE?",
    "Tips for managing a large PE class outdoors",
    "What drills improve agility in young athletes?"
  ]

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput("")
    setMessages(prev => [...prev, {role:"user", content:msg}])
    setLoading(true)
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system:`You are KhelSakha AI Mentor, an expert PE teacher coach for Indian schools. You help PE teachers with lesson planning, student assessment, CBSE compliance, sports coaching, and athlete development. The teacher using you is ${profile?.full_name || "a PE teacher"} with role ${profile?.role || "teacher"}. Be practical, concise, and India-specific.`,
          messages:[...messages.filter(m=>m.role!=="assistant"||messages.indexOf(m)>0).map(m=>({role:m.role,content:m.content})), {role:"user",content:msg}]
        })
      })
      const data = await response.json()
      const reply = data.content?.[0]?.text || "Sorry, I could not process that. Please try again."
      setMessages(prev => [...prev, {role:"assistant", content:reply}])
    } catch (e) {
      setMessages(prev => [...prev, {role:"assistant", content:"I am having trouble connecting right now. Please check your internet and try again."}])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>AI Mentor</h1>
        <p className="text-gray-600 mt-1">Your personal coaching assistant powered by Claude AI</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden" style={{height:"calc(100vh - 220px)"}}>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
              {msg.role==="assistant" && (
                <div className="w-8 h-8 rounded-full bg-[#1A3B2E] flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <Bot size={16} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role==="user" ? "bg-[#E76F51] text-white rounded-tr-sm" : "bg-[#F9F7F3] text-[#1A3B2E] rounded-tl-sm"}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-[#1A3B2E] flex items-center justify-center mr-3 flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-[#F9F7F3] px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 pb-4 grid grid-cols-2 gap-2">
            {suggestions.map((s,i) => (
              <button key={i} onClick={() => send(s)} className="text-left px-3 py-2 bg-[#F9F7F3] rounded-xl text-xs text-[#1A3B2E] hover:bg-[#f0ece6] transition-colors border border-[#1A3B2E]/10">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
              placeholder="Ask anything about PE teaching, coaching, or student assessment..."
              className="flex-1 px-4 py-3 bg-[#F9F7F3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm"
            />
            <button onClick={() => send()} disabled={!input.trim() || loading} className="p-3 bg-[#E76F51] text-white rounded-xl hover:bg-[#d65f41] disabled:opacity-50 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AImentor
