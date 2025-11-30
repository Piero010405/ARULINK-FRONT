// app/gestionar-mensajes/hooks/useAssignedChats.ts
"use client";

import { useEffect } from "react";
import { useChatStore } from "../store/chatStore";
import { API_FRONTEND_ENDPOINTS } from "@/lib/frontend/endpoints";
import { safeFrontendFetch } from "@/lib/utils/safeFrontendFetch";

// ❗ función selector memoizable (NO engancha setters)
const selectAssigned = (s: any) => s.assigned;

export function useAssignedChats() {
  // setter estable (NO suscribe)
  const setAssigned = useChatStore.getState().setAssigned;

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

  // lectura segura del store (SIN setter)
  const assigned = useChatStore(selectAssigned);

  return { assigned, refresh: fetchAssigned };
}
