"use client"

import { useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthContext, User } from "./AuthContext"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (err) {
        console.error("No se pudo cargar sesión:", err)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response AuthProvider:", res)

      if (!res.ok) return false

      const data = await res.json()
      setUser(data.user)

      router.push("/menu-principal")
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
