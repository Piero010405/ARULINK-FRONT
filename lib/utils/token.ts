// src/lib/utils/token.ts
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
}

export function clearAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}
