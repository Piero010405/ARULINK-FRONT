// context/AuthProvider.tsx
"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthContext, User } from "./AuthContext";
import { clearAccessToken } from "@/lib/utils/token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ============================================
  // MANEJO EXPLÍCITO DE TOKEN EXPIRADO / 401
  // ============================================
  const handleExpiredSession = () => {
    clearAccessToken();
    setUser(null);
    router.push("/login");
  };

  // ============================================
  // LOAD SESSION INICIAL
  // ============================================
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });

        if (res.status === 401) {
          handleExpiredSession();
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("No se pudo cargar sesión:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUser(data.user);

      router.push("/menu-principal");
      return true;
    } catch {
      return false;
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAccessToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
