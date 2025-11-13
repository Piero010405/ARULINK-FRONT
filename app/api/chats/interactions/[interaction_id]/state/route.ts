// src/api/chats/interactions/[interaction_id]/state/route.ts
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import {
  UpdateInteractionStateRequest,
  UpdateInteractionStateResponse,
} from "@/types/chats";

export async function updateInteractionState(
  interaction_id: string,
  data: UpdateInteractionStateRequest
): Promise<UpdateInteractionStateResponse> {
  return apiClient<UpdateInteractionStateResponse>(
    API_BACKEND_ENDPOINTS.CHATS.UPDATE_INTERACTION_STATE_BY_ID(interaction_id),
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}
