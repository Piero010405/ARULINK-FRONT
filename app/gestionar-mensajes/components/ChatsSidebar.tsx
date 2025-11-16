"use client";

import { ChatOverviewItem } from "@/types/chats";

interface Props {
  chats: ChatOverviewItem[];
  selected: string | null;
  onSelect: (chat: ChatOverviewItem) => void;
  search: string;
  setSearch: (v: string) => void;
}

export default function ChatsSidebar({
  chats,
  selected,
  onSelect,
  search,
  setSearch,
}: Props) {
  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <aside className="w-1/3 bg-white border-r border-gray-200 flex flex-col pr-4">
      <div className="p-3">
        <input
          type="text"
          placeholder="Buscar chat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-red-700 outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat)}
            className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition ${
              selected === chat.id ? "bg-gray-100" : ""
            }`}
          >
            <p className="font-semibold text-gray-900">{chat.name}</p>
            <p className="text-sm text-gray-500 truncate">
              {chat.unread_count > 0
                ? `${chat.unread_count} mensajes sin leer`
                : "Sin mensajes nuevos"}
            </p>

            <span className="text-xs text-gray-400">
              {formatTime(chat.last_message_time)}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
