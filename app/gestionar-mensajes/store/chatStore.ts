// app/gestionar-mensajes/store/chatStore.ts
"use client";

import { create } from "zustand";
import { ChatOverviewItem, Message, MessagesListResponse } from "@/types/chats";

export interface ChatMeta {
  chat_id: string;
  interaction_id?: string;
  summary?: string;
  loading?: boolean;
  total?: number;
  limit?: number;
  offset?: number;
}

interface ChatState {
  // ===============================
  // OVERVIEW (dividido)
  // ===============================
  pending: ChatOverviewItem[];
  assigned: ChatOverviewItem[];

  setPending: (items: ChatOverviewItem[]) => void;
  setAssigned: (items: ChatOverviewItem[]) => void;

  removeFromPending: (interactionId: string) => void;
  addToAssigned: (item: ChatOverviewItem) => void;

  // ===============================
  // MENSAJES
  // ===============================
  chats: Record<string, Message[]>;
  meta: Record<string, ChatMeta>;

  setChatMessages: (key: string, resp: MessagesListResponse) => void;
  addMessageToChat: (key: string, message: Message) => void;
  updateMessageInChat: (key: string, id: string, patch: Partial<Message>) => void;
  removeMessageFromChat: (key: string, id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({

  // =============================================
  // OVERVIEW
  // =============================================
  pending: [],
  assigned: [],

  setPending: (items) => set({ pending: items }),
  setAssigned: (items) => set({ assigned: items }),

  addToAssigned: (item) =>
    set((s) => ({
      assigned: [...s.assigned.filter(c => c.interaction_id !== item.interaction_id), item],
    })),

  removeFromPending: (interactionId) =>
    set((s) => ({
      pending: s.pending.filter((c) => c.interaction_id !== interactionId),
    })),

  // =============================================
  // CHATS + META
  // =============================================
  chats: {},
  meta: {},

  setChatMessages: (key, resp) =>
    set((s) => ({
      chats: {
        ...s.chats,
        [key]: resp.messages.map((m) => ({
          ...m,
          timestamp:
            typeof m.timestamp === "number"
              ? new Date(m.timestamp * 1000).toISOString()
              : m.timestamp,
        })),
      },
      meta: {
        ...s.meta,
        [key]: {
          chat_id: resp.chat_id,
          summary: resp.summary,
          total: resp.total,
          limit: resp.limit,
          offset: resp.offset,
        },
      },
    })),

  addMessageToChat: (key, message) =>
    set((s) => ({
      chats: {
        ...s.chats,
        [key]: [...(s.chats[key] ?? []), message],
      },
    })),

  updateMessageInChat: (key, id, patch) =>
    set((s) => ({
      chats: {
        ...s.chats,
        [key]: (s.chats[key] ?? []).map((m) =>
          m.id === id ? { ...m, ...patch } : m
        ),
      },
    })),

  removeMessageFromChat: (key, id) =>
    set((s) => ({
      chats: {
        ...s.chats,
        [key]: (s.chats[key] ?? []).filter((m) => m.id !== id),
      },
    })),
}));
