// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { AsesorInfo } from "@/types/auth";

export async function GET(req: Request) {
  const token = req.headers.get("cookie")?.replace("access_token=", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await apiClient<AsesorInfo>(
    API_BACKEND_ENDPOINTS.AUTH.ME,
    {},
    true // requiere token
  );

  return NextResponse.json(data);
}
