// app/api/chats/overview/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { ChatsOverviewResponse } from "@/types/chats";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Leer query params del usuario (si no los pasa, usar valores por defecto)
    const limit = url.searchParams.get("limit") ?? "20";
    const offset = url.searchParams.get("offset") ?? "0";

    // Construir la URL final para el backend
    const endpoint = `${API_BACKEND_ENDPOINTS.CHATS.OVER_VIEW}?limit=${limit}&offset=${offset}`;

    const response = await apiClient<ChatsOverviewResponse>(
      endpoint,
      { method: "GET" }
    );

    return NextResponse.json(response, { status: 200 });

  } catch (err) {
    console.error("Error overview:", err);

    return NextResponse.json(
      { message: "Unable to fetch overview" },
      { status: 500 }
    );
  }
}
