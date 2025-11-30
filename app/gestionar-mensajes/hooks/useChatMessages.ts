// app/gestionar-mensajes/hooks/useChatMessages.ts
"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "../store/chatStore";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";

export function useChatMessages(interactionId?: string) {
  const setChatMessages = useChatStore((s) => s.setChatMessages);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);

  const fetchMessages = async () => {
    if (!interactionId) {
      setResp(null);
      return;
    }

    setLoading(true);

    const result = await safeFrontendFetch(
      API_FRONTEND_ENDPOINTS.CHATS.INTERACTION(interactionId)
    );

    if (result.ok) {
      setChatMessages(interactionId, result.data);
      setResp(result.data);
    } else {
      console.warn("fetchMessages failed:", result);
      setResp(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [interactionId]);

  const messagesFromStore = useChatStore(
    (s) => (interactionId ? s.chats[interactionId] : undefined)
  );

  const meta = useChatStore(
    (s) => (interactionId ? s.meta[interactionId] : undefined)
  );

  return {
    messages: messagesFromStore ?? [],
    loading,
    refresh: fetchMessages,
    resp,
    meta: meta ?? null,
  };
}

