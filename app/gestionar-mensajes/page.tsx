// app/gestionar-mensajes/page.tsx
"use client";

import { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatsSidebar from "./components/ChatsSidebar";
import ChatWindow from "./components/ChatWindow";
import { usePendingChats } from "./hooks/usePendingChats";
import { useAssignedChats } from "./hooks/useAssignedChats";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatStreams } from "./hooks/useChatStreams";
import { PendingChatsPanel } from "./components/PendingChatsPanel";

export default function GestionarMensajes() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // 🔥 Nuevos hooks: eliminas useChatsOverview
  const { pending } = usePendingChats();
  const { assigned } = useAssignedChats();

  // Buscar el seleccionado ENTRE LOS ASIGNADOS
  const selected = assigned.find((c) => c.id === selectedChatId) || null;

  // interaction_id viene solo de assigned
  const interactionId = selected?.interaction_id ?? undefined;

  // obtener mensajes por interaction_id
  const { messages, resp, meta } = useChatMessages(interactionId);

  // suscribir SSE por interaction_id
  useChatStreams(interactionId);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">

      <ChatHeader />

      {/* ANUNCIOS HORIZONTALES DE CHATS PENDIENTES */}
      <div className="bg-white border-b px-4 py-2">
        <PendingChatsPanel />
      </div>

      <main className="flex grow bg-gray-100 overflow-hidden">

        {/* SIDEBAR: usa los assigned */}
        <ChatsSidebar
          selected={selectedChatId}
          onSelect={(chat_id) => setSelectedChatId(chat_id)}
          search={search}
          setSearch={setSearch}
        />


        {selected ? (
          <ChatWindow
            chatName={selected.name}
            messages={messages}
            summary={resp?.summary ?? meta?.summary}
            sendToChatId={selected.id}
            interactionId={interactionId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Selecciona un chat para comenzar
          </div>
        )}
      </main>
    </div>
  );
}
