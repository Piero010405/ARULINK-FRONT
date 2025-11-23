// app/gestionar-mensajes/components/PendingChatsPanel.tsx
"use client";

import { usePendingChats } from "../hooks/usePendingChats";
import { useAssignChat } from "../hooks/useAssignChat";

export function PendingChatsPanel() {
  const { pending } = usePendingChats();
  const { assign } = useAssignChat();

  if (!pending.length) return null;

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
      {pending.map((item) => (
        <div
          key={item.interaction_id}
          className="min-w-[260px] bg-white border rounded-lg shadow-sm p-3 flex flex-col"
        >
          <div className="font-semibold">{item.name}</div>
          <div className="text-sm text-gray-600">
            Último mensaje: {item.last_message ?? "—"}
          </div>

          <button
            className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
            onClick={() => assign(item.interaction_id, item)}
          >
            Asignar
          </button>
        </div>
      ))}
    </div>
  );
}
