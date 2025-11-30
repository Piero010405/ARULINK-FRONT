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
    return NextResponse.json(
      { success: false, detail: "Not authenticated" },
      { status: 401 }
    );
  }

  const result = await apiClient<AsesorInfo>(
    API_BACKEND_ENDPOINTS.AUTH.ME,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if ("backendDown" in result) {
    return NextResponse.json(
      { success: false, backend: "down" },
      { status: 200 }
    );
  }

  return NextResponse.json({ success: true, user: result });
}
