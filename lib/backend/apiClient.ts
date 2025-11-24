// lib/backend/apiClient.ts
import { BACKEND_URL } from "./config";
import { cookies } from "next/headers";
import { getAccessToken, clearAccessToken } from "@/lib/utils/token";

function isServer() {
  return typeof window === "undefined";
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  useAuth: boolean = true
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // ================================
  // 1. Cargar token
  // ================================
  let token: string | undefined;

  if (useAuth) {
    if (isServer()) {
      const cookieStore = await cookies();
      token = cookieStore.get("access_token")?.value;
    } else {
      token = getAccessToken() ?? undefined;
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // ================================
  // 2. Request
  // ================================
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  // ================================
  // 3. Manejo de errores
  // ================================
  if (!response.ok) {
    const text = await response.text();

    // ⭐ Detectar token expirado
    if (response.status === 401 && text.includes("Token expirado")) {
      console.warn("⚠️ Token expirado detectado.");

      if (!isServer()) {
        clearAccessToken();
      }

      throw new Error("SESSION_EXPIRED"); // Señal al front
    }

    throw new Error(`Error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}
