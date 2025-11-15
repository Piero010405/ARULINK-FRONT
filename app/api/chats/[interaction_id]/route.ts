// app/api/chats/[interaction_id]/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { MessagesListResponse } from "@/types/chats";

export async function GET(
  req: Request,
  context: { params: { interaction_id: string } }
) {
  try {
    const response = await apiClient<MessagesListResponse>(
      API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_BY_ID(context.params.interaction_id),
      { method: "GET" }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Unable to fetch chat messages" },
      { status: 500 }
    );
  }
}
