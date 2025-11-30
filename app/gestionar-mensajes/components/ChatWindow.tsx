// app/gestionar-mensajes/components/ChatWindow.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Message } from "@/types/chats";
import { useSendMessage } from "../hooks/useSendMessage";

interface Props {
  chatName: string;
  messages: Message[];
  summary?: string;
  sendToChatId: string;
  interactionId?: string;
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

  // Orden ASC
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // SCROLL AL FINAL
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [sortedMessages]);

  // ENVÍO DE MENSAJE
  const handleSend = async () => {
    if (!sendToChatId || !newMessage.trim()) return;

    await send(sendToChatId, newMessage);
    setNewMessage(""); // limpiar input
  };

  // FORMATEO DE FECHA
  const formatTime = (timestamp: string | number) => {
    const date = typeof timestamp === "number" 
      ? new Date(timestamp * 1000)
      : new Date(timestamp);

    return date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ===========================================
  // SEPARADORE DE FECHA
  // ===========================================
  const formatDateBadge = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    if (date.toDateString() === today.toDateString()) return "Hoy";
    if (date.toDateString() === yesterday.toDateString()) return "Ayer";

    return date.toLocaleDateString("es-PE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderMessages = () => {
    let lastDate = "";

    return sortedMessages.map((m) => {
      const msgDate = new Date(m.timestamp).toDateString();
      const showBadge = msgDate !== lastDate;
      lastDate = msgDate;

      return (
        <div key={m.id}>
          {/* BADGE DE FECHA */}
          {showBadge && (
            <div className="text-center my-3">
              <span className="px-3 py-1 text-xs bg-gray-300 text-gray-800 rounded-full">
                {formatDateBadge(new Date(m.timestamp))}
              </span>
            </div>
          )}

          {/* MENSAJE */}
          <div className={`flex ${m.from_me ? "justify-end" : "justify-start"}`}>
            <div
              className={`${
                m.from_me
                  ? "bg-red-700 text-white"
                  : "bg-gray-200 text-gray-900"
              } px-4 py-2 rounded-2xl max-w-[70%]`}
            >
              {m.body}

              {/* pie de mensaje */}
              <div className="text-[10px] mt-1 text-right opacity-70">
                {formatTime(m.timestamp)}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <section className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white border-b p-4">
        <h2 className="font-semibold">{chatName}</h2>
        {summary && <p className="text-xs text-gray-500">{summary}</p>}
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {renderMessages()}
      </div>

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
