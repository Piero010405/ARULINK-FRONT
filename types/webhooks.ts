// src/types/webhooks.ts
// Tipos y enumeraciones para Webhooks y estados relacionados
export enum SessionStatus {
  STARTING = "STARTING",
  SCAN_QR_CODE = "SCAN_QR_CODE",
  WORKING = "WORKING",
  FAILED = "FAILED",
  STOPPED = "STOPPED",
}

export enum PresenceStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  TYPING = "typing",
  RECORDING = "recording",
  PAUSED = "paused",
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  STICKER = "sticker",
  LOCATION = "location",
  CONTACT = "contact",
  VOICE = "voice",
}

export enum MessageAck {
  ERROR = "ERROR",
  PENDING = "PENDING",
  SERVER = "SERVER",
  DEVICE = "DEVICE",
  READ = "READ",
  PLAYED = "PLAYED",
}
