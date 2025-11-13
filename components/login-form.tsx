"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")
    setPasswordError("")
    setGeneralError("")

    const success = await login(email, password)
    if (!success) setGeneralError("Credenciales inválidas o error de conexión")
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Panel rojo izquierdo */}
        <div className="hidden md:flex md:w-1/2 h-full bg-red-700 items-center justify-center p-12">
          <div className="text-center">
            <img src="/Arulink.jpg" alt="logo" className="mx-auto h-28 w-28 rounded-full object-cover mb-6" />
            <h2 className="text-white text-3xl font-semibold mb-2">Arulink & Gobierno del Perú</h2>
            <p className="text-red-100 text-sm max-w-xs mx-auto">
              Oficina Pública Defensora - Condorcanqui
            </p>
          </div>
        </div>

        {/* Panel blanco (formulario) */}
        <div className="w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center p-8 md:p-12">
          <div className="flex items-center justify-center mb-6 w-full max-w-md">
            <img src="/logo.png" alt="AruLink Logo" className="h-12 w-auto" />
          </div>

          <div className="max-w-md w-full">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">Acceder</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario o correo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12H8m8 0a4 4 0 10-8 0m8 0v4m0 0H8"
                      />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-700 text-gray-900 placeholder-gray-400 ${
                      emailError ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                </div>
                {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
              </div>

              {/* Campo password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 11c1.657 0 3 .895 3 2v3H9v-3c0-1.105 1.343-2 3-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 11V8a5 5 0 00-10 0v3"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-700 text-gray-900 placeholder-gray-400 ${
                      passwordError ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                </div>
                {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
              </div>

              {/* Botón principal */}
              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-3 rounded-full transition-colors duration-200 shadow-sm"
              >
                Acceder
              </button>

              {generalError && <p className="text-center text-red-600 text-sm mt-2">{generalError}</p>}

              {/* Separador */}
              <div className="flex items-center my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="px-3 text-xs text-gray-400">o</div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Botón Google */}
              <button
                type="button"
                onClick={() => console.log("Login Google")}
                className="w-full border border-gray-200 rounded-full py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
              >
                <img src="/google.png" alt="google" className="h-5 w-5" />
                <span className="text-sm text-gray-700">Continuar con Google</span>
              </button>

              {/* Forgot password */}
              <p className="text-center mt-2 text-sm">
                <a href="#" className="text-red-700 hover:underline">
                  ¿Olvidó su contraseña?
                </a>
              </p>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              Oficina Pública Defensora - Condorcanqui
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
