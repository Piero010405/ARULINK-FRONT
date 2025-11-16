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
  | "PLAYED";

export interface ChatOverviewItem {
  id: string;
  name: string;
  unread_count: number;
  last_message_time: string;
  is_group: boolean;
  is_archived: boolean;
  interaction_id?: string;
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
