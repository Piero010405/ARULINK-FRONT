"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      {!isLoggedIn ? <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} /> : <Dashboard />}
    </main>
  )
}
