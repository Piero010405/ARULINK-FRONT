// app/gestionar-mensajes/hooks/usePendingChats.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";

export function usePendingChats() {
  const setPending = useChatStore((s) => s.setPending);

  async function fetchPending() {
    const result = await safeFrontendFetch(
      `${API_FRONTEND_ENDPOINTS.CHATS.OVERVIEW}?state=pending`
    );

    if (result.ok && result.data?.success) {
      setPending(result.data.data.chats);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  return {
    pending: useChatStore((s) => s.pending),
    refresh: fetchPending,
  };
}
