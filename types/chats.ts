import { off } from "process";

// src/types/chats.ts
export type ChatType = "individual" | "group" | "broadcast";
export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "sticker"
  | "location"
  | "contact"
  | "voice";

export type MessageAck =
  | "ERROR"
  | "PENDING"
  | "SERVER"
  | "DEVICE"
  | "READ"
  | "PLAYED"
  | number;

export interface ChatOverviewItem {
  id: string;
  name: string;
  type: 'individual' | 'group' | string;
  timestamp: string | null;
  unread_count: number;
  last_message: string | { id: string; timestamp: string | number; from_me: boolean; type: string; body: string; ack: number } | null;
  picture_url: string | null;
  archived: boolean;
  pinned: boolean;
  summary: string | null;
  interaction_id: string;
}

export interface ChatsOverviewResponse {
  success: boolean;
  data: {
    summary: {
      total_chats: number;
      limit: number;
      offset: number;
    };
    chats: ChatOverviewItem[];
  };
  message: string;
}

export interface DeleteCacheResponse {
  message: string;
  cleared_entries: number;
  timestamp: string;
}

export interface Message {
  id: string;
  body: string;
  timestamp: string;
  from_me: boolean;
  type: MessageType;
  from: string;
  ack?: MessageAck;
}

export interface MessagesListResponse {
  messages: Message[];
  total: number;
  limit: number;
  offset: number;
  summary: string;
  chat_id: string;
}

export interface SendMessageRequest {
  type: MessageType;
  body?: string;
  media_url?: string;
  latitude?: number;
  longitude?: number;
  contact_name?: string;
  contact_phone?: string;
}

export interface SendMessageResponse {
  id: string;
  status: string;
  timestamp: number;
}

export interface UpdateInteractionStateRequest {
  state: string;
  asesor_id?: string;
}

export interface UpdateInteractionStateResponse {
  message: string;
  new_state: string;
  interaction_id: string;
}

export interface AssignedStreamMessage {
  type: "message";
  interaction_id: string;
  chat_id: string;
  from: string;
  body: string;
  timestamp: number;
  from_me: boolean;
}
