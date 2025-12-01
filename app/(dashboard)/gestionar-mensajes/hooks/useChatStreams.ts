// app/gestionar-mensajes/hooks/useChatStreams.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { createSSE } from "@/lib/utils/sseClient";
import { Message } from "@/types/chats";

type StreamMessage = {
  type: string;
  interaction_id?: string;
  chat_id?: string;
  from?: string | null;
  body?: string;
  timestamp?: number; // siempre segundos
  message?: any;
  id?: string;
};

export function useChatStreams(activeInteractionId?: string | null) {
  const addMessageToChat = useChatStore.getState().addMessageToChat;

  useEffect(() => {
    if (!activeInteractionId) return;

    const url = API_FRONTEND_ENDPOINTS.CHATS.INTERACTION_STREAM(
      activeInteractionId
    );

    const stop = createSSE(url, {
      onMessage: (ev) => {
        try {
          const parsed = JSON.parse(ev.data) as StreamMessage;
          if (parsed.type !== "message") return;

          if (parsed.message?.from_me === true) return;

          const key = parsed.interaction_id ?? activeInteractionId;
          if (!key) return;

          const tsSeconds =
            typeof parsed.timestamp === "number"
              ? parsed.timestamp
              : Math.floor(Date.now() / 1000);

          const msg: Message = {
            id:
              parsed.id ??
              parsed.message?.id ??
              crypto.randomUUID(),

            body: parsed.message?.body ?? parsed.body ?? "",

            // corrige 57885
            timestamp: new Date(tsSeconds * 1000).toISOString(),

            from_me: false,
            type: parsed.message?.type ?? "text",
            from: parsed.message?.from ?? parsed.from ?? null,
            ack: 0,
          };

          addMessageToChat(key, msg);
        } catch (err) {
          console.warn("InteractionStream: JSON parse error", err);
        }
      },
    });

    return () => stop();
  }, [activeInteractionId, addMessageToChat]);
}
