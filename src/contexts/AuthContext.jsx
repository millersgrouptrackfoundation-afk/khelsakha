import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) await fetchProfile(session.user)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) await fetchProfile(session.user)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (authUser) => {
    try {
      let { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()
      if (!data) {
        const newProfile = {
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || "User",
          role: authUser.user_metadata?.role || "school_admin",
          school_id: "00000000-0000-0000-0000-000000000001"
        }
        await supabase.from("profiles").upsert([newProfile])
        data = newProfile
      }
      setProfile(data)
    } catch (e) {
      console.error("Profile error:", e)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signUp = async (email, password, fullName, role) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role: role } }
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut,
      isAuthenticated: !!user,
      isSchoolAdmin: profile?.role === "school_admin",
      isPeTeacher: profile?.role === "pe_teacher",
      isGuardian: profile?.role === "guardian"
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
