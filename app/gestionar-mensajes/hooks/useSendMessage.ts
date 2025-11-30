// app/gestionar-mensajes/hooks/useSendMessage.ts
"use client";

import { useState } from "react";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";
import { useChatStore } from "../store/chatStore";
import { Message } from "@/types/chats";

export function useSendMessage() {
  const [loading, setLoading] = useState(false);

  // Acciones del store para actualizar el chat
  const addMessageToChat = useChatStore((s) => s.addMessageToChat);
  const updateMessageInChat = useChatStore((s) => s.updateMessageInChat);

  async function send(chatId: string, text: string) {
    const body = text.trim();
    if (!chatId || !body) return;

    const tempId = `temp-${Date.now()}`;

    // ================================
    // 1. Mensaje optimista en la UI
    // ================================
    const optimisticMessage: Message = {
      id: tempId,
      body,
      type: "text",
      from: null, // desconocido / nosotros mismos
      from_me: true,
      timestamp: new Date().toISOString(),
      ack: 0, // 0 = enviando
    };

    addMessageToChat(chatId, optimisticMessage);

    // ================================
    // 2. Llamada real al backend
    //    ❗ retries = 0 para NO duplicar
    // ================================
    setLoading(true);
    try {
      const result = await safeFrontendFetch(
        API_FRONTEND_ENDPOINTS.CHATS.CHAT_MESSAGES(chatId),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "text", message: body }),
        },
        0 // 🔥 SIN reintentos en POST para evitar mensajes duplicados
      );

      setLoading(false);

      if (!result.ok) {
        // marcar como fallido en UI
        updateMessageInChat(chatId, tempId, { ack: -1 });
        throw new Error("Error al enviar mensaje");
      }

      // ================================
      // 3. Actualizar mensaje optimista
      //    con info real (si viene)
      // ================================
      const serverMsg: any = result.data?.message;

      if (serverMsg && serverMsg.id) {
        updateMessageInChat(chatId, tempId, {
          id: serverMsg.id,
          timestamp:
            typeof serverMsg.timestamp === "number"
              ? new Date(serverMsg.timestamp * 1000).toISOString()
              : serverMsg.timestamp ?? optimisticMessage.timestamp,
          ack: serverMsg.ack ?? 2, // 2 = delivered
        });
      } else {
        // si el backend no manda objeto message, al menos marcamos como enviado
        updateMessageInChat(chatId, tempId, { ack: 2 });
      }

      return result.data;
    } catch (err) {
      setLoading(false);
      // Si algo revienta (network, etc.) → marcar como fallido
      updateMessageInChat(chatId, tempId, { ack: -1 });
      throw err;
    }
  }

  return { send, loading };
}
