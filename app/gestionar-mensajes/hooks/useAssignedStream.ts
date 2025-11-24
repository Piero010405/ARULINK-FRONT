"use client";

import { useEffect } from "react";
import { AssignedStreamMessage } from "@/types/chats";
import { useChatStore } from "../store/chatStore";

export function useAssignedStream() {
  const applyStreamMessage = useChatStore((s) => s.applyStreamMessage);

  useEffect(() => {
    const ev = new EventSource("/api/chats/stream/assigned");

    ev.onmessage = (e) => {
      if (!e.data) return;

      try {
        const msg: AssignedStreamMessage = JSON.parse(e.data);

        if (msg.type === "message") {
          applyStreamMessage(msg);
        }
      } catch (err) {
        console.error("Stream JSON error:", err);
      }
    };

    ev.onerror = (err) => {
      console.warn("SSE error:", err);
    };

    return () => ev.close();
  }, []);
}
