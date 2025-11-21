// app/api/chats/interaction/[interaction_id]/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { MessagesListResponse } from "@/types/chats";

export async function GET(
  _request: Request,
  context: { params: Promise<{ interaction_id: string }> }
) {
  try {
    const { interaction_id } = await context.params;

    const response = await apiClient<MessagesListResponse>(
      API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_BY_ID(interaction_id),
      { method: "GET" }
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error en GET /api/chats/[interaction_id]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
