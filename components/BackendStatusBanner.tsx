// components/BackendStatusBanner.tsx
"use client";

import { useChatStore } from "@/app/(dashboard)/gestionar-mensajes/store/chatStore";
import { useEffect, useState } from "react";

export default function BackendStatusBanner() {
  const isOnline = useChatStore((s) => s.isBackendOnline);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      return;
    }

    const t = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(t);
  }, [isOnline]);

  return (
    <div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 
        z-9999 px-5 py-2 rounded-lg shadow-lg text-sm
        flex items-center gap-2 font-medium
        transition-all duration-300
        ${visible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 -translate-y-5 pointer-events-none"
        }
        bg-red-600 text-white
      `}
    >
      ⚠ No podemos conectar con el servidor. Intentando reconectar…
    </div>
  );
}
