"use client";

import Link from "next/link";
import { ChatOverviewItem } from "@/types/chats";
import { User, ChevronRight } from "lucide-react";

export default function AssignedChatCard({ chat }: { chat: ChatOverviewItem }) {
  return (
    <Link
      href="/gestionar-mensajes"
      className="rounded-xl bg-gray-50 hover:bg-gray-100 border p-4 flex items-center gap-4 transition"
    >
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
        <User size={26} className="text-gray-600" />
      </div>

      <div className="flex-1">
        <p className="font-semibold">{chat.name}</p>
        <p className="text-sm text-gray-600">
          {typeof chat.last_message === "string"
            ? chat.last_message
            : chat.last_message?.body ?? "Sin mensajes"}
        </p>
      </div>

      <ChevronRight className="text-gray-400" />
    </Link>
  );
}
