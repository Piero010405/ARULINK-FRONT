"use client";

import AssignedChatCard from "./AssignedChatCard";
import { ChatOverviewItem } from "@/types/chats";

export default function AssignedChatsList({
  assigned,
}: {
  assigned: ChatOverviewItem[];
}) {
  if (!assigned.length)
    return <p className="text-gray-500 text-sm italic">No hay chats asignados.</p>;

  return (
    <div className="flex flex-col gap-4">
      {assigned.map((chat) => (
        <AssignedChatCard key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
