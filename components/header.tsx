"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BtnLogout from "./btn-logout";
import Link from "next/link";

export default function Header() {
  const [dateTime, setDateTime] = useState("");
  const pathname = usePathname();

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
      }).replace(",", " -");
      setDateTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`text-white/90 hover:text-white transition font-medium text-sm ${
          active ? "underline underline-offset-4" : ""
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-red-800 text-white px-6 py-3 flex items-center justify-between relative shadow-md">

      {/* Logo */}
      <div className="flex items-center gap-x-3">
        <img src="/logo_blanco.png" alt="Gobierno del Perú" className="h-6" />
        <span className="font-bold text-xl pl-4 border-l border-white/40">
          AruLink
        </span>
      </div>

      {/* Fecha y hora */}
      <div className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold tracking-wide">
        {dateTime}
      </div>

      {/* Navegación */}
      <div className="flex items-center gap-6">

        <NavLink href="/menu-principal" label="Dashboard" />
        <NavLink href="/gestionar-mensajes" label="Gestionar mensajes" />

        <BtnLogout />
      </div>
    </header>
  );
}
