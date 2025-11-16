"use client";

import { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatsSidebar from "./components/ChatsSidebar";
import ChatWindow from "./components/ChatWindow";
import { useChatsOverview } from "./hooks/useChatsOverview";
import { useChatMessages } from "./hooks/useChatMessages";

export default function GestionarMensajes() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { chats } = useChatsOverview();
  const selected = chats.find((c) => c.id === selectedChat);

  const { messages, summary } = useChatMessages(selected?.interaction_id);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <ChatHeader />

      <main className="flex grow bg-gray-100 overflow-hidden">
        <ChatsSidebar
          chats={chats}
          selected={selectedChat}
          onSelect={(c) => setSelectedChat(c.id)}
          search={search}
          setSearch={setSearch}
        />

        {selected ? (
          <ChatWindow chatName={selected.name} messages={messages} summary={summary} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Selecciona un chat para comenzar
          </div>
        )}
      </main>
    </div>
  );
}
