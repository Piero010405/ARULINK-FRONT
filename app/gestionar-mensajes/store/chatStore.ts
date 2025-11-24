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

  // Nuevo método requerido por tus hooks (CORRECTO)
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
    set((s) => {
      const normalized: Message = {
        ...message,
        timestamp:
          typeof message.timestamp === "number"
            ? new Date(message.timestamp * 1000).toISOString()
            : message.timestamp,
      };

      return {
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
  // STREAM (SSE)
  // ====================================================
  applyStreamMessage: (msg) => {
    const id = msg.interaction_id;
    if (!id) return;

    const newMessage: Message = {
      id: msg.timestamp.toString(),
      type: "text",
      body: msg.body,
      from: msg.from,
      from_me: msg.from_me,
      timestamp: new Date(msg.timestamp * 1000).toISOString(),
      ack: 0,
    };

    // Evitar duplicados
    const existing = get().chats[id] ?? [];
    if (existing.some((m) => m.id === newMessage.id)) return;

    // Insertar mensaje
    set((s) => ({
      chats: {
        ...s.chats,
        [id]: [...existing, newMessage],
      },
    }));

    // Notificación
    get().addNotification({
      id: "notif-" + Date.now(),
      title: "Nuevo mensaje",
      message: newMessage.body ?? "(sin contenido)",
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
