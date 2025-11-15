// lib/backend/apiClient.ts
import { BACKEND_URL } from "./config";
import { cookies } from "next/headers";
import { getAccessToken } from "@/lib/utils/token";

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

  if (useAuth) {
    let token: string | undefined;

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

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}
