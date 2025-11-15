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
      { detail: "Not authenticated" },
      { status: 401 }
    );
  }

  const data = await apiClient<AsesorInfo>(
    API_BACKEND_ENDPOINTS.AUTH.ME,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    }
  );
  
  return NextResponse.json({ user: data });
}
