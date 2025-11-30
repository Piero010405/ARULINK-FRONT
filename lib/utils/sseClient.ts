// src/lib/utils/sseClient.ts

type SSEOptions = {
  onMessage: (ev: MessageEvent) => void;
  onError?: (ev: Event, attempt: number) => void;
  onOpen?: () => void;
  withCredentials?: boolean;
  maxRetries?: number;          // por defecto infinito
  baseDelayMs?: number;         // inicio del backoff
  maxDelayMs?: number;          // tope máximo de backoff
};

/**
 * Crea una conexión SSE resiliente con reconexión exponencial.
 * Devuelve una función de "stop" para cerrar la conexión desde React useEffect.
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

  let es: EventSource | null = null;
  let closed = false;
  let attempt = 0;

  const connect = () => {
    if (closed) return;

    es = new EventSource(url, { withCredentials });

    es.onopen = () => {
      attempt = 0; // reset al conectarse bien
      onOpen?.();
    };

    es.onmessage = (ev) => {
      // Algunos backends envían heartbeats tipo ":ping"
      if (!ev.data || ev.data === "ping") return;

      onMessage(ev);
    };

    es.onerror = (ev) => {
      es?.close();

      if (closed) return;

      attempt += 1;
      onError?.(ev, attempt);

      if (attempt > maxRetries) {
        console.warn(`SSE(${url}) agotó reintentos.`);
        return;
      }

      const delay = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));

      setTimeout(() => {
        connect();
      }, delay);
    };
  };

  connect();

  // cleanup
  return () => {
    closed = true;
    es?.close();
  };
}
