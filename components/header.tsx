"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BtnLogout from "./btn-logout"

export default function Header() {
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
    <header className="bg-red-800 text-white px-6 py-3 flex items-center justify-between relative">
      {/* Izquierda: Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo_blanco.png" alt="Gobierno del Perú" className="h-10 logo-blanco" />
      </div>

      {/* Centro: Fecha y hora */}
      <div className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">
        {dateTime}
      </div>

      {/* Derecha: Título y botón */}
      <div className="flex items-center gap-7">
        <h1 className="text-2xl font-extrabold">AruLink</h1>
            <BtnLogout />
      </div>
    </header>
  )
}
