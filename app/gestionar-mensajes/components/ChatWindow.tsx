// app/gestionar-mensajes/components/ChatWindow.tsx
"use client";
import { useState, useRef } from "react";
import { Message, MessageType } from "@/types/chats";
import { useSendMessage } from "../hooks/useSendMessage";

interface Props {
  chatName: string;
  messages: Message[];
  summary?: string;
  sendToChatId: string; // chat_id (519@c.us) used when sending
  interactionId?: string; // used to display incoming messages from SSE keyed by interaction_id
}

export default function ChatWindow({ chatName, messages, summary, sendToChatId, interactionId }: Props) {
  const [newMessage, setNewMessage] = useState("");
  const [type, setType] = useState<MessageType>("text");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { send } = useSendMessage();

  const handleSend = async () => {
    if (!sendToChatId) return;
    if (type === "text") {
      if (!newMessage.trim()) return;
      await send(sendToChatId, { type: "text", message: newMessage.trim() });
      setNewMessage("");
      return;
    }
    // handle other types similarly using file or prompts
    if (["image","video","audio","document","sticker","voice"].includes(type)) {
      if (!selectedFile) {
        fileInputRef.current?.click();
        return;
      }
      await send(sendToChatId, { type, file: selectedFile, message: newMessage || undefined });
      setSelectedFile(null);
      setNewMessage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (type === "location") {
      const lat = parseFloat(prompt("Latitud:") || "");
      const lon = parseFloat(prompt("Longitud:") || "");
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        await send(sendToChatId, { type: "location", latitude: lat, longitude: lon });
      } else alert("Coordenadas inválidas");
      return;
    }
    if (type === "contact") {
      const name = prompt("Nombre:") || "";
      const phone = prompt("Teléfono:") || "";
      if (name && phone) await send(sendToChatId, { type: "contact", contact_name: name, contact_phone: phone });
      return;
    }
  };

  const formatTime = (timestamp: string|number) => {
    const d = typeof timestamp === "number" ? new Date(timestamp*1000) : new Date(timestamp);
    return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  return (
    <section className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white border-b p-4">
        <h2 className="font-semibold">{chatName}</h2>
        {summary && <p className="text-xs">{summary}</p>}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.from_me ? "justify-end":"justify-start"}`}>
            <div className={`${m.from_me ? "bg-red-700 text-white":"bg-gray-200 text-gray-900"} px-4 py-2 rounded-2xl max-w-[70%]`}>
              {m.body}
              <div className="text-[10px] mt-1 text-right">{formatTime(m.timestamp)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t p-4">
        <input ref={fileInputRef} type="file" className="hidden" onChange={(e)=> setSelectedFile(e.target.files?.[0] ?? null)} 
          placeholder="file input"
        />
        {/* Type selector simplified */}
        <div className="flex gap-2 mb-2">
          {/* add buttons to set type */}
        </div>
        <div className="flex gap-3 items-center">
          <input value={newMessage} onChange={(e)=> setNewMessage(e.target.value)} className="flex-1 px-4 py-2 rounded-full border"
            placeholder="Escribe un mensaje..."
          />
          <button onClick={handleSend} className="bg-red-700 text-white px-5 py-2 rounded-full">Enviar</button>
        </div>
      </div>
    </section>
  );
}
