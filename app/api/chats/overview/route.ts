// app/api/chats/overview/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { ChatsOverviewResponse } from "@/types/chats";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const limit = url.searchParams.get("limit") ?? "20";
    const offset = url.searchParams.get("offset") ?? "0";
    const state = url.searchParams.get("state") ?? "pending";

    const endpoint =
      `${API_BACKEND_ENDPOINTS.CHATS.OVER_VIEW}?limit=${limit}&offset=${offset}&state=${state}`;

    const result = await apiClient<ChatsOverviewResponse>(endpoint, {
      method: "GET",
    });

    if ("backendDown" in result) {
      return NextResponse.json(
        { success: false, backend: "down" },
        { status: 200 }
      );
    }

    return NextResponse.json(result);

  } catch (err) {
    console.error("Error overview:", err);
    return NextResponse.json(
      { success: false, error: "overview error" },
      { status: 200 }
    );
  }
}

