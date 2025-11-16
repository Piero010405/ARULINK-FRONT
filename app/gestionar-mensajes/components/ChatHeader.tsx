"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatHeader() {
  const router = useRouter();
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setDateTime(formatted.replace(",", " -"));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-red-800 text-white flex items-center justify-between px-6 py-3 shadow-md">
      <img src="/logo_blanco.png" alt="Gobierno del Perú" className="h-10" />
      <div className="text-lg font-bold">{dateTime}</div>

      <button
        onClick={() => router.push("/menu-principal")}
        className="bg-white text-red-800 px-4 py-1 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
      >
        Volver
      </button>
    </header>
  );
}
