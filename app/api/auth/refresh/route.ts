// src/api/auth/refresh/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { TokenResponse } from "@/types/auth";
import { setAccessToken } from "@/lib/utils/token";

export async function refreshToken(): Promise<TokenResponse> {
  const response = await apiClient<TokenResponse>(
    API_BACKEND_ENDPOINTS.AUTH.REFRESH,
    { method: "POST" }
  );

  setAccessToken(response.access_token);
  return response;
}
