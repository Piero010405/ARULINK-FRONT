// app/gestionar-mensajes/hooks/useSendMessage.ts
"use client";

import { useState } from "react";
import { MessageType } from "@/types/chats";

interface SendPayload {
  type: MessageType;
  message?: string;
  file?: File;
  media_url?: string;
  latitude?: number;
  longitude?: number;
  contact_name?: string;
  contact_phone?: string;
}

export function useSendMessage() {
  const [loading, setLoading] = useState(false);

  async function uploadMedia(file: File): Promise<string> {
    // Aquí deberías usar tu proveedor real — por ahora mock:
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) throw new Error("Upload failed");
    const json = await res.json();
    return json.url; // media_url
  }

  async function send(chatId: string, payload: SendPayload) {
    setLoading(true);
    try {
      let finalPayload: any = { type: payload.type };

      if (payload.type === "text") {
        finalPayload.message = payload.message;
      }

      if (payload.type === "location") {
        finalPayload.latitude = payload.latitude;
        finalPayload.longitude = payload.longitude;
      }

      if (payload.type === "contact") {
        finalPayload.contact_name = payload.contact_name;
        finalPayload.contact_phone = payload.contact_phone;
      }

      if (
        ["image", "video", "audio", "document", "sticker", "voice"].includes(
          payload.type
        )
      ) {
        if (!payload.file)
          throw new Error("Debe adjuntar un archivo para este tipo");

        const media_url = await uploadMedia(payload.file);
        finalPayload.media_url = media_url;
        if (payload.message) finalPayload.message = payload.message;
      }

      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) throw new Error("Error al enviar mensaje");

      return await res.json();
    } finally {
      setLoading(false);
    }
  }

  return { send, loading };
}
