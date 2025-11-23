// app/api/chats/interaction/[interaction_id]/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";

export async function GET(req: Request, { params }: { params: Promise<{ interaction_id: string }> }) {
  try {
    const { interaction_id } = await params;
    if (!interaction_id)
      return NextResponse.json({ detail: "Missing interaction_id" }, { status: 400 });

    const data = await apiClient(
      API_BACKEND_ENDPOINTS.CHATS.GET_INTERACTION_BY_ID(interaction_id),
      { method: "GET" }
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("interaction error", err);
    return NextResponse.json({ detail: "Error interno", error: err.message }, { status: 500 });
  }
}

