// src/api/auth/me/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { AsesorInfo } from "@/types/auth";

export async function getCurrentAsesor(): Promise<AsesorInfo> {
  return apiClient<AsesorInfo>(API_BACKEND_ENDPOINTS.AUTH.ME);
}
