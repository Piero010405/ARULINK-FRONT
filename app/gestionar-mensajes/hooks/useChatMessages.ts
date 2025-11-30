// app/gestionar-mensajes/hooks/useChatMessages.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";

export function useChatMessages(interactionId?: string | null) {

  // Setter estable — no reactivo
  const setChatMessages = useChatStore.getState().setChatMessages;

  useEffect(() => {
    // no interaction id → limpiar mensajes del chat anterior
    if (!interactionId) return;

    let active = true;
    const id = interactionId; // ya es string

    async function load() {
      const result = await safeFrontendFetch(
        API_FRONTEND_ENDPOINTS.CHATS.INTERACTION(id)
      );

      if (!active) return;
      if (!result.ok) {
        console.warn("⚠ fetchMessages failed:", result);
        return;
      }

      // GUARDA LOS MENSAJES
      setChatMessages(id, result.data);
    }

    load();

    return () => {
      active = false;
    };

  }, [interactionId]);  // solo depende de interactionId
}
