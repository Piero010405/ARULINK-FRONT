// src/schemas/webhooks-schema.ts
// Esquemas de validación para Webhooks usando Zod
import { z } from "zod";
import { MessageAck, MessageType, SessionStatus, PresenceStatus } from "../types/webhooks";

export const WebhookEventSchema = z.object({
  event: z.string(),
  session: z.string().optional(),
  timestamp: z.number().optional(),
});

export const MessageEventSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  from: z.string(),
  to: z.string(),
  body: z.string().nullable().optional(),
  type: z.nativeEnum(MessageType),
  ack: z.nativeEnum(MessageAck).optional(),
  from_me: z.boolean(),
  caption: z.string().nullable().optional(),
  filename: z.string().nullable().optional(),
  mimetype: z.string().nullable().optional(),
  media_url: z.string().nullable().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  quoted_msg_id: z.string().optional(),
  forwarded: z.boolean().optional(),
});

export const MessageAckEventSchema = z.object({
  id: z.string(),
  ack: z.nativeEnum(MessageAck),
  timestamp: z.number(),
  from: z.string(),
  to: z.string(),
});

export const SessionStatusEventSchema = z.object({
  session: z.string(),
  status: z.nativeEnum(SessionStatus),
  timestamp: z.number(),
  qr: z.string().optional(),
});

export const PresenceUpdateEventSchema = z.object({
  id: z.string(),
  presence: z.nativeEnum(PresenceStatus),
  timestamp: z.number(),
});

export const WebhookResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  event_type: z.string().optional(),
  timestamp: z.string(),
});

export const WebhookEventListSchema = z.object({
  events: z.array(z.record(z.any())),
  total: z.number(),
  timestamp: z.string(),
});

export const WebhookConfigSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()),
  enabled: z.boolean().default(true),
  secret: z.string().optional(),
});
