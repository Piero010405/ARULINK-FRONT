// app/gestionar-mensajes/hooks/useChatStreams.ts
"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";

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
  const upsertOverviewItem = useChatStore((s) => s.upsertOverviewItem);
  const setChatMessages = useChatStore((s) => s.setChatMessages);
  const assignedRef = useRef<EventSource | null>(null);
  const interactionRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // assigned stream (aggregated notifications)
    if (!assignedRef.current) {
      const url = API_FRONTEND_ENDPOINTS.CHATS.STREAM_ASSIGNED; // local proxy to backend SSE
      const es = new EventSource(url);
      assignedRef.current = es;

      es.onmessage = (ev) => {
        // backend may send :ping or data events; ignore pings that are not JSON
        try {
          const parsed = JSON.parse(ev.data) as StreamMessage;
          if (parsed.type === "message") {
            // prefer interaction_id key if present
            const key = parsed.interaction_id ?? parsed.chat_id ?? parsed.chat_id;
            const msg = parsed.message ?? { id: `${Date.now()}`, body: parsed.body, timestamp: parsed.timestamp ?? Date.now(), from_me: false, type: "text", from: parsed.from ?? null };
            if (key) {
              addMessageToChat(key, {
                id: msg.id ?? `${Date.now()}`,
                body: msg.body ?? parsed.body,
                timestamp: typeof msg.timestamp === "number" ? new Date(msg.timestamp*1000).toISOString() : msg.timestamp ?? new Date().toISOString(),
                from_me: !!msg.from_me,
                type: msg.type ?? "text",
                from: msg.from ?? parsed.from ?? null,
              });
            }
            // update overview item unread_count or last_message_time if available
            if (parsed.chat_id) {
              upsertOverviewItem({
                id: parsed.chat_id,
                name: parsed.chat_id,

                type: "individual",

                timestamp: new Date(
                  (parsed.timestamp ?? Date.now()) * 1000
                ).toISOString(),

                unread_count: 1,

                last_message: {
                  id: `${parsed.timestamp ?? Date.now()}`,
                  timestamp: new Date(
                    (parsed.timestamp ?? Date.now()) * 1000
                  ).toISOString(),
                  from_me: false,
                  type: "text",
                  body: parsed.body ?? "",
                  ack: 0,
                },

                picture_url: null,
                archived: false,
                pinned: false,
                summary: null,

                // 🔥 FIX — tu interfaz exige string
                interaction_id: parsed.interaction_id ?? parsed.chat_id,
              });
            }

          }
        } catch (e) {
          // ignore non-json messages (pings)
        }
      };

      es.onerror = (err) => {
        console.error("assigned SSE error", err);
        // try reconnect handled by EventSource automatically in browsers
      };
    }

    return () => {
      if (assignedRef.current) {
        assignedRef.current.close();
        assignedRef.current = null;
      }
    };
  }, []);

  // per-interaction stream:
  useEffect(() => {
    // close previous
    if (interactionRef.current) {
      interactionRef.current.close();
      interactionRef.current = null;
    }

    if (!activeInteractionId) return;

    const url = API_FRONTEND_ENDPOINTS.CHATS.INTERACTION_STREAM(activeInteractionId); // proxy SSE -> backend interaction stream
    const es = new EventSource(url);
    interactionRef.current = es;

    es.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(ev.data) as StreamMessage;
        if (parsed.type === "message") {
          // add to chat keyed by interaction_id
          const key = parsed.interaction_id ?? activeInteractionId;
          const msg = parsed.message ?? { id: `${Date.now()}`, body: parsed.body, timestamp: parsed.timestamp ?? Date.now(), from_me: false, type: "text", from: parsed.from ?? null };
          addMessageToChat(key, {
            id: msg.id ?? `${Date.now()}`,
            body: msg.body ?? parsed.body,
            timestamp: typeof msg.timestamp === "number" ? new Date(msg.timestamp*1000).toISOString() : msg.timestamp ?? new Date().toISOString(),
            from_me: !!msg.from_me,
            type: msg.type ?? "text",
            from: msg.from ?? parsed.from ?? null,
          });
        }
      } catch (e) {
        // ignore
      }
    };

    es.onerror = (err) => {
      console.error("interaction SSE error", err);
    };

    return () => {
      if (interactionRef.current) {
        interactionRef.current.close();
        interactionRef.current = null;
      }
    };
  }, [activeInteractionId]);

  return {}; // no direct api — store is the source of truth
}
