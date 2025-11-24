"use client"

import { useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthContext, User } from "./AuthContext"
import { clearAccessToken } from "@/lib/utils/token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

   // ============================================
  // LOAD SESSION INICIAL
  // ============================================
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          console.log("Loaded session user:", data)
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

  // ============================================
  // MANEJO DEL TOKEN EXPIRADO
  // ============================================
  const handleExpiredSession = () => {
    clearAccessToken();
    setUser(null);
    router.push("/login");
  };

  // Interceptor global: captura errores SESSION_EXPIRED del apiClient
  useEffect(() => {
    const originalError = console.error;

    console.error = (msg, ...rest) => {
      if (typeof msg === "string" && msg.includes("SESSION_EXPIRED")) {
        handleExpiredSession();
      }
      originalError(msg, ...rest);
    };
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) return false

      const data = await res.json()
      setUser(data.user)

      router.push("/menu-principal")
      return true
    } catch {
      return false
    }
  }

  // ============================================
  // LOGOUT
  // ============================================
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    clearAccessToken();
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
