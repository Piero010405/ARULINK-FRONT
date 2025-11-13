"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function MenuPrincipal() {
  const { user } = useAuth()
  const [dateTime, setDateTime] = useState("")

  const router = useRouter()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      setDateTime(formatted.replace(",", " -"))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-red-800 text-white flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo_blanco.png" alt="Gobierno del Perú" className="h-10 logo-blanco"/>
        </div>
        <div className="text-lg font-bold">{dateTime}</div>
        <h1 className="text-2xl font-extrabold">AruLink</h1>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center grow text-center py-16">
        <h2 className="text-3xl font-bold text-red-700 mb-12">Bienvenido Kenny</h2>

        <div className="flex flex-col md:flex-row gap-10">
          <button
            onClick={() => router.push("/gestionar-mensajes")}
            className="bg-gray-500 text-white font-medium px-8 py-4 rounded-2xl hover:bg-gray-600 transition"
          >
            Gestionar mensajes
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-500 text-white font-medium px-8 py-4 rounded-2xl hover:bg-gray-600 transition"
          >
            Visualizar Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
