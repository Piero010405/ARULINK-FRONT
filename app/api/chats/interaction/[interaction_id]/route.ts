// app/api/chats/interaction/[interaction_id]/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { MessagesListResponse } from "@/types/chats";

export async function GET(req: Request, { params }: { params: { interaction_id: string } }) {
  try {
    const { interaction_id } = params;

    const result = await apiClient<MessagesListResponse>(
      API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_BY_ID(interaction_id),
      { method: "GET" }
    );

    if ("backendDown" in result) {
      return NextResponse.json(
        { success: false, backend: "down" },
        { status: 200 }
      );
    }

    return NextResponse.json(result);

  } catch (err: any) {
    console.error("interaction error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 200 }
    );
  }
}

