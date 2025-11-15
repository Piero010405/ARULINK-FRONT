// app/api/chats/interactions/[interaction_id]/state/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import {
  UpdateInteractionStateRequest,
  UpdateInteractionStateResponse,
} from "@/types/chats";

export async function PATCH(
  req: Request,
  context: { params: { interaction_id: string } }
) {
  try {
    const body = (await req.json()) as UpdateInteractionStateRequest;

    const response = await apiClient<UpdateInteractionStateResponse>(
      API_BACKEND_ENDPOINTS.CHATS.UPDATE_INTERACTION_STATE_BY_ID(context.params.interaction_id),
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );

    return NextResponse.json(response, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: "Unable to update interaction state" },
      { status: 400 }
    );
  }
}
