// app/gestionar-mensajes/components/PendingChatsPanel.tsx
"use client";
import { useAssignChat } from "../hooks/useAssignChat";
import { ChatOverviewItem } from "@/types/chats";

export function PendingChatsPanel({ pending }: { pending: ChatOverviewItem[] }) {
  const { assign } = useAssignChat();

  if (!pending || pending.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
      {pending.map((item) => {
        const key = item.interaction_id ?? item.id ?? item.name;

        // FIX: last_message puede ser string o un objeto del backend
        const lastMessageText =
          typeof item.last_message === "string"
            ? item.last_message
            : item.last_message?.body ?? "—";

        return (
          <div
            key={key}
            className="min-w-[260px] bg-white border rounded-lg shadow-sm p-3 flex flex-col"
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-gray-500">ID: {item.interaction_id}</div>

            <div className="text-sm text-gray-500">
              Último: {lastMessageText}
            </div>

            <div className="mt-2 flex gap-2">
              <button
                className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-700 transition ease-in"
                onClick={() =>
                  item.interaction_id && assign(item.interaction_id, item)
                }
              >
                Asignar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
