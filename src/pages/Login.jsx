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
    <div className="min-h-screen bg-[#F9F7F3] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1A3B2E] flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img src="/logo.png" alt="KhelSakha" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A3B2E]" style={{fontFamily:"Playfair Display,serif"}}>KhelSakha</h1>
          <p className="text-gray-500 text-sm mt-1">School Sports OS by MGTF</p>
          <p className="text-xs text-gray-400 mt-0.5 italic">Khelo. Seekho. Badho.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E76F51] text-sm"
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#E76F51] text-white rounded-xl font-semibold hover:bg-[#d65f41] transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#E76F51] font-medium hover:underline">Register</Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center space-y-1">
          <p className="text-xs text-gray-400">
            By signing in you agree to our{" "}
            <Link to="/privacy-policy" className="text-[#1A3B2E] hover:underline">Privacy Policy</Link>
          </p>
          <p className="text-xs text-gray-400">KhelSakha v6 · Miller Group Track Foundation</p>
        </div>
      </div>
    </div>
  )
}

export default Login
