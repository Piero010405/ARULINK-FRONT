// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { AsesorInfo } from "@/types/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  try {
    const result = await apiClient<AsesorInfo>(
      API_BACKEND_ENDPOINTS.AUTH.ME,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if ("backendDown" in result) {
      return NextResponse.json({ backend: "down" }, { status: 503 });
    }

    return NextResponse.json({ success: true, user: result });

  } catch (err: any) {

    // 🔥🔥🔥 AQUI ESTA LO IMPORTANTE
    if (err.message === "SESSION_EXPIRED") {
      return NextResponse.json({ detail: "session expired" }, { status: 401 });
    }

    return NextResponse.json({ detail: "internal", error: err.message }, { status: 500 });
  }
}

