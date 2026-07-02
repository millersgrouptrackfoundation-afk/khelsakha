import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signIn(email, password)
      navigate("/dashboard")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    }
    setLoading(false)
  }

  const features = [
    { icon:"📊", label:"Track Performance" },
    { icon:"✅", label:"Mark Attendance" },
    { icon:"📚", label:"Lesson Planning" },
    { icon:"📄", label:"CBSE Reports" },
  ]

  const roles = [
    { icon:"🏫", title:"School Administration", desc:"Manage students, teachers, classes, events and reports" },
    { icon:"🏃", title:"PE Teacher / Coach", desc:"Attendance, skill scores, lesson plans and evaluations" },
    { icon:"👨‍👩‍👧", title:"Parent / Guardian", desc:"Track your child attendance, fitness and achievements" },
  ]

  return (
    <div style={{minHeight:"100vh", display:"flex", flexDirection:"column", background:"#F9F7F3", fontFamily:"DM Sans, sans-serif"}}>

      <div style={{flex:1, display:"flex"}}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width:"48%", background:"#1A3B2E", padding:"48px 52px",
          display:"flex", flexDirection:"column", justifyContent:"space-between",
          position:"relative", overflow:"hidden",
          minHeight:"100vh"
        }}>
          <div style={{position:"absolute", top:0, right:0, width:"300px", height:"300px",
            background:"rgba(231,111,81,0.08)", borderRadius:"50%", transform:"translate(30%, -30%)"}} />
          <div style={{position:"absolute", bottom:0, left:0, width:"200px", height:"200px",
            background:"rgba(255,255,255,0.03)", borderRadius:"50%", transform:"translate(-30%, 30%)"}} />

          <div style={{position:"relative", zIndex:1}}>
            <div style={{display:"flex", alignItems:"center", gap:"12px", marginBottom:"64px"}}>
              <div style={{width:"42px", height:"42px", borderRadius:"12px", background:"#E76F51",
                display:"flex", alignItems:"center", justifyContent:"center"}}>
                <span style={{color:"white", fontSize:"20px", fontWeight:"900", fontFamily:"Playfair Display, serif"}}>K</span>
              </div>
              <div>
                <div style={{color:"white", fontWeight:"700", fontSize:"18px", fontFamily:"Playfair Display, serif", lineHeight:1}}>KhelSakha</div>
                <div style={{color:"rgba(255,255,255,0.45)", fontSize:"11px", letterSpacing:"1.5px", textTransform:"uppercase", marginTop:"2px"}}>School Sports OS</div>
              </div>
            </div>

            <div style={{marginBottom:"40px"}}>
              <h1 style={{color:"white", fontSize:"clamp(28px, 3vw, 40px)", fontWeight:"700",
                fontFamily:"Playfair Display, serif", lineHeight:"1.2", margin:"0 0 16px"}}>
                Empowering Schools.<br />
                Building <span style={{color:"#E76F51"}}>Champions.</span>
              </h1>
              <p style={{color:"rgba(255,255,255,0.55)", fontSize:"15px", lineHeight:"1.7", margin:0, maxWidth:"380px"}}>
                KhelSakha is a complete School Sports Education Ecosystem — built for principals, PE teachers and parents to track, train and elevate every student athlete.
              </p>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", maxWidth:"380px"}}>
              {features.map((f,i) => (
                <div key={i} style={{
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:"14px", padding:"16px 18px", display:"flex", alignItems:"center", gap:"12px"
                }}>
                  <span style={{fontSize:"20px"}}>{f.icon}</span>
                  <span style={{color:"rgba(255,255,255,0.8)", fontSize:"13px", fontWeight:"500"}}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{position:"relative", zIndex:1}}>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:"24px", display:"flex", alignItems:"center", gap:"8px"}}>
              <div style={{width:"6px", height:"6px", borderRadius:"50%", background:"#4ade80"}} />
              <span style={{color:"rgba(255,255,255,0.4)", fontSize:"12px"}}>Secure · Reliable · Built for Schools</span>
              <span style={{color:"rgba(255,255,255,0.2)", fontSize:"12px", marginLeft:"auto"}}>by MGTF · Gwalior</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          flex:1, display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", padding:"48px 52px", overflowY:"auto"
        }}>
          <div style={{width:"100%", maxWidth:"400px"}}>

            <div style={{marginBottom:"36px"}}>
              <h2 style={{fontSize:"26px", fontWeight:"700", color:"#1A3B2E",
                fontFamily:"Playfair Display, serif", margin:"0 0 6px"}}>Welcome back</h2>
              <p style={{color:"#9ca3af", fontSize:"14px", margin:0}}>Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} style={{marginBottom:"28px"}}>
              <div style={{marginBottom:"16px"}}>
                <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>
                  Email address
                </label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:"16px"}}>✉</span>
                  <input
                    type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="your@email.com" required
                    style={{
                      width:"100%", padding:"12px 14px 12px 40px",
                      border:"1.5px solid #e5e7eb", borderRadius:"12px",
                      fontSize:"14px", outline:"none", fontFamily:"DM Sans, sans-serif",
                      background:"white", boxSizing:"border-box", color:"#1f2937",
                      transition:"border-color 0.2s"
                    }}
                    onFocus={e=>e.target.style.borderColor="#1A3B2E"}
                    onBlur={e=>e.target.style.borderColor="#e5e7eb"}
                  />
                </div>
              </div>

              <div style={{marginBottom:"8px"}}>
                <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>
                  Password
                </label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute", left:"14px", top:"50%", transform:"translateY(-50%)", color:"#9ca3af", fontSize:"16px"}}>🔒</span>
                  <input
                    type={showPassword?"text":"password"} value={password}
                    onChange={e=>setPassword(e.target.value)}
                    placeholder="••••••••" required
                    style={{
                      width:"100%", padding:"12px 44px 12px 40px",
                      border:"1.5px solid #e5e7eb", borderRadius:"12px",
                      fontSize:"14px", outline:"none", fontFamily:"DM Sans, sans-serif",
                      background:"white", boxSizing:"border-box", color:"#1f2937",
                      transition:"border-color 0.2s"
                    }}
                    onFocus={e=>e.target.style.borderColor="#1A3B2E"}
                    onBlur={e=>e.target.style.borderColor="#e5e7eb"}
                  />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)}
                    style={{position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)",
                      background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:"16px", padding:0}}>
                    {showPassword?"🙈":"👁"}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{padding:"10px 14px", background:"#fef2f2", border:"1px solid #fecaca",
                  borderRadius:"10px", fontSize:"13px", color:"#dc2626", marginBottom:"16px", marginTop:"12px"}}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  width:"100%", padding:"13px", marginTop:"20px",
                  background:loading?"#6b7280":"#1A3B2E", color:"white", border:"none",
                  borderRadius:"12px", fontSize:"15px", fontWeight:"700",
                  cursor:loading?"not-allowed":"pointer", fontFamily:"DM Sans, sans-serif",
                  transition:"background 0.2s", letterSpacing:"0.3px"
                }}
                onMouseEnter={e=>{if(!loading)e.target.style.background="#0d2318"}}
                onMouseLeave={e=>{if(!loading)e.target.style.background="#1A3B2E"}}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <div style={{textAlign:"center", marginBottom:"36px"}}>
              <span style={{fontSize:"13px", color:"#9ca3af"}}>Don't have an account? </span>
              <Link to="/register" style={{fontSize:"13px", color:"#E76F51", fontWeight:"600", textDecoration:"none"}}>Register</Link>
            </div>

            <div style={{borderTop:"1px solid #f3f4f6", paddingTop:"28px"}}>
              <p style={{textAlign:"center", fontSize:"11px", color:"#d1d5db", marginBottom:"16px", textTransform:"uppercase", letterSpacing:"1px"}}>
                Login as
              </p>
              <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                {roles.map((r,i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:"14px",
                    padding:"14px 16px", background:"white",
                    border:"1px solid #f3f4f6", borderRadius:"14px",
                    boxShadow:"0 1px 3px rgba(0,0,0,0.04)"
                  }}>
                    <div style={{width:"38px", height:"38px", borderRadius:"10px",
                      background:i===0?"#1A3B2E10":i===1?"#E76F5110":"#3b82f610",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"18px", flexShrink:0}}>
                      {r.icon}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"13px", fontWeight:"700", color:"#1f2937", marginBottom:"2px"}}>{r.title}</div>
                      <div style={{fontSize:"11px", color:"#9ca3af", lineHeight:"1.4"}}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{textAlign:"center", marginTop:"24px"}}>
              <p style={{fontSize:"11px", color:"#d1d5db", margin:0}}>
                By signing in you agree to our{" "}
                <Link to="/privacy-policy" style={{color:"#9ca3af", textDecoration:"underline"}}>Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
