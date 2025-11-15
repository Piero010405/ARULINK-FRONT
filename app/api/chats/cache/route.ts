// app/api/chats/cache/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { DeleteCacheResponse } from "@/types/chats";

export async function DELETE() {
  try {
    const response = await apiClient<DeleteCacheResponse>(
      API_BACKEND_ENDPOINTS.CHATS.DELETE_CACHE,
      { method: "DELETE" }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Unable to delete chat cache" },
      { status: 500 }
    );
  }
}
