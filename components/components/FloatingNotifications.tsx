// app/gestionar-mensajes/components/FloatingNotifications.tsx
"use client";

import { useChatStore } from "../../app/gestionar-mensajes/store/chatStore";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function FloatingNotifications() {
  const notifications = useChatStore((s) => s.notifications);
  const remove = useChatStore((s) => s.removeNotification);

  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => remove(n.id), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, remove]);

  // Fallback: Inicial del usuario/chat
  const getInitial = (title: string) => {
    const clean = title?.trim();
    return clean ? clean[0].toUpperCase() : "?";
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto w-80 bg-white border border-gray-200 shadow-xl rounded-xl p-3 flex gap-3 items-start dark:bg-neutral-900 dark:border-neutral-700"
          >
            {/* Avatar circular */}
            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
              {getInitial(n.title)}
            </div>

            {/* Contenido */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {n.title}
                </p>
                <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-300" />
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                {n.message}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
