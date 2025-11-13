// src/api/chats/[interaction_id]/stream/route.ts
import { BACKEND_URL } from "@/lib/backend/config";
import { getAccessToken } from "@/lib/utils/token";

export function connectChatStream(interaction_id: string): EventSource {
  const token = getAccessToken();
  const url = `${BACKEND_URL}/api/v1/chats/${interaction_id}/stream`;

  const eventSource = new EventSource(`${url}?token=${token}`);
  return eventSource;
}
