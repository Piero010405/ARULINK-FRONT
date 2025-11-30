// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { TokenResponse } from "@/types/auth";

export async function POST() {
  try {
    const result = await apiClient<TokenResponse>(
      API_BACKEND_ENDPOINTS.AUTH.REFRESH,
      { method: "POST" }
    );

    if ("backendDown" in result) {
      return NextResponse.json(
        { success: false, backend: "down" },
        { status: 200 }
      );
    }

    const res = NextResponse.json(result, { status: 200 });

    res.cookies.set("access_token", result.access_token, {
      httpOnly: true,
      path: "/",
    });

    return res;

  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Unable to refresh token" },
      { status: 401 }
    );
  }
}
