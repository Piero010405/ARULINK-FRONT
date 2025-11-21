// app/gestionar-mensajes/components/ChatsSidebar.tsx
"use client";
import { useChatsOverview } from "../hooks/useChatsOverview";

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
  search: string;
  setSearch: (v: string) => void;
}

export default function ChatsSidebar({ selected, onSelect, search, setSearch }: Props) {
  const { overview } = useChatsOverview();
  // use state from store if needed
  const items = overview; // overview from hook populates store

  const filtered = items.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  return (
    <aside className="w-1/3 bg-white border-r border-gray-200 flex flex-col pr-4">
      <div className="p-3">
        <input value={search} onChange={(e)=> setSearch(e.target.value)} placeholder="Buscar chat..." className="w-full px-4 py-2 rounded-full border"/>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat) => (
          <div key={chat.id} onClick={() => onSelect(chat.id)} className={`p-4 cursor-pointer border-b ${selected === chat.id ? "bg-gray-100": ""}`}>
            <p className="font-semibold">{chat.name}</p>
            <p className="text-sm text-gray-500">{chat.unread_count>0 ? `${chat.unread_count} mensajes` : "Sin nuevos"}</p>
            <span className="text-xs text-gray-400">{formatTime(chat.last_message_time)}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
