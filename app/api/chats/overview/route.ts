// src/api/chats/overview/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { ChatsOverviewResponse } from "@/types/chats";

export async function getChatsOverview(): Promise<ChatsOverviewResponse> {
  return apiClient<ChatsOverviewResponse>(
    API_BACKEND_ENDPOINTS.CHATS.OVER_VIEW,
    { method: "GET" }
  );
}
