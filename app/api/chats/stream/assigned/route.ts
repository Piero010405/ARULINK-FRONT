// app/api/chats/stream/assigned/route.ts
import { BACKEND_URL } from "@/lib/backend/config";
import { getAccessToken } from "@/lib/utils/token";

export function connectAssignedStream(): EventSource {
  const token = getAccessToken();
  const url = `${BACKEND_URL}/api/v1/chats/stream/assigned`;
  return new EventSource(`${url}?token=${token}`);
}
