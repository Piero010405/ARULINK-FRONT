// app/gestionar-mensajes/page.tsx
"use client";
import { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatsSidebar from "./components/ChatsSidebar";
import ChatWindow from "./components/ChatWindow";
import { useChatsOverview } from "./hooks/useChatsOverview";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatStreams } from "./hooks/useChatStreams";

export default function GestionarMensajes() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null); // chat_id (519@c.us)
  const [search, setSearch] = useState("");

  const { overview } = useChatsOverview();
  // find selected overview item
  const selected = overview.find((c) => c.id === selectedChatId);

  // use interaction_id to fetch history and fill store
  const interactionId = selected?.interaction_id;
  const { messages, loading, resp, meta } = useChatMessages(interactionId);

  // start streams: pass active interaction id to listen per-chat; assigned stream always open
  useChatStreams(interactionId);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <ChatHeader />
      <main className="flex grow bg-gray-100 overflow-hidden">
        <ChatsSidebar selected={selectedChatId} onSelect={(id)=> setSelectedChatId(id)} search={search} setSearch={setSearch} />
        {selected ? (
          <ChatWindow
            chatName={selected.name}
            messages={messages}
            summary={resp?.summary ?? meta?.summary}
            sendToChatId={selected.id}        // chat_id used to send messages
            interactionId={interactionId}     // used for store key / SSE
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Selecciona un chat para comenzar</div>
        )}
      </main>
    </div>
  );
}
