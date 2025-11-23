// app/api/chats/interaction/[interaction_id]/stream/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ interaction_id: string }> }) {
  try {
    const { interaction_id } = await params;

    const cookieStore = await cookies(); // OK
    const token = cookieStore.get("access_token")?.value;

    const backendUrl = `${BACKEND_URL}${API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_STREAM_BY_ID(interaction_id)}`;

    const backendRes = await fetch(backendUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
      }
    });
  } catch (err: any) {
    console.error("Interaction stream error:", err);
    return NextResponse.json({ detail: "stream error", error: err.message }, { status: 500 });
  }
}
