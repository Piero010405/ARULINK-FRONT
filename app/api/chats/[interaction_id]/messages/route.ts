// src/api/chats/[interaction_id]/messages/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import {
  SendMessageRequest,
  SendMessageResponse,
} from "@/types/chats";

export async function sendMessage(
  chat_id: string,
  data: SendMessageRequest
): Promise<SendMessageResponse> {
  return apiClient<SendMessageResponse>(
    API_BACKEND_ENDPOINTS.CHATS.POST_CHAT_BY_ID(chat_id),
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}
