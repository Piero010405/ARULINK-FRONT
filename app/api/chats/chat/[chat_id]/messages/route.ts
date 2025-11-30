// app/api/chats/chat/[chat_id]/messages/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { SendMessageResponse } from "@/types/chats";

export async function POST(req: Request, { params }: { params: { chat_id: string } }) {
  try {
    const { chat_id } = params;
    const body = await req.json();

    const result = await apiClient<SendMessageResponse>(
      API_BACKEND_ENDPOINTS.CHATS.POST_CHAT_BY_ID(chat_id),
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }
    );

    // Si backend está caído
    if ("backendDown" in result) {
      return NextResponse.json(
        { success: false, backend: "down" },
        { status: 200 }
      );
    }

    return NextResponse.json(result);

  } catch (err: any) {
    console.error("send msg error", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 200 }
    );
  }
}

