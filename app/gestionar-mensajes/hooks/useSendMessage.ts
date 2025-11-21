// app/gestionar-mensajes/hooks/useSendMessage.ts
"use client";

import { useState } from "react";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";

export function useSendMessage() {
  const [loading, setLoading] = useState(false);

  async function send(chatId: string, message: string) {
    setLoading(true);
    try {
      const payload = {
        type: "text",
        message,
      };

      const res = await fetch(
        API_FRONTEND_ENDPOINTS.CHATS.CHAT_MESSAGES(chatId),
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Error al enviar mensaje");
      return await res.json();
    } finally {
      setLoading(false);
    }
  }

  return { send, loading };
}
