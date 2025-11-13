// lib/api.ts
// helper para hacer fetch con tokens
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers })

  if (res.status === 401) {
    // token vencido o inválido
    localStorage.removeItem("token")
    window.location.href = "/login"
    return
  }

  return res
}
