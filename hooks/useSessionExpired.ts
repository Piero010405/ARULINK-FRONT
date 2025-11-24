// lib/hooks/useSessionExpired.ts
"use client";

import { useEffect } from "react";

export function useSessionExpiredHandler() {
  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const err = event.reason;

      if (err instanceof Error && err.message === "SESSION_EXPIRED") {
        console.warn("🔴 Sesión expirada → redirigiendo al login...");

        // limpiar tokens locales por si acaso
        localStorage.removeItem("access_token");

        // redirigir a login
        window.location.href = "/login";
      }
    };

    window.addEventListener("unhandledrejection", handler);

    return () => {
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);
}
