// src/api/auth/login/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { LoginRequest, TokenResponse } from "@/types/auth";
import { setAccessToken } from "@/lib/utils/token";

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient<TokenResponse>(
    API_BACKEND_ENDPOINTS.AUTH.LOGIN,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false // No requiere token
  );

  setAccessToken(response.access_token);
  return response;
}
