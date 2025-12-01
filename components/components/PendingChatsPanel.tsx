// components/components/PendingChatsPanel.tsx
"use client";

import { ChatOverviewItem } from "@/types/chats";
import { User, ChevronRight, MessageSquare } from "lucide-react";
import { useAssignChat } from "@/app/gestionar-mensajes/hooks/useAssignChat";

interface Props {
  pending: ChatOverviewItem[];
}

export function PendingChatsPanel({ pending }: Props) {
  const { assign } = useAssignChat();

  if (!pending || pending.length === 0) {
    return (
      <div className="text-gray-500 italic text-sm">
        No hay chats pendientes.
      </div>
    );
  }

  return (
    <div className="h-[400px] overflow-y-auto pr-2 flex flex-col gap-4">

      {pending.map((chat) => {
        const summary = chat.summary ?? "Sin resumen disponible";

        return (
          <div
            key={chat.interaction_id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-all border p-4 cursor-default group relative"
          >
            {/* HEADER */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={26} className="text-gray-600" />
              </div>

              <div className="flex flex-col">
                <p className="font-semibold">{chat.name}</p>
                <p className="text-xs text-gray-500">{chat.interaction_id}</p>
              </div>

              {/* Badge mensajes */}
              {chat.unread_count > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {chat.unread_count}
                </span>
              )}
            </div>

            {/* SUMMARY (SIEMPRE visible en dashboard, no solo hover) */}
            <div className="mt-4 bg-gray-50 p-3 rounded-lg border text-sm text-gray-700">
              <p className="font-bold mb-1">Resumen:</p>

              {summary.split(". ").map((line, i) => (
                <p key={i}>• {line.trim()}</p>
              ))}
            </div>

            {/* BOTÓN */}
            <button
              onClick={() =>
                chat.interaction_id && assign(chat.interaction_id, chat)
              }
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              Asignar <ChevronRight size={18} />
            </button>
          </div>
        );
      })}

    </div>
  );
}
