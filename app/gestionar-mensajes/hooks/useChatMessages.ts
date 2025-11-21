// app/gestionar-mensajes/hooks/useChatMessages.ts
"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "../store/chatStore";
import { MessagesListResponse } from "@/types/chats";

export function useChatMessages(interactionId?: string) {
  const setChatMessages = useChatStore((s) => s.setChatMessages);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<MessagesListResponse | null>(null);

  const fetchMessages = async () => {
    if (!interactionId) {
      setResp(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${interactionId}`);
      if (!res.ok) throw new Error("Failed messages");
      const data: MessagesListResponse = await res.json();
      // Key choice: use interactionId as key in store
      setChatMessages(interactionId, data);
      setResp(data);
    } catch (err) {
      console.error("fetch messages error", err);
      setResp(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [interactionId]);

  // expose messages via store (so SSE mutations are reflected)
  const messagesFromStore = useChatStore((s) => (interactionId ? s.chats[interactionId] ?? [] : []));

  // meta also from store
  const meta = useChatStore((s) => (interactionId ? s.meta[interactionId] ?? null : null));

  return { messages: messagesFromStore, loading, refresh: fetchMessages, resp, meta };
}
