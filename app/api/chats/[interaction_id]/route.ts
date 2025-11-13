// src/api/chats/[interaction_id]/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { MessagesListResponse } from "@/types/chats";

export async function getChatMessages(
  interaction_id: string
): Promise<MessagesListResponse> {
  return apiClient<MessagesListResponse>(
    API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_BY_ID(interaction_id),
    { method: "GET" }
  );
}
