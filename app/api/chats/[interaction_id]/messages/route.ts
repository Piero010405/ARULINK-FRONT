// app/api/chats/[interaction_id]/messages/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { SendMessageRequest, SendMessageResponse } from "@/types/chats";

export async function POST(
  req: Request,
  context: { params: { interaction_id: string } }
) {
  try {
    const body = (await req.json()) as SendMessageRequest;

    const response = await apiClient<SendMessageResponse>(
      API_BACKEND_ENDPOINTS.CHATS.POST_CHAT_BY_ID(context.params.interaction_id),
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error sending message" },
      { status: 400 }
    );
  }
}
