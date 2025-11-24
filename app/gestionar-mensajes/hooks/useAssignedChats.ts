// app/gestionar-mensajes/hooks/useAssignedChats.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { ChatsOverviewResponse } from "@/types/chats";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";

export function useAssignedChats() {
  const setAssigned = useChatStore((s) => s.setAssigned);

  async function fetchAssigned() {
    try {
      const res = await fetch(
        `${API_FRONTEND_ENDPOINTS.CHATS.OVERVIEW}?state=derived`,
        { cache: "no-store" }
      );
      if (!res.ok) return;

      const data: ChatsOverviewResponse = await res.json();
      if (data.success) setAssigned(data.data.chats);
    } catch (err) {
      console.error("assigned error", err);
    }
  }

  useEffect(() => {
    fetchAssigned();
  }, []);

  return {
    assigned: useChatStore((s) => s.assigned),
    refresh: fetchAssigned
  };
}
