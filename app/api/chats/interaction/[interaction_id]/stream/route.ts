// app/api/chats/interaction/[interaction_id]/stream/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  context: { params: { interaction_id: string } }
) {
  try {
    // ❗ FIX: params is a Promise → await it
    const { interaction_id } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const backendUrl = `${BACKEND_URL}${API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_STREAM_BY_ID(interaction_id)}`;

    const backendRes = await fetch(backendUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).catch((err) => {
      console.error("SSE backend fetch error:", err);

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(": backend-down\n\n"));
          controller.close();
        },
      });

      return new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    });

    // Cloudflare HTML guard
    const contentType = backendRes.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      console.error("Cloudflare/HTML detected in SSE stream");

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(": cloudflare-down\n\n"));
          controller.close();
        },
      });

      return new NextResponse(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Pass-through SSE proxy
    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
      },
    });

  } catch (err: any) {
    console.error("Interaction stream fatal error:", err);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(": stream-error\n\n"));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  }
}
