// app/gestionar-mensajes/hooks/useChatsOverview.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { ChatsOverviewResponse } from "@/types/chats";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";

export function useChatsOverview(pollMs = 20000) {
  const setOverview = useChatStore((s) => s.setOverview);
  const upsertOverviewItem = useChatStore((s) => s.upsertOverviewItem);

  const fetchOverview = async () => {
    try {
      const res = await fetch(API_FRONTEND_ENDPOINTS.CHATS.OVERVIEW);
      if (!res.ok) throw new Error("Failed overview");
      const data: ChatsOverviewResponse = await res.json();
      if (data.success) {
        setOverview(data.data.chats);
      }
    } catch (err) {
      console.error("overview error", err);
    }
  };

  useEffect(() => {
    fetchOverview();
    const t = setInterval(fetchOverview, pollMs);
    return () => clearInterval(t);
  }, []);

  // optionally return helpers/selectors from store
  const overview = useChatStore((s) => s.overview);
  return { overview, refresh: fetchOverview, upsertOverviewItem };
}
