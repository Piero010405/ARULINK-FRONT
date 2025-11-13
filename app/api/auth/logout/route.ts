// src/api/auth/logout/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { clearAccessToken } from "@/lib/utils/token";

export async function logout(): Promise<{ message: string }> {
  const response = await apiClient<{ message: string }>(
    API_BACKEND_ENDPOINTS.AUTH.LOGOUT,
    { method: "POST" }
  );
  clearAccessToken();
  return response;
}
