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
};

export function useChatStreams(activeInteractionId?: string) {
  const addMessageToChat = useChatStore((s) => s.addMessageToChat);

  // 🔥 Solo manejamos el stream por interacción.
  useEffect(() => {
    if (!activeInteractionId) return;

    const url = API_FRONTEND_ENDPOINTS.CHATS.INTERACTION_STREAM(
      activeInteractionId
    );

    const stop = createSSE(url, {
      onMessage: (ev) => {
        try {
          const parsed = JSON.parse(ev.data) as StreamMessage;
          if (parsed.type === "message") {
            const key = parsed.interaction_id ?? activeInteractionId;
            const msg =
              parsed.message ?? {
                id: `${Date.now()}`,
                body: parsed.body,
                timestamp: parsed.timestamp ?? Date.now(),
                from_me: false,
                type: "text",
                from: parsed.from ?? null,
              };

            if (!key) return;

            addMessageToChat(key, {
              id: msg.id ?? `${Date.now()}`,
              body: msg.body ?? parsed.body,
              timestamp:
                typeof msg.timestamp === "number"
                  ? new Date(msg.timestamp * 1000).toISOString()
                  : msg.timestamp ?? new Date().toISOString(),
              from_me: !!msg.from_me,
              type: msg.type ?? "text",
              from: msg.from ?? parsed.from ?? null,
            });
          }
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

    return () => {
      stop();
    };
  }, [activeInteractionId, addMessageToChat]);

  return {};
}
