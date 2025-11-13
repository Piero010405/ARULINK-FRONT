// src/api/auth/changePassword/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { ChangePasswordRequest } from "@/types/auth";

export async function changePassword(
  data: ChangePasswordRequest
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(
    API_BACKEND_ENDPOINTS.AUTH.CHANGE_PASSWORD,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
