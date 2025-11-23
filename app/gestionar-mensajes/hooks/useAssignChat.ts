// app/gestionar-mensajes/hooks/useAssignChat.ts
"use client";

import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { useChatStore } from "../store/chatStore";
import { ChatOverviewItem } from "@/types/chats";

export function useAssignChat() {
  const removeFromPending = useChatStore(s => s.removeFromPending);
  const addToAssigned = useChatStore(s => s.addToAssigned);

  async function assign(interactionId: string, overviewItem?: ChatOverviewItem) {
    const endpoint = API_FRONTEND_ENDPOINTS.CHATS.INTERACTION_STATE(interactionId);

    const res = await fetch(endpoint, { method: "PATCH" });
    if (!res.ok) throw new Error("Failed to assign");

    removeFromPending(interactionId);

    if (overviewItem) addToAssigned(overviewItem);

    return await res.json();
  }

  return { assign };
}
