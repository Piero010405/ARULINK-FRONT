// app/api/chats/overview/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { ChatsOverviewResponse } from "@/types/chats";

export async function GET() {
  try {
    const response = await apiClient<ChatsOverviewResponse>(
      API_BACKEND_ENDPOINTS.CHATS.OVER_VIEW,
      { method: "GET" }
    );

    return NextResponse.json(response, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: "Unable to fetch overview" },
      { status: 500 }
    );
  }
}
