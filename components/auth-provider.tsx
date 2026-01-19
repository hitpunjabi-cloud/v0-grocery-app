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

    const fetchUserRole = async (userId: string): Promise<string> => {
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .single()

        if (error) {
          // Ignore abort errors
          if (error.message?.includes('abort')) return "customer"
          console.error("Failed to fetch profile role:", error.message)
          return "customer"
        }
        
        return profile?.role || "customer"
      } catch (err: unknown) {
        // Ignore abort errors silently
        if (err instanceof Error && err.name === 'AbortError') return "customer"
        return "customer"
      }
    }

    const getUser = async () => {
      try {
        // Use getSession instead of getUser - it's faster and doesn't make a network call
        const { data: { session } } = await supabase.auth.getSession()

        if (!mounted) return

        const currentUser = session?.user || null
        setUser(currentUser)

        if (currentUser) {
          const role = await fetchUserRole(currentUser.id)
          if (mounted) {
            setUserRole(role)
          }
        }
      } catch (error: unknown) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') return
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
