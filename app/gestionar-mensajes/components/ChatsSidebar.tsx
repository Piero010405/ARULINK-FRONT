// app/gestionar-mensajes/components/ChatsSidebar.tsx
"use client";

import { ChatOverviewItem } from "@/types/chats";
import { Loader } from "@/components/ui/Loader";

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
  search: string;
  setSearch: (v: string) => void;
  assigned: ChatOverviewItem[];
}

export default function ChatsSidebar({
  selected,
  onSelect,
  search,
  setSearch,
  assigned,
}: Props) {
  if (!assigned) return <Loader />;

  const filtered = assigned.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (iso: string | null | number) => {
    if (!iso) return "";
    return new Date(iso).toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <aside className="w-1/3 bg-white border-r border-gray-200 flex flex-col">

      {/* ---------- HEADER ---------- */}
      <div className="px-4 py-4 border-b bg-white">
        <h2 className="text-xl font-bold">Chats</h2>
      </div>

      {/* ---------- BUSCADOR ---------- */}
      <div className="p-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar chat..."
          className="w-full px-4 py-2 rounded-full bg-gray-100 focus:bg-white border focus:border-gray-300 transition-all outline-none"
        />
      </div>

      {/* ---------- LISTA DE CHATS ---------- */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-4 text-sm">Sin resultados</p>
        )}

        {filtered.map((chat) => {
          const lastMsg =
            typeof chat.last_message === "string"
              ? chat.last_message
              : chat.last_message?.body ?? "";

          const lastTime =
            typeof chat.last_message === "string"
              ? ""
              : formatTime(chat.last_message?.timestamp || chat.timestamp);

          return (
            <div
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`
                flex items-center gap-4 px-4 py-3 cursor-pointer border-b
                transition-all
                ${selected === chat.id ? "bg-gray-100" : "hover:bg-gray-50"}
              `}
            >
              {/* FOTO PERFIL */}
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {chat.picture_url ? (
                  <img
                    src={chat.picture_url}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-700 font-medium text-lg">
                    {chat.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* INFORMACIÓN PRINCIPAL */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{chat.name}</p>

                {/* Último mensaje */}
                <p className="text-sm text-gray-500 truncate">
                  {lastMsg || "—"}
                </p>
              </div>

              {/* DERECHA: HORA + BADGE */}
              <div className="flex flex-col items-end gap-1">
                {/* HORA */}
                <span className="text-xs text-gray-400">{lastTime}</span>

                {/* Badge de no leídos */}
                {chat.unread_count > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {chat.unread_count}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
