// app/api/chats/interaction/[interaction_id]/state/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { NextRequest } from "next/server";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ interaction_id: string }> }
) {
  const { interaction_id } = await context.params;
  const body = await request.json();

  const response = await apiClient(
    API_BACKEND_ENDPOINTS.CHATS.UPDATE_INTERACTION_STATE_BY_ID(interaction_id),
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );

  return Response.json(response);
}