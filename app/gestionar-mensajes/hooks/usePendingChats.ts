// app/gestionar-mensajes/hooks/usePendingChats.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { ChatsOverviewResponse } from "@/types/chats";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";

export function usePendingChats() {
  const setPending = useChatStore((s) => s.setPending);

  async function fetchPending() {
    try {
      const res = await fetch(
        `${API_FRONTEND_ENDPOINTS.CHATS.OVERVIEW}?state=pending`,
        { cache: "no-store" }
      );
      if (!res.ok) return;

      const data: ChatsOverviewResponse = await res.json();
      if (data.success) setPending(data.data.chats);
    } catch (err) {
      console.error("pending error", err);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  return {
    pending: useChatStore((s) => s.pending),
    refresh: fetchPending
  };
}
