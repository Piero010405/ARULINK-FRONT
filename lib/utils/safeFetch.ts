// src/lib/utils/safeFetch.ts
"use client";

import { clearAccessToken } from "./token";

export type SafeFetchOptions = RequestInit & {
  retries?: number;
  retryDelay?: number;        // ms
  timeoutMs?: number;         // ms
  useAuth?: boolean;
};

/**
 * Detecta si la respuesta es HTML (Cloudflare, Nginx, 502, 504, etc.)
 */
function isHtmlResponse(text: string): boolean {
  return text.trim().startsWith("<") || text.includes("<html");
}

/**
 * Timeout para evitar fetch colgados por 50s+
 */
function fetchWithTimeout(url: string, options: SafeFetchOptions): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
}

/**
 * safeFetch principal: retry, HTML-safe, JSON-safe, detecta expiración
 */
export async function safeFetch(
  url: string,
  options: SafeFetchOptions = {}
): Promise<{ ok: boolean; status: number; data: any; raw: Response | null }> {
  const {
    retries = 2,
    retryDelay = 500,
    timeoutMs = 15000,
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (attempt <= retries) {
    try {
      const res = await fetchWithTimeout(url, { ...fetchOptions, timeoutMs });

      const status = res.status;

      // === Si es 204 No Content
      if (status === 204) {
        return { ok: true, status, data: null, raw: res };
      }

      // === Leemos texto para detectar HTML
      const text = await res.text();

      if (isHtmlResponse(text)) {
        console.warn("⚠ safeFetch: recibimos HTML, no JSON. Probablemente Cloudflare 504.");
        if (attempt === retries) {
          return { ok: false, status, data: null, raw: res };
        }
      }

      // === Intento de parsear JSON
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (err) {
        console.warn("⚠ safeFetch: respuesta no es JSON válido.", text);
        if (attempt === retries) {
          return { ok: false, status, data: null, raw: res };
        }
      }

      // === Manejo de token expirado
      if (status === 401 && text.includes("Token expirado")) {
        clearAccessToken();
        console.warn("⚠ safeFetch: sesión expirada detectada.");
        throw new Error("SESSION_EXPIRED");
      }

      // === No OK → error controlado
      if (!res.ok) {
        if (attempt === retries) {
          return { ok: false, status, data: json, raw: res };
        }
      }

      // === Respuesta exitosa
      return { ok: true, status, data: json, raw: res };

    } catch (err: any) {
      // AbortController
      if (err.name === "AbortError") {
        console.warn("⏳ safeFetch timeout alcanzado.");
      }

      // Último intento → devolver error seguro
      if (attempt === retries) {
        return { ok: false, status: 0, data: null, raw: null };
      }
    }

    // Esperar antes del siguiente intento
    await new Promise((res) => setTimeout(res, retryDelay * (attempt + 1)));
    attempt++;
  }

  return { ok: false, status: 0, data: null, raw: null };
}
