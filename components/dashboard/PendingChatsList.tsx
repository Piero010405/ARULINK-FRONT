"use client";

import PendingChatCard from "./PendingChatCard";
import { ChatOverviewItem } from "@/types/chats";

export default function PendingChatsList({
  pending,
}: {
  pending: ChatOverviewItem[];
}) {
  if (!pending.length)
    return <p className="text-gray-500 text-sm italic">No hay pendientes.</p>;

  return (
    <div className="flex flex-col gap-4">
      {pending.map((chat) => (
        <PendingChatCard key={chat.interaction_id} chat={chat} />
      ))}
    </div>
  );
}
