// app/gestionar-mensajes/components/PendingChatsPanel.tsx
"use client";
import { usePendingChats } from "../hooks/usePendingChats";
import { useAssignChat } from "../hooks/useAssignChat";

export function PendingChatsPanel() {
  const { pending } = usePendingChats();
  const { assign } = useAssignChat();

  if (!pending || pending.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
      {pending.map((item) => {
        const key = item.interaction_id ?? item.id ?? item.name;
        return (
          <div key={key} className="min-w-[260px] bg-white border rounded-lg shadow-sm p-3 flex flex-col">
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-gray-500">Último: {item.last_message ?? "—"}</div>
            <div className="mt-2 flex gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => item.interaction_id && assign(item.interaction_id, item)}
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
