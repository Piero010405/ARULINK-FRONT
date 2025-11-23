// app/api/chats/stream/assigned/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // fetch backend SSE endpoint (don't call .json() on response)
    const backendRes = await fetch(`${BACKEND_URL}${API_BACKEND_ENDPOINTS.CHATS.CHATS_STREAM_ASSIGNED}`, {
      headers,
      method: "GET",
    });

    // Proxy status 200/other and stream body
    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type": "text/event-stream",
        // allow CORS if needed for local dev
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err: any) {
    console.error("Assigned stream proxy error:", err);
    return NextResponse.json({ error: "internal_server_error", message: "Error interno del servidor", detail: err?.message }, { status: 500 });
  }
}
