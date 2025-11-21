import { NextRequest } from "next/server";
// app/api/chats/stream/assigned/route.ts

import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";

export async function GET(request: NextRequest) {
  try {
    const data = await apiClient(
      API_BACKEND_ENDPOINTS.CHATS.CHATS_STREAM_ASSIGNED,
      { method: "GET" }
    );
    return Response.json(data);
  } catch (error: any) {
    console.error("Error /api/chats/stream/assigned:", error);
    return new Response("Error loading assigned chats", { status: 500 });
  }
}
