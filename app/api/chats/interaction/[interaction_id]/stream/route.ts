// app/api/chats/interaction/[interaction_id]/stream/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  { params }: { params: { interaction_id: string } }
) {
  try {
    const interaction_id = params.interaction_id;

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const backendUrl = `${BACKEND_URL}${API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_STREAM_BY_ID(interaction_id)}`;

    // ❗ OBLIGATORIO: no permitir que NextJS timeoutee antes del backend
    const backendRes = await fetch(backendUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch((err) => {
      console.error("SSE backend fetch error:", err);

      // SSE fallback: enviar un stream vacío
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

    // Si el backend devolvió HTML (Cloudflare)
    const contentType = backendRes.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      console.error("SSE backend respondió HTML (Cloudflare timeout)");

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
    console.error("Interaction stream fatal error:", err);

    // Fallback SSE minimal
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(": stream-error\n\n"));
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
}
