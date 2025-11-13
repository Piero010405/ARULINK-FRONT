// src/api/chats/cache/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { DeleteCacheResponse } from "@/types/chats";

export async function deleteChatsCache(): Promise<DeleteCacheResponse> {
  return apiClient<DeleteCacheResponse>(
    API_BACKEND_ENDPOINTS.CHATS.DELETE_CACHE,
    { method: "DELETE" }
  );
}
