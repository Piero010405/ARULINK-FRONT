// app/gestionar-mensajes/page.tsx
"use client";

import { useState, useMemo } from "react";
import ChatsSidebar from "../../../components/components/ChatsSidebar";
import ChatWindow from "../../../components/components/ChatWindow";
import { useAssignedChats } from "./hooks/useAssignedChats";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatStreams } from "./hooks/useChatStreams";
import { useAssignedStream } from "./hooks/useAssignedStream";
import { FloatingNotifications } from "../../../components/components/FloatingNotifications";
import { ChatOverviewItem } from "@/types/chats";

export default function GestionarMensajes() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { assigned } = useAssignedChats();

  const selected: ChatOverviewItem | null = useMemo(
    () => assigned.find((c: ChatOverviewItem) => c.id === selectedChatId) ?? null,
    [assigned, selectedChatId]
  );

  const interactionId = selected?.interaction_id ?? null;

  // Side-effect: carga mensajes en el store
  useChatMessages(interactionId);

  // Streams
  useChatStreams(interactionId);
  useAssignedStream();

  return (
    <div className="h-full w-full">
      <FloatingNotifications />
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        <main className="flex grow bg-gray-100 overflow-hidden">
          <ChatsSidebar
            selected={selectedChatId}
            onSelect={setSelectedChatId}
            search={search}
            setSearch={setSearch}
            assigned={assigned}
          />

          {selected ? (
            <ChatWindow
              chatName={selected.name}
              interactionId={selected.interaction_id}
              chatId={selected.id}
              summary={selected.summary ?? undefined}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Selecciona un chat para comenzar
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
