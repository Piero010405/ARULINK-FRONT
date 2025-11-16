"use client";
import { useEffect, useState } from "react";
import { Message, MessagesListResponse } from "@/types/chats";

export function useChatMessages(interactionId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!interactionId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/chats/${interactionId}`);
      const data: MessagesListResponse = await res.json();
      setMessages(data.messages);
      setSummary(data.summary);
    } catch (err) {
      console.error("Error mensajes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [interactionId]);

  return { messages, summary, loading, refresh: fetchMessages };
}
