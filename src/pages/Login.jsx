import { useState, useEffect } from "react"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

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
    { icon:"📊", label:"Track Performance", desc:"Monitor every student's athletic growth over time" },
    { icon:"✅", label:"Mark Attendance", desc:"Record class attendance in seconds, not minutes" },
    { icon:"📚", label:"Lesson Planning", desc:"Create structured, MGTF-approved PE sessions" },
    { icon:"📄", label:"CBSE Reports", desc:"Generate compliant reports with one click" },
  ]

  const roles = [
    { icon:"🏫", title:"School Administration", desc:"Manage students, teachers, classes, events and reports", color:"#1A3B2E" },
    { icon:"🏃", title:"PE Teacher / Coach", desc:"Attendance, skill scores, lesson plans and evaluations", color:"#E76F51" },
    { icon:"👨‍👩‍👧", title:"Parent / Guardian", desc:"Track your child's attendance, fitness and achievements", color:"#3b82f6" },
  ]

  const inp = {
    width:"100%", padding:"13px 14px 13px 44px",
    border:"1.5px solid #e5e7eb", borderRadius:"12px",
    fontSize:"14px", outline:"none", fontFamily:"DM Sans, sans-serif",
    background:"white", boxSizing:"border-box", color:"#1f2937",
    transition:"border-color 0.2s, box-shadow 0.2s"
  }

  return (
    <div style={{
      minHeight:"100vh", display:"flex", fontFamily:"DM Sans, sans-serif",
      opacity: mounted ? 1 : 0, transition:"opacity 0.4s ease"
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width:"50%", minHeight:"100vh", background:"#1A3B2E",
        padding:"48px 52px", display:"flex", flexDirection:"column",
        justifyContent:"space-between", position:"relative", overflow:"hidden"
      }}
        className="hidden md:flex flex-col"
      >
        <div style={{position:"absolute",top:"-80px",right:"-80px",width:"400px",height:"400px",
          background:"rgba(231,111,81,0.06)",borderRadius:"50%"}} />
        <div style={{position:"absolute",bottom:"-60px",left:"-60px",width:"300px",height:"300px",
          background:"rgba(255,255,255,0.03)",borderRadius:"50%"}} />
        <div style={{position:"absolute",top:"40%",right:"10%",width:"180px",height:"180px",
          background:"rgba(231,111,81,0.04)",borderRadius:"50%"}} />

        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"72px"}}>
            <div style={{width:"46px",height:"46px",borderRadius:"14px",background:"#E76F51",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 14px rgba(231,111,81,0.4)"}}>
              <span style={{color:"white",fontSize:"22px",fontWeight:"900",fontFamily:"Playfair Display,serif"}}>K</span>
            </div>
            <div>
              <div style={{color:"white",fontWeight:"700",fontSize:"20px",fontFamily:"Playfair Display,serif",lineHeight:1}}>KhelSakha</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",marginTop:"3px"}}>School Sports OS · by MGTF</div>
            </div>
          </div>

          <div style={{marginBottom:"16px"}}>
            <span style={{
              display:"inline-block",background:"rgba(231,111,81,0.15)",
              color:"#E76F51",fontSize:"11px",fontWeight:"700",
              padding:"5px 12px",borderRadius:"20px",letterSpacing:"0.5px",
              border:"1px solid rgba(231,111,81,0.2)",marginBottom:"20px"
            }}>India's School Sports Platform</span>
          </div>

          <h1 style={{
            color:"white",fontSize:"clamp(28px,3.2vw,42px)",fontWeight:"700",
            fontFamily:"Playfair Display,serif",lineHeight:"1.2",margin:"0 0 20px"
          }}>
            Every Child Deserves<br />
            a Chance to <span style={{color:"#E76F51"}}>Champion.</span>
          </h1>

          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"15px",lineHeight:"1.8",
            margin:"0 0 48px",maxWidth:"380px"}}>
            Helping schools discover every child's athletic potential through data, discipline and dedication.
          </p>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",maxWidth:"420px"}}>
            {features.map((f,i) => (
              <div key={i} style={{
                background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:"16px",padding:"18px 16px",
                transition:"all 0.2s",cursor:"default"
              }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.09)";e.currentTarget.style.borderColor="rgba(255,255,255,0.15)";e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{fontSize:"22px",marginBottom:"8px"}}>{f.icon}</div>
                <div style={{color:"white",fontSize:"13px",fontWeight:"600",marginBottom:"4px"}}>{f.label}</div>
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:"11px",lineHeight:"1.5"}}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{position:"relative",zIndex:1,borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"24px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
            {["🔒 Secure Login","🏫 Built for Schools","🛡️ Privacy Protected"].map((t,i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:"6px"}}>
                <span style={{color:"rgba(255,255,255,0.35)",fontSize:"11px"}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"48px 40px", overflowY:"auto",
        background:"#F9F7F3", minHeight:"100vh"
      }}>
        <div style={{width:"100%",maxWidth:"420px"}}>

          <div style={{marginBottom:"10px",display:"block"}} className="md:hidden">
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"32px"}}>
              <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"#E76F51",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:"white",fontSize:"16px",fontWeight:"900",fontFamily:"Playfair Display,serif"}}>K</span>
              </div>
              <div style={{fontWeight:"700",fontSize:"16px",color:"#1A3B2E",fontFamily:"Playfair Display,serif"}}>KhelSakha</div>
            </div>
          </div>

          <div style={{marginBottom:"32px"}}>
            <h2 style={{fontSize:"26px",fontWeight:"700",color:"#1A3B2E",
              fontFamily:"Playfair Display,serif",margin:"0 0 8px"}}>Welcome back</h2>
            <p style={{color:"#9ca3af",fontSize:"14px",margin:0}}>Sign in to continue to your account</p>
          </div>

          <div style={{
            background:"white",borderRadius:"20px",padding:"32px",
            boxShadow:"0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(0,0,0,0.08)",
            border:"1px solid rgba(0,0,0,0.04)",marginBottom:"24px"
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:"18px"}}>
                <label style={{display:"block",fontSize:"13px",fontWeight:"600",color:"#374151",marginBottom:"7px"}}>
                  Email address
                </label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:"#d1d5db",fontSize:"15px"}}>✉</span>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                    placeholder="your@school.com" required style={inp}
                    onFocus={e=>{e.target.style.borderColor="#1A3B2E";e.target.style.boxShadow="0 0 0 3px rgba(26,59,46,0.08)"}}
                    onBlur={e=>{e.target.style.borderColor="#e5e7eb";e.target.style.boxShadow="none"}} />
                </div>
              </div>

              <div style={{marginBottom:"8px"}}>
                <label style={{display:"block",fontSize:"13px",fontWeight:"600",color:"#374151",marginBottom:"7px"}}>
                  Password
                </label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:"14px",top:"50%",transform:"translateY(-50%)",color:"#d1d5db",fontSize:"15px"}}>🔒</span>
                  <input type={showPassword?"text":"password"} value={password}
                    onChange={e=>setPassword(e.target.value)}
                    placeholder="••••••••" required
                    style={{...inp,paddingRight:"46px"}}
                    onFocus={e=>{e.target.style.borderColor="#1A3B2E";e.target.style.boxShadow="0 0 0 3px rgba(26,59,46,0.08)"}}
                    onBlur={e=>{e.target.style.borderColor="#e5e7eb";e.target.style.boxShadow="none"}} />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)}
                    style={{position:"absolute",right:"14px",top:"50%",transform:"translateY(-50%)",
                      background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:"14px",padding:0}}>
                    {showPassword?"Hide":"Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{padding:"11px 14px",background:"#fef2f2",border:"1px solid #fecaca",
                  borderRadius:"10px",fontSize:"13px",color:"#dc2626",marginTop:"14px"}}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{
                  width:"100%",padding:"14px",marginTop:"22px",
                  background:loading?"#6b7280":"#1A3B2E",color:"white",
                  border:"none",borderRadius:"12px",fontSize:"15px",fontWeight:"700",
                  cursor:loading?"not-allowed":"pointer",fontFamily:"DM Sans,sans-serif",
                  transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",
                  boxShadow:loading?"none":"0 4px 14px rgba(26,59,46,0.25)"
                }}
                onMouseEnter={e=>{if(!loading){e.target.style.background="#0d2318";e.target.style.transform="translateY(-1px)";e.target.style.boxShadow="0 6px 20px rgba(26,59,46,0.35)"}}}
                onMouseLeave={e=>{if(!loading){e.target.style.background="#1A3B2E";e.target.style.transform="translateY(0)";e.target.style.boxShadow="0 4px 14px rgba(26,59,46,0.25)"}}}>
                {loading ? (
                  <>
                    <span style={{width:"16px",height:"16px",border:"2px solid rgba(255,255,255,0.3)",
                      borderTopColor:"white",borderRadius:"50%",display:"inline-block",
                      animation:"spin 0.8s linear infinite"}} />
                    Signing you in...
                  </>
                ) : "Sign In →"}
              </button>
            </form>

            <div style={{textAlign:"center",marginTop:"20px"}}>
              <span style={{fontSize:"13px",color:"#9ca3af"}}>Don't have an account? </span>
              <Link to="/register" style={{fontSize:"13px",color:"#E76F51",fontWeight:"600",textDecoration:"none"}}>Register</Link>
            </div>
          </div>

          <div style={{marginBottom:"20px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
              <div style={{flex:1,height:"1px",background:"#e5e7eb"}} />
              <span style={{fontSize:"11px",color:"#9ca3af",fontWeight:"600",letterSpacing:"1px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Designed for Every Role</span>
              <div style={{flex:1,height:"1px",background:"#e5e7eb"}} />
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {roles.map((r,i) => (
                <div key={i} style={{
                  display:"flex",alignItems:"center",gap:"14px",
                  padding:"13px 16px",background:"white",
                  border:"1px solid #f3f4f6",borderRadius:"14px",
                  transition:"all 0.15s",cursor:"default"
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)";e.currentTarget.style.transform="translateY(-1px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#f3f4f6";e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)"}}>
                  <div style={{width:"38px",height:"38px",borderRadius:"10px",
                    background:`${r.color}12`,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:"18px",flexShrink:0}}>
                    {r.icon}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"13px",fontWeight:"700",color:"#1f2937",marginBottom:"2px"}}>{r.title}</div>
                    <div style={{fontSize:"11px",color:"#9ca3af",lineHeight:"1.4"}}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={{textAlign:"center",fontSize:"11px",color:"#d1d5db",margin:0}}>
            By signing in you agree to our{" "}
            <Link to="/privacy-policy" style={{color:"#9ca3af",textDecoration:"underline"}}>Privacy Policy</Link>
            {" "}· KhelSakha v6 · MGTF
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 768px) {
          .hidden { display: none !important; }
          .md\\:flex { display: flex !important; }
        }
        @media (min-width: 769px) {
          .md\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default Login
