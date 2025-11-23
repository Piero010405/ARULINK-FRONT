// app/gestionar-mensajes/hooks/usePendingChats.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { ChatsOverviewResponse } from "@/types/chats";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";

export function usePendingChats(pollMs = 15000) {
  const setPending = useChatStore((s) => s.setPending);

  async function fetchPending() {
    try {
      const res = await fetch(`${API_FRONTEND_ENDPOINTS.CHATS.OVERVIEW}?state=pending`);
      if (!res.ok) return;

      const data: ChatsOverviewResponse = await res.json();
      if (data.success) setPending(data.data.chats);
    } catch (err) {
      console.error("pending error", err);
    }
  }

  useEffect(() => {
    fetchPending();
    const t = setInterval(fetchPending, pollMs);
    return () => clearInterval(t);
  }, []);

  return {
    pending: useChatStore((s) => s.pending),
    refresh: fetchPending
  };
}
