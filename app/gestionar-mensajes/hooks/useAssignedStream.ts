// app/gestionar-mensajes/hooks/useAssignedStream.ts
"use client";

import { useEffect } from "react";
import { AssignedStreamMessage } from "@/types/chats";
import { useChatStore } from "../store/chatStore";
import { createSSE } from "@/lib/utils/sseClient";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";

export function useAssignedStream() {
  const applyStreamMessage = useChatStore((s) => s.applyStreamMessage);

  useEffect(() => {
    const stop = createSSE(API_FRONTEND_ENDPOINTS.CHATS.STREAM_ASSIGNED, {
      onMessage: (e) => {
        if (!e.data) return;

        try {
          const msg: AssignedStreamMessage = JSON.parse(e.data);
          if (msg.type === "message") {
            applyStreamMessage(msg);
          }
        } catch (err) {
          console.warn("AssignedStream: JSON parse error", err);
        }
      },
      onError: (ev, attempt) => {
        console.warn(
          `AssignedStream SSE error (attempt ${attempt})`,
          ev
        );
      },
      onOpen: () => {
        console.info("AssignedStream SSE conectado");
      },
      maxRetries: Infinity,
    });

    return () => {
      stop();
    };
  }, [applyStreamMessage]);
}
