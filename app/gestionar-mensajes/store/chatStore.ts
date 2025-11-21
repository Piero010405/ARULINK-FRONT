// app/gestionar-mensajes/store/chatStore.ts
"use client";

import { create } from "zustand";
import { ChatOverviewItem, Message, MessagesListResponse } from "@/types/chats";

export interface ChatMeta {
  chat_id: string; // "519...@c.us"
  interaction_id?: string; // DB interaction id
  summary?: string;
  loading?: boolean;
  total?: number;
  limit?: number;
  offset?: number;
}

interface ChatState {
  overview: ChatOverviewItem[];
  chats: Record<string, Message[]>; // key by interaction_id OR chat_id (we will store by interaction_id if exists; fallback to chat_id)
  meta: Record<string, ChatMeta>;
  setOverview: (items: ChatOverviewItem[]) => void;
  upsertOverviewItem: (item: ChatOverviewItem) => void;
  setChatMessages: (key: string, resp: MessagesListResponse) => void;
  addMessageToChat: (key: string, message: Message) => void;
  updateMessageInChat: (key: string, id: string, patch: Partial<Message>) => void;
  removeMessageFromChat: (key: string, id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  overview: [],
  chats: {},
  meta: {},

  setOverview: (items) => set(() => ({ overview: items })),

  upsertOverviewItem: (item) =>
    set((s) => {
      const exists = s.overview.find((c) => c.id === item.id);
      const overview = exists
        ? s.overview.map((c) => (c.id === item.id ? { ...c, ...item } : c))
        : [item, ...s.overview];
      return { overview };
    }),

  setChatMessages: (key, resp) =>
    set((s) => ({
      chats: { ...s.chats, [key]: resp.messages.map((m) => ({ ...m, timestamp: typeof m.timestamp === "number" ? new Date(m.timestamp*1000).toISOString() : m.timestamp })) },
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
    set((s) => {
      const prev = s.chats[key] ?? [];
      return { chats: { ...s.chats, [key]: [...prev, message] } };
    }),

  updateMessageInChat: (key, id, patch) =>
    set((s) => ({
      chats: { ...s.chats, [key]: (s.chats[key] ?? []).map((m) => (m.id === id ? { ...m, ...patch } : m)) },
    })),

  removeMessageFromChat: (key, id) =>
    set((s) => ({ chats: { ...s.chats, [key]: (s.chats[key] ?? []).filter((m) => m.id !== id) } })),
}));
