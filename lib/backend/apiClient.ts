// src/lib/backend/apiClient.ts
import { BACKEND_URL } from "./config";
import { cookies } from "next/headers";
import { getAccessToken, clearAccessToken } from "@/lib/utils/token";
import { safeFetch } from "@/lib/utils/safeFetch";       // CLIENT
import { safeServerFetch } from "@/lib/utils/safeServerFetch"; // SERVER

function isServer() {
  return typeof window === "undefined";
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  useAuth: boolean = true
): Promise<T | { backendDown: true }> {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // ======================
  // LOAD TOKEN
  // ======================
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

  const url = `${BACKEND_URL}${endpoint}`;

  // ===================================================
  // 🌐 BROWSER MODE  → safeFetch (reintentos + HTML detect)
  // ===================================================
  if (!isServer()) {
    const res = await safeFetch(url, {
      ...options,
      headers,
      retries: 2,
      retryDelay: 300,
      timeoutMs: 15000,
    });

    // 401 → token expirado (solo caso crítico)
    if (res.status === 401) {
      clearAccessToken();
      throw new Error("SESSION_EXPIRED");
    }

    // Si el backend está caído → NO romper UI
    if (!res.ok) {
      return { backendDown: true };
    }

    return res.data as T;
  }

  // ===================================================
  // 🖥 SERVER MODE (Next.js route) → safeServerFetch
  // ===================================================
  const res = await safeServerFetch(url, {
    ...options,
    headers,
  });

  // Server también debe solo lanzar en 401
  if (res.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  // Errores 504/500/HTML → backendDown
  if (!res.ok) {
    return { backendDown: true };
  }

  return res.data as T;
}