// src/lib/utils/sseClient.ts
"use client";

import { useChatStore } from "@/app/gestionar-mensajes/store/chatStore";

type SSEOptions = {
  onMessage: (ev: MessageEvent) => void;
  onError?: (ev: Event, attempt: number) => void;
  onOpen?: () => void;
  withCredentials?: boolean;
  maxRetries?: number;        // default: Infinity
  baseDelayMs?: number;       // ms base para backoff
  maxDelayMs?: number;        // ms tope backoff
};

/**
 * SSE resiliente con backoff, heartbeats y señalización de backendOnline.
 */
export function createSSE(url: string, options: SSEOptions): () => void {
  const {
    onMessage,
    onError,
    onOpen,
    withCredentials = false,
    maxRetries = Infinity,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
  } = options;

  const { setBackendOnline } = useChatStore.getState();

  let es: EventSource | null = null;
  let closed = false;
  let attempt = 0;

  function connect() {
    if (closed) return;

    es = new EventSource(url, { withCredentials });

    es.onopen = () => {
      attempt = 0;
      setBackendOnline(true);
      onOpen?.();
    };

    es.onmessage = (ev) => {
      // Ignorar heartbeats enviados como ':ping' o data="ping"
      if (!ev.data || ev.data === "ping" || ev.data === ":ping") return;
      onMessage(ev);
    };

    es.onerror = (ev) => {
      // Backend/SSE cayó → marcar offline
      setBackendOnline(false);

      es?.close();

      if (closed) return;

      attempt += 1;

      onError?.(ev, attempt);

      if (attempt > maxRetries) {
        console.warn(`SSE(${url}) agotó reintentos.`);
        return;
      }

      const delay = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
      console.warn(`SSE(${url}) reconectando en ${delay} ms…`);

      setTimeout(connect, delay);
    };
  }

  connect();

  return () => {
    closed = true;
    setBackendOnline(false);
    es?.close();
  };
}
