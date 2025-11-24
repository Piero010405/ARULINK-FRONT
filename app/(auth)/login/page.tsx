"use client"
import LoginForm from "@/components/login-form"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader } from "@/components/ui/Loader";

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.push("/menu-principal")
  }, [user, loading, router])

  if (loading) return <Loader text="Validando sesión..." />;

  return <LoginForm />
}
