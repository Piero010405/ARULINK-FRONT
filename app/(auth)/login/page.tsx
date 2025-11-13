"use client"
import LoginForm from "@/components/login-form"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.push("/menu-principal")
  }, [user, loading, router])

  if (loading) return <div className="p-10 text-center">Cargando...</div>

  return <LoginForm />
}
