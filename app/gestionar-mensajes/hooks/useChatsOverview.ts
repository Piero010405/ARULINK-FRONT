"use client";
import { useEffect, useState } from "react";
import { ChatOverviewItem, ChatsOverviewResponse } from "@/types/chats";

export function useChatsOverview(pollingMs: number = 20000) {
  const [chats, setChats] = useState<ChatOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      const res = await fetch("/api/chats/overview");
      const data: ChatsOverviewResponse = await res.json();
      if (data.success) {
        setChats(data.data.chats);
      }
    } catch (err) {
      console.error("Error overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, pollingMs);
    return () => clearInterval(interval);
  }, []);

  return { chats, loading, refresh: fetchOverview };
}
