"use client";

import { useEffect } from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

export default function Notification({ message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed top-6 right-6 bg-white border-l-4 border-red-700 shadow-lg rounded-lg p-4 w-80 z-50
      animate-slideIn flex items-start gap-3"
    >
      <img src="/Arlink.png" alt="Logo" className="h-8 w-8 rounded-full" />
      <div>
        <p className="text-sm font-semibold text-gray-900 mb-1">Nuevo chat recibido</p>
        <p className="text-xs text-gray-600">{message}</p>
      </div>
    </div>
  );
}
