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
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // ======================
  // TOKEN
  // ======================
  let token: string | undefined;

  if (useAuth) {
    if (isServer()) {
      const cookieStore = await cookies();
      token = cookieStore.get("access_token")?.value;
    } else {
      token = getAccessToken() ?? undefined;
    }

    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${BACKEND_URL}${endpoint}`;

  // ======================
  // CLIENT MODE (Browser)
  // ======================
  if (!isServer()) {
    const res = await safeFetch(url, {
      ...options,
      headers,
      retries: 2,
      retryDelay: 300,
      timeoutMs: 15000,
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("SESSION_EXPIRED");
      throw new Error(`API_ERROR_${res.status}`);
    }

    return res.data as T;
  }

  // ======================
  // SERVER MODE (Next.js route/SSR)
  // ======================
  const res = await safeServerFetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("SESSION_EXPIRED");
    throw new Error(`API_ERROR_${res.status}`);
  }

  return res.data as T;
}
