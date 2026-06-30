import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  return (
    <div style={{minHeight:"100vh", background:"#1A3B2E", display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", fontFamily:"DM Sans, sans-serif"}}>
      <div style={{width:"100%", maxWidth:"380px"}}>

        <div style={{textAlign:"center", marginBottom:"2rem"}}>
          <div style={{
            width:"64px", height:"64px", borderRadius:"16px",
            background:"#E76F51", display:"flex", alignItems:"center",
            justifyContent:"center", margin:"0 auto 1rem"
          }}>
            <span style={{color:"white", fontSize:"28px", fontWeight:"900", fontFamily:"Playfair Display, serif"}}>K</span>
          </div>
          <h1 style={{color:"white", fontSize:"26px", fontWeight:"700", margin:"0 0 4px", fontFamily:"Playfair Display, serif"}}>KhelSakha</h1>
          <p style={{color:"rgba(255,255,255,0.6)", fontSize:"13px", margin:"0 0 2px"}}>School Sports OS · by MGTF</p>
          <p style={{color:"rgba(255,255,255,0.4)", fontSize:"11px", margin:"0", fontStyle:"italic"}}>Khelo. Seekho. Badho.</p>
        </div>

        <div style={{background:"white", borderRadius:"20px", padding:"28px", boxShadow:"0 25px 60px rgba(0,0,0,0.3)"}}>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:"16px"}}>
              <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  width:"100%", padding:"11px 14px", border:"1.5px solid #e5e7eb",
                  borderRadius:"12px", fontSize:"14px", outline:"none",
                  fontFamily:"DM Sans, sans-serif", boxSizing:"border-box",
                  transition:"border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor="#E76F51"}
                onBlur={e => e.target.style.borderColor="#e5e7eb"}
              />
            </div>

            <div style={{marginBottom:"20px"}}>
              <label style={{display:"block", fontSize:"13px", fontWeight:"600", color:"#374151", marginBottom:"6px"}}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width:"100%", padding:"11px 14px", border:"1.5px solid #e5e7eb",
                  borderRadius:"12px", fontSize:"14px", outline:"none",
                  fontFamily:"DM Sans, sans-serif", boxSizing:"border-box",
                  transition:"border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor="#E76F51"}
                onBlur={e => e.target.style.borderColor="#e5e7eb"}
              />
            </div>

            {error && (
              <div style={{padding:"10px 14px", background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"10px", fontSize:"13px", color:"#dc2626", marginBottom:"16px"}}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width:"100%", padding:"13px", background:loading?"#f0a58f":"#E76F51",
                color:"white", border:"none", borderRadius:"12px",
                fontSize:"15px", fontWeight:"700", cursor:loading?"not-allowed":"pointer",
                fontFamily:"DM Sans, sans-serif", transition:"background 0.2s",
                boxShadow:"0 4px 15px rgba(231,111,81,0.4)"
              }}
              onMouseEnter={e => { if(!loading) e.target.style.background="#d65f41" }}
              onMouseLeave={e => { if(!loading) e.target.style.background="#E76F51" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{marginTop:"18px", textAlign:"center"}}>
            <p style={{fontSize:"13px", color:"#6b7280", margin:"0"}}>
              Don't have an account?{" "}
              <Link to="/register" style={{color:"#E76F51", fontWeight:"600", textDecoration:"none"}}>Register</Link>
            </p>
          </div>
        </div>

        <div style={{marginTop:"20px", textAlign:"center"}}>
          <p style={{fontSize:"11px", color:"rgba(255,255,255,0.35)", margin:"0 0 4px"}}>
            By signing in you agree to our{" "}
            <Link to="/privacy-policy" style={{color:"rgba(255,255,255,0.55)", textDecoration:"underline"}}>Privacy Policy</Link>
          </p>
          <p style={{fontSize:"11px", color:"rgba(255,255,255,0.25)", margin:"0"}}>
            KhelSakha v6 · Miller Group Track Foundation
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login
