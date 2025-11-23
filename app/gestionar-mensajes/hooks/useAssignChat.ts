// app/gestionar-mensajes/hooks/useAssignChat.ts
"use client";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { useChatStore } from "../store/chatStore";

export function useAssignChat() {
  const removeFromPending = useChatStore(s => s.removeFromPending);
  const addToAssigned = useChatStore(s => s.addToAssigned);

  async function assign(interactionId?: string, item?: any) {
    if (!interactionId) throw new Error("Missing interaction id");

    const endpoint = API_FRONTEND_ENDPOINTS.CHATS.INTERACTION_STATE(interactionId);
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: "derived" }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error("Failed to assign: " + txt);
    }

    // update store: remove pending, add to assigned (use item if provided)
    removeFromPending(interactionId);
    if (item) addToAssigned(item);
  }

  return { assign };
}
