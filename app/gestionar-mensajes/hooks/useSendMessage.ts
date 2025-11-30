// app/gestionar-mensajes/hooks/useSendMessage.ts
"use client";

import { useState } from "react";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";

export function useSendMessage() {
  const [loading, setLoading] = useState(false);

  async function send(chatId: string, message: string) {
    setLoading(true);

    const result = await safeFrontendFetch(
      API_FRONTEND_ENDPOINTS.CHATS.CHAT_MESSAGES(chatId),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "text", message }),
      }
    );

    setLoading(false);

    if (!result.ok) {
      throw new Error("Error al enviar mensaje");
    }

    return result.data;
  }

  return { send, loading };
}
