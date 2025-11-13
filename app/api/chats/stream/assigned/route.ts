// src/api/chats/stream/assigned/route.ts
import { BACKEND_URL } from "@/lib/backend/config";
import { getAccessToken } from "@/lib/utils/token";

export function connectAssignedStream(): EventSource {
  const token = getAccessToken();
  const url = `${BACKEND_URL}/api/v1/chats/stream/assigned`;

  const eventSource = new EventSource(`${url}?token=${token}`);
  return eventSource;
}
