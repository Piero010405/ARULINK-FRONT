// app/gestionar-mensajes/hooks/useAssignChat.ts
"use client";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { useChatStore } from "../store/chatStore";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";

export function useAssignChat() {
  const removeFromPending = useChatStore.getState().removeFromPending;
  const addToAssigned = useChatStore.getState().addToAssigned;

  async function assign(interactionId?: string, item?: any) {
    if (!interactionId) throw new Error("Missing interaction id");

    const endpoint = API_FRONTEND_ENDPOINTS.CHATS.INTERACTION_STATE(interactionId);

    const result = await safeFrontendFetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "derived" }),
    });

    if (!result.ok) throw new Error("Failed to assign");

    removeFromPending(interactionId);
    if (item) addToAssigned(item);
  }

  return { assign };
}
