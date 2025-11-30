// lib/utils/safeFrontendFetch.ts
"use client";

import { clearAccessToken } from "./token";

function isHtml(text: string): boolean {
  return text.trim().startsWith("<") || text.includes("<html");
}

export type SafeFrontendResult = {
  ok: boolean;
  status: number;
  data: any;
};

export async function safeFrontendFetch(
  url: string,
  options: RequestInit = {},
  retries: number = 2
): Promise<SafeFrontendResult> {
  let attempt = 0;

  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeout);

      const status = res.status;
      let text = "";

      try {
        text = await res.text();
      } catch {
        // Protección si la response no tiene body
        return { ok: false, status, data: null };
      }

      // Si recibe HTML → error controlado (Cloudflare)
      if (isHtml(text)) {
        console.warn("⚠ safeFrontendFetch: HTML detectado (Cloudflare/504):", text);
        if (attempt === retries)
          return { ok: false, status, data: null };
        attempt++;
        continue;
      }

      // Intentar parsear JSON
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        console.warn("⚠ safeFrontendFetch: JSON inválido:", text);
        if (attempt === retries)
          return { ok: false, status, data: null };
        attempt++;
        continue;
      }

      // Sesión expirada
      if (status === 401 && text.includes("SESSION_EXPIRED")) {
        clearAccessToken();
        return { ok: false, status, data: { sessionExpired: true } };
      }

      if (!res.ok) {
        return { ok: false, status, data: json };
      }

      return { ok: true, status, data: json };

    } catch (err) {
      console.warn("⚠ safeFrontendFetch error:", err);
      if (attempt === retries)
        return { ok: false, status: 0, data: null };
    }

    attempt++;
    await new Promise(res => setTimeout(res, 300 * attempt));
  }

  return { ok: false, status: 0, data: null };
}
