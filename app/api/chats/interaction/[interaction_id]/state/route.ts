// app/api/chats/interaction/[interaction_id]/state/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { NextResponse } from "next/server";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { UpdateInteractionStateResponse } from "@/types/chats";

export async function PATCH(request: Request, { params }: { params: { interaction_id: string } }) {
  const { interaction_id } = params;
  const body = await request.json();

  const result = await apiClient<UpdateInteractionStateResponse>(
    API_BACKEND_ENDPOINTS.CHATS.UPDATE_INTERACTION_STATE_BY_ID(interaction_id),
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );

  if ("backendDown" in result) {
    return NextResponse.json(
      { success: false, backend: "down" },
      { status: 200 }
    );
  }

  return NextResponse.json(result);
}
