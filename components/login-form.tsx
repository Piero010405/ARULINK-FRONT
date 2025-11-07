"use client"

import type React from "react"

import { useState } from "react"

export default function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLoginSuccess()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        {/* Logo Space */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center text-white font-serif text-xl font-bold">
            Aru
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 text-center">Intranet</h1>
          <p className="text-center text-gray-600 mb-8 font-light">Aru Link - Manage</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario o correo
              </label>
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
            >
              Acceder
            </button>
          </form>

          {/* Forgot Password Link */}
          <p className="text-center mt-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              ¿Olvidó su contraseña?
            </a>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-8">Oficina Pública Defensora - Condorcanqui</p>
      </div>
    </div>
  )
}
