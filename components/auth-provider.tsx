"use client"

import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  userRole: string | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    let mounted = true
    const supabase = supabaseRef.current

    const fetchUserRole = async (userId: string) => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Failed to fetch profile role:", error.message)
        return "customer"
      }
      
      return profile?.role || "customer"
    }

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!mounted) return

        setUser(user)

        if (user) {
          const role = await fetchUserRole(user.id)
          if (mounted) {
            setUserRole(role)
          }
        }
      } catch (error) {
        console.error("Auth error:", error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      setUser(session?.user || null)

      if (session?.user) {
        const role = await fetchUserRole(session.user.id)
        if (mounted) {
          setUserRole(role)
        }
      } else {
        setUserRole(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, userRole, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
