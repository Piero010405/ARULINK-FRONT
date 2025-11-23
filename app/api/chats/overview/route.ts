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
    // 👈 por defecto pending, como el backend

    const endpoint =
      `${API_BACKEND_ENDPOINTS.CHATS.OVER_VIEW}` +
      `?limit=${limit}&offset=${offset}&state=${state}`;

    const response = await apiClient<ChatsOverviewResponse>(endpoint, {
      method: "GET",
    });

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("Error overview:", err);

    return NextResponse.json(
      { message: "Unable to fetch overview" },
      { status: 500 }
    );
  }
}

