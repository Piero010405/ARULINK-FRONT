// src/lib/backend/apiClient.ts
import { BACKEND_URL } from "./config";
import { cookies } from "next/headers";
import { getAccessToken, clearAccessToken } from "@/lib/utils/token";
import { safeFetch } from "@/lib/utils/safeFetch";

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

  let token: string | undefined;

  // ============================
  // 1. Token
  // ============================
  if (useAuth) {
    if (isServer()) {
      const cookieStore = await cookies();
      token = cookieStore.get("access_token")?.value;
    } else {
      token = getAccessToken() ?? undefined;
    }

    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  // ============================
  // 2. safeFetch (blindado)
  // ============================
  const res = await safeFetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
    retries: 2,
    retryDelay: 400,
    timeoutMs: 15000,
  });

  // ============================
  // 3. Manejo seguro
  // ============================
  if (res.ok) {
    return res.data as T;
  }

  // Token expirado (safeFetch ya limpió)
  if (res.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  // Error controlado
  console.warn("apiClient error response:", res);

  throw new Error(`API_ERROR_${res.status}`);
}
