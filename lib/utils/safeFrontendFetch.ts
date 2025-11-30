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

  // ❗POST no debe reintentarse jamás
  let retryCount =
    options.method?.toUpperCase() === "POST" ? 0 : retries;

  while (attempt <= retryCount) {
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
        return { ok: false, status, data: null };
      }

      if (isHtml(text)) {
        console.warn("⚠ safeFrontendFetch: HTML detectado:", text);
        if (attempt === retryCount)
          return { ok: false, status, data: null };
        attempt++;
        continue;
      }

      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        console.warn("⚠ safeFrontendFetch: JSON inválido:", text);
        if (attempt === retryCount)
          return { ok: false, status, data: null };
        attempt++;
        continue;
      }

      if (status === 401 && text.includes("SESSION_EXPIRED")) {
        clearAccessToken();
        return { ok: false, status, data: { sessionExpired: true } };
      }

      if (!res.ok) {
        return { ok: false, status, data: json };
      }

      return { ok: true, status, data: json };
    } catch (err) {
      if (attempt === retryCount)
        return { ok: false, status: 0, data: null };
    }

    attempt++;
    await new Promise((res) => setTimeout(res, 300 * attempt));
  }

  return { ok: false, status: 0, data: null };
}
