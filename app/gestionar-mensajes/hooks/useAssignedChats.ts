// app/gestionar-mensajes/hooks/useAssignedChats.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";

export function useAssignedChats() {
  const setAssigned = useChatStore((s) => s.setAssigned);

  async function fetchAssigned() {
    const result = await safeFrontendFetch(
      `${API_FRONTEND_ENDPOINTS.CHATS.OVERVIEW}?state=derived`
    );

    if (result.ok && result.data?.success) {
      setAssigned(result.data.data.chats);
    }
  }

  useEffect(() => {
    fetchAssigned();
  }, []);

  return {
    assigned: useChatStore((s) => s.assigned),
    refresh: fetchAssigned,
  };
}
