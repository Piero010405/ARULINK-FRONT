// app/gestionar-mensajes/store/chatStore.ts
"use client";

import { create } from "zustand";
import {
  ChatOverviewItem,
  Message,
  MessagesListResponse,
  AssignedStreamMessage,
} from "@/types/chats";

export interface ChatMeta {
  chat_id: string;
  interaction_id?: string;
  summary?: string;
  loading?: boolean;
  total?: number;
  limit?: number;
  offset?: number;
}

export interface ChatNotification {
  id: string;
  title: string;
  message: string;
}

interface ChatState {
  // ==========================
  // OVERVIEW
  // ==========================
  pending: ChatOverviewItem[];
  assigned: ChatOverviewItem[];

  setPending: (items: ChatOverviewItem[]) => void;
  setAssigned: (items: ChatOverviewItem[]) => void;

  removeFromPending: (interactionId: string) => void;
  addToAssigned: (item: ChatOverviewItem) => void;
  upsertOverviewItem: (item: ChatOverviewItem) => void;

  // ==========================
  // CHATS
  // ==========================
  chats: Record<string, Message[]>;
  meta: Record<string, ChatMeta>;

  setChatMessages: (key: string, resp: MessagesListResponse) => void;
  addMessageToChat: (key: string, message: Message) => void;
  updateMessageInChat: (key: string, id: string, patch: Partial<Message>) => void;
  removeMessageFromChat: (key: string, id: string) => void;

  // ==========================
  // DEDUP
  // ==========================
  processedMessageIds: Set<string>;

  // ==========================
  // BACKEND STATUS
  // ==========================
  isBackendOnline: boolean;
  setBackendOnline: (v: boolean) => void;

  // ==========================
  // STREAM (SSE)
  // ==========================
  applyStreamMessage: (msg: AssignedStreamMessage) => void;

  // ==========================
  // NOTIFICATIONS
  // ==========================
  notifications: ChatNotification[];
  addNotification: (n: ChatNotification) => void;
  removeNotification: (id: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({

  // ====================================================
  // OVERVIEW
  // ====================================================
  pending: [],
  assigned: [],
  processedMessageIds: new Set(),

  setPending: (items) => set({ pending: items }),
  setAssigned: (items) => set({ assigned: items }),

  addToAssigned: (item) =>
    set((s) => ({
      assigned: [
        ...s.assigned.filter((c) => c.interaction_id !== item.interaction_id),
        item,
      ],
    })),

  removeFromPending: (interactionId) =>
    set((s) => ({
      pending: s.pending.filter((c) => c.interaction_id !== interactionId),
    })),

  upsertOverviewItem: (item) =>
    set((s) => {
      const exists = s.assigned.find((c) => c.id === item.id);
      return exists
        ? {
            assigned: s.assigned.map((c) =>
              c.id === item.id ? { ...c, ...item } : c
            ),
          }
        : { assigned: [...s.assigned, item] };
    }),

  // ====================================================
  // CHATS + META
  // ====================================================
  chats: {},
  meta: {},

  setChatMessages: (key, resp) =>
    set((s) => {
      const messages = resp.messages.map((m) => ({
        ...m,
        timestamp:
          typeof m.timestamp === "number"
            ? new Date(m.timestamp * 1000).toISOString()
            : m.timestamp,
      }));

      const ids = messages.map((m) => m.id);
      const processedSet = new Set([...s.processedMessageIds, ...ids]);

      return {
        processedMessageIds: processedSet,
        chats: {
          ...s.chats,
          [key]: messages,
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
      };
    }),

  addMessageToChat: (key, message) =>
    set((s) => {
      const msgId = message.id;
      if (s.processedMessageIds.has(msgId)) return {};

      const normalized: Message = {
        ...message,
        timestamp:
          typeof message.timestamp === "number"
            ? new Date(message.timestamp * 1000).toISOString()
            : message.timestamp,
      };

      return {
        processedMessageIds: new Set([...s.processedMessageIds, msgId]),
        chats: {
          ...s.chats,
          [key]: [...(s.chats[key] ?? []), normalized],
        },
      };
    }),

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

  // ====================================================
  // BACKEND ONLINE / OFFLINE
  // ====================================================
  isBackendOnline: true,
  setBackendOnline: (v) => set({ isBackendOnline: v }),

  // ====================================================
  // STREAM (solo overview)
  // ====================================================
  applyStreamMessage: (msg) => {
    const id = msg.interaction_id;
    if (!id) return;

    get().upsertOverviewItem({
      id: msg.chat_id ?? id,
      name: msg.from ?? "Usuario",
      interaction_id: id,
      last_message: {
        id: msg.timestamp.toString(),
        body: msg.body,
        timestamp: new Date(msg.timestamp * 1000).toISOString(),
        from_me: msg.from_me,
        ack: 0,
        type: "text",
      },
      unread_count: 1,
      type: "individual",
      archived: false,
      pinned: false,
      timestamp: new Date(msg.timestamp * 1000).toISOString(),
      summary: null,
      picture_url: null,
    });

    get().addNotification({
      id: "notif-" + Date.now(),
      title: "Nuevo mensaje",
      message: msg.body ?? "(sin contenido)",
    });
  },

  // ====================================================
  // NOTIFICATIONS
  // ====================================================
  notifications: [],

  addNotification: (n) =>
    set((s) => ({
      notifications: [...s.notifications, n],
    })),

  removeNotification: (id) =>
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    })),
}));
