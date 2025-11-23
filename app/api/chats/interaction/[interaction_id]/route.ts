// app/api/chats/interaction/[interaction_id]/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { MessagesListResponse } from "@/types/chats";

export async function GET(_req: Request, { params }: { params: { interaction_id: string } }) {
  try {
    const interaction_id = params.interaction_id;
    if (!interaction_id) return NextResponse.json({ detail: "Missing interaction id" }, { status: 400 });

    const data = await apiClient<MessagesListResponse>(API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_BY_ID(interaction_id), { method: "GET" });
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error("GET interaction proxy error:", err);
    return NextResponse.json({ detail: "Error fetching interaction" }, { status: 500 });
  }
}
