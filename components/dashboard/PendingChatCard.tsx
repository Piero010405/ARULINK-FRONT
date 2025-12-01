"use client";

import { ChatOverviewItem } from "@/types/chats";
import { User, ChevronRight } from "lucide-react";
import { useAssignChat } from "@/app/gestionar-mensajes/hooks/useAssignChat";

export default function PendingChatCard({ chat }: { chat: ChatOverviewItem }) {
  const { assign } = useAssignChat();

  const summary = chat.summary?.split(". ").map((s) => s.trim()) ?? [];

  return (
    <div className="rounded-xl border bg-gray-50 hover:bg-gray-100 transition shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center">
          <User size={24} className="text-gray-700" />
        </div>

        <div className="flex flex-col">
          <p className="font-semibold">{chat.name}</p>
          <p className="text-xs text-gray-500">{chat.interaction_id}</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3 mt-4 text-sm">
        <p className="font-bold mb-1">Resumen:</p>

        {summary.map((line, i) => (
          <p key={i}>• {line}</p>
        ))}
      </div>

      <button
        onClick={() => chat.interaction_id && assign(chat.interaction_id, chat)}
        className="mt-4 bg-red-600 hover:bg-red-700 transition text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        Asignar <ChevronRight size={18} />
      </button>
    </div>
  );
}
