// app/gestionar-mensajes/components/ChatWindow.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChatStore } from "../store/chatStore";
import { useSendMessage } from "../hooks/useSendMessage";
import type { Message } from "@/types/chats";

// lista vacía estable
const EMPTY: Message[] = [];

// =========================
//   FORMATOS DE FECHA
// =========================
function formatDateSeparator(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const d = new Date(date);

  if (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  ) {
    return "Hoy";
  }

  if (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  ) {
    return "Ayer";
  }

  return d.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// =========================
//    TICKS WHATSAPP
// =========================
function AckIcon({ ack }: { ack?: any }) {
  const value = typeof ack === "string" ? ack : ack ?? 0;

  if (value === 0 || value === "PENDING") {
    return <span className="text-[10px] opacity-70">⏳</span>;
  }
  if (value === 1 || value === "SERVER") {
    return <span className="text-[10px] opacity-70">✓</span>;
  }
  if (value === 2 || value === "DEVICE") {
    return <span className="text-[10px] opacity-70">✓✓</span>;
  }
  if (value === 3 || value === "READ") {
    return <span className="text-[10px] text-blue-500">✓✓</span>;
  }
  return null;
}

interface Props {
  chatName: string;
  chatId: string;          // WAHA ID
  interactionId: string;   // Mongo ID
  summary?: string;
}

export default function ChatWindow({ chatName, chatId, interactionId, summary }: Props) {
  const [newMessage, setNewMessage] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { send } = useSendMessage();

  // selector memoizado por interacción
  const selectMessages = useMemo(
    () => (s: any) => s.chats[interactionId] ?? EMPTY,
    [interactionId]
  );

  const messages = useChatStore(selectMessages);

  // ordenar mensajes por timestamp
  const sorted = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [messages]);

  // autoscroll
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [sorted]);

  // autosize del textarea
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  // enviar mensaje
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await send(chatId, interactionId, newMessage.trim());

    setNewMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // enter = enviar
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // =========================
  // AGRUPAR POR FECHAS
  // =========================
  let lastDate = "";

  return (
    <section className="flex-1 flex flex-col bg-gray-50 overflow-hidden">

      {/* HEADER */}
      <div className="bg-white border-b p-4">
        <h2 className="font-semibold">{chatName}</h2>
        {summary && <p className="text-xs text-gray-500">{summary}</p>}
      </div>

      {/* LISTA DE MENSAJES */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {sorted.map((m) => {
          const msgDate = formatDateSeparator(new Date(m.timestamp));

          const showDate = msgDate !== lastDate;
          lastDate = msgDate;

          return (
            <div key={m.id} className="space-y-2">
              {/* SEPARADOR DE FECHA */}
              {showDate && (
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                    {msgDate}
                  </span>
                </div>
              )}

              {/* BURBUJA DE MENSAJE */}
              <div
                className={`flex ${
                  m.from_me ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] shadow-sm
                    ${
                      m.from_me
                        ? "bg-red-700 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                >
                  <p className="whitespace-pre-wrap wrap-break-word">{m.body}</p>

                  <div className="flex items-center gap-1 text-[10px] mt-1 opacity-70 justify-end">
                    {new Date(m.timestamp).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}

                    {m.from_me && <AckIcon ack={m.ack} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="bg-white border-t p-3">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded-2xl border resize-none max-h-40 overflow-y-auto"
            placeholder="Escribe un mensaje..."
            rows={1}
          />

          <button
            onClick={handleSend}
            className="bg-red-700 text-white px-6 py-2 rounded-full font-medium"
          >
            Enviar
          </button>
        </div>
      </div>
    </section>
  );
}
