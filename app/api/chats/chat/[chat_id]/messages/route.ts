// app/api/chats/chat/[chat_id]/messages/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";

export async function POST(req: Request, { params }: { params: Promise<{ chat_id: string }> }) {
  try {
    const { chat_id } = await params;

    const body = await req.json();

    const data = await apiClient(
      API_BACKEND_ENDPOINTS.CHATS.POST_CHAT_BY_ID(chat_id),
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
      }
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("send msg error", err);
    return NextResponse.json({ detail: "msg error", error: err.message }, { status: 500 });
  }
}
