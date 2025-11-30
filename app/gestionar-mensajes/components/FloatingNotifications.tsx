// app/gestionar-mensajes/components/FloatingNotifications.tsx
"use client";

import { useChatStore } from "../store/chatStore";
import { useEffect } from "react";

export function FloatingNotifications() {
  const notifications = useChatStore((s) => s.notifications);
  const remove = useChatStore((s) => s.removeNotification);

  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => remove(n.id), 4000)
    );

    return () => timers.forEach(clearTimeout);
  }, [notifications, remove]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-white shadow-lg px-4 py-3 rounded-lg border w-72"
        >
          <div className="font-semibold">{n.title}</div>
          <div className="text-sm text-gray-700">{n.message}</div>
        </div>
      ))}
    </div>
  );
}
