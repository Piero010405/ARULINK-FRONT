"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import Header from "@/components/header"

export default function MenuPrincipal() {
  const { user } = useAuth()

  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex flex-col items-center justify-center grow text-center py-16">
        <h2 className="text-3xl font-bold text-red-700 mb-12">Bienvenido {user?.full_name}</h2>

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
