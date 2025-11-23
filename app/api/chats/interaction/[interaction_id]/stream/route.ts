// app/api/chats/interaction/[interaction_id]/stream/route.ts
import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend/config";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { cookies } from "next/headers";

export async function GET(_req: NextRequest, { params }: { params: { interaction_id: string } }) {
  try {
    const { interaction_id } = params;
    if (!interaction_id) return NextResponse.json({ detail: "Missing interaction id" }, { status: 400 });

    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const backendUrl = `${BACKEND_URL}${API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_STREAM_BY_ID(interaction_id)}`;
    const backendRes = await fetch(backendUrl, { method: "GET", headers });

    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform" },
    });
  } catch (err: any) {
    console.error("Interaction stream proxy error:", err);
    return NextResponse.json({ detail: "Error proxy stream", error: err?.message }, { status: 500 });
  }
}
