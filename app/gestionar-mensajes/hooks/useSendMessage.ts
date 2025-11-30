// app/gestionar-mensajes/hooks/useSendMessage.ts
"use client";

import { useState } from "react";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";
import { useChatStore } from "../store/chatStore";
import type { Message } from "@/types/chats";

export function useSendMessage() {
  const [loading, setLoading] = useState(false);

  // setters directos del store (NO crean loops)
  const addMessageToChat = useChatStore.getState().addMessageToChat;
  const updateMessageInChat = useChatStore.getState().updateMessageInChat;

  async function send(chatId: string, interactionId: string, text: string) {
    const body = text.trim();
    if (!chatId || !interactionId || !body) return;

    const tempId = `temp-${Date.now()}`;

    // 1) OPTIMISTIC UPDATE — se agrega instantáneamente
    const optimisticMsg: Message = {
      id: tempId,
      body,
      type: "text",
      from_me: true,
      from: null,
      timestamp: new Date().toISOString(),
      ack: 0, // “enviando…”
    };

    addMessageToChat(interactionId, optimisticMsg);

    // 2) Llamada real (sin retries para evitar duplicados)
    setLoading(true);

    try {
      const result = await safeFrontendFetch(
        API_FRONTEND_ENDPOINTS.CHATS.CHAT_MESSAGES(chatId),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "text", message: body }),
        },
        0
      );

      setLoading(false);

      if (!result.ok) {
        updateMessageInChat(interactionId, tempId, { ack: -1 }); // error
        return;
      }

      const server = result.data?.message;

      if (server && server.id) {
        updateMessageInChat(interactionId, tempId, {
          id: server.id,
          timestamp:
            typeof server.timestamp === "number"
              ? new Date(server.timestamp * 1000).toISOString()
              : server.timestamp,
          ack: server.ack ?? 2,
        });
      } else {
        updateMessageInChat(interactionId, tempId, { ack: 2 });
      }
    } catch (err) {
      setLoading(false);
      updateMessageInChat(interactionId, tempId, { ack: -1 });
    }
  }

  return { send, loading };
}
