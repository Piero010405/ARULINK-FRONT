// app/gestionar-mensajes/hooks/useChatStreams.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { createSSE } from "@/lib/utils/sseClient";

type StreamMessage = {
  type: string;
  interaction_id?: string;
  chat_id?: string;
  from?: string | null;
  body?: string;
  timestamp?: number;
  message?: any;
  id?: string;
};

export function useChatStreams(activeInteractionId?: string) {
  const addMessageToChat = useChatStore((s) => s.addMessageToChat);

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

          const key = parsed.interaction_id ?? activeInteractionId;

          // Message ID robusto
          const messageId =
            parsed.id ??
            parsed.message?.id ??
            parsed.timestamp?.toString() ??
            crypto.randomUUID();

          const msgBody = parsed.message?.body ?? parsed.body;

          addMessageToChat(key, {
            id: messageId,
            body: msgBody,
            timestamp:
              typeof parsed.timestamp === "number"
                ? new Date(parsed.timestamp * 1000).toISOString()
                : new Date().toISOString(),
            from_me: parsed.message?.from_me ?? false,
            type: parsed.message?.type ?? "text",
            from: parsed.message?.from ?? parsed.from ?? null,
            ack: 0,
          });
        } catch (err) {
          console.warn("InteractionStream: JSON parse error", err);
        }
      },
      onError: (ev, attempt) => {
        console.warn(
          `InteractionStream SSE error (interaction=${activeInteractionId}, attempt=${attempt})`,
          ev
        );
      },
      onOpen: () => {
        console.info("InteractionStream SSE conectado:", activeInteractionId);
      },
      maxRetries: Infinity,
    });

    return () => stop();
  }, [activeInteractionId, addMessageToChat]);

  return {};
}
