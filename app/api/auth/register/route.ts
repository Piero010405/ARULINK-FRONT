// src/api/auth/register/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { RegisterAsesorRequest, RegisterAsesorResponse } from "@/types/auth";

export async function registerAsesor(
  data: RegisterAsesorRequest
): Promise<RegisterAsesorResponse> {
  return apiClient<RegisterAsesorResponse>(
    API_BACKEND_ENDPOINTS.AUTH.REGISTER,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
