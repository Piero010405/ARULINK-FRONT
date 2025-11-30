// app/api/chats/stream/assigned/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { cookies } from "next/headers";

/**
 * SSE proxy robusto para el stream de assigned.
 * - Nunca devuelve JSON en error (rompería EventSource).
 * - Devuelve SSE fallback en caso de error.
 */
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const backendUrl = `${BACKEND_URL}${API_BACKEND_ENDPOINTS.CHATS.CHATS_STREAM_ASSIGNED}`;

    // Intentar conectar con el backend SSE
    const backendRes = await fetch(backendUrl, {
      headers,
      method: "GET",
    }).catch((err) => {
      console.error("Assigned SSE fetch error:", err);

      // Fallback SSE cuando no se puede conectar
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(": backend-down\n\n"));
          controller.close();
        },
      });

      return new NextResponse(readable, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    });

    // Si backend devolvió HTML (Cloudflare timeout)
    const contentType = backendRes.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      console.error("Assigned SSE backend respondió HTML → Cloudflare");

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(": cloudflare-down\n\n"));
          controller.close();
        },
      });

      return new NextResponse(readable, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Forward real SSE
    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
      },
    });

  } catch (err: any) {
    console.error("Assigned stream fatal:", err);

    const encoder = new TextEncoder();
    const fallback = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(": stream-error\n\n"));
        controller.close();
      },
    });

    return new NextResponse(fallback, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  }
}
