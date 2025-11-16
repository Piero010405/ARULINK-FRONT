"use client";

import { Message } from "@/types/chats";
import { useState } from "react";

interface Props {
  chatName: string;
  messages: Message[];
  summary: string;
}

export default function ChatWindow({ chatName, messages, summary }: Props) {
  const [newMessage, setNewMessage] = useState("");

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <section className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div className="bg-white border-b border-gray-200 p-4 flex items-left justify-between flex-col gap-y-2">
        <h2 className="font-semibold text-gray-800">{chatName}</h2>
        <p className="text-xs">{summary}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from_me ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                msg.from_me
                  ? "bg-red-700 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.body}
              <div
                className={`text-[10px] mt-1 text-right ${
                  msg.from_me ? "text-red-200" : "text-gray-400"
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campo enviar */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-700 outline-none"
        />
        <button className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-full font-medium transition">
          Enviar
        </button>
      </div>
    </section>
  );
}
