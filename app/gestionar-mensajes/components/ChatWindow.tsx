// app/gestionar-mensajes/components/ChatWindow.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Message } from "@/types/chats";
import { useSendMessage } from "../hooks/useSendMessage";

interface Props {
  chatName: string;
  messages: Message[];
  summary?: string;
  sendToChatId: string;      // WhatsApp chat_id
  interactionId?: string;    // not used here but kept for future updates
}

export default function ChatWindow({
  chatName,
  messages,
  summary,
  sendToChatId,
}: Props) {
  const [newMessage, setNewMessage] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const { send } = useSendMessage();

  // Ordenar mensajes ASC → más antiguos arriba
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Auto-scroll: cada vez que lleguen mensajes nuevos → bajar al final
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [sortedMessages]);

  const handleSend = async () => {
    if (!sendToChatId) return;
    if (!newMessage.trim()) return;

    // MVP: APENAS string
    await send(sendToChatId, newMessage.trim());

    setNewMessage("");
  };

  const formatTime = (timestamp: string | number) => {
    const date =
      typeof timestamp === "number"
        ? new Date(timestamp * 1000)
        : new Date(timestamp);

    return date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* HEADER DEL CHAT */}
      <div className="bg-white border-b p-4">
        <h2 className="font-semibold">{chatName}</h2>
        {summary && <p className="text-xs text-gray-500">{summary}</p>}
      </div>

      {/* LISTA DE MENSAJES */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedMessages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.from_me ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`${
                m.from_me ? "bg-red-700 text-white" : "bg-gray-200 text-gray-900"
              } px-4 py-2 rounded-2xl max-w-[70%]`}
            >
              {m.body}
              <div className="text-[10px] mt-1 text-right opacity-70">
                {formatTime(m.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT PARA ENVIAR */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-3 items-center">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full border"
            placeholder="Escribe un mensaje..."
          />
          <button
            onClick={handleSend}
            className="bg-red-700 text-white px-5 py-2 rounded-full cursor-pointer"
          >
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
}
