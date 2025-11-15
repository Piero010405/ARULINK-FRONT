// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { TokenResponse } from "@/types/auth";

export async function POST() {
  try {
    const response = await apiClient<TokenResponse>(
      API_BACKEND_ENDPOINTS.AUTH.REFRESH,
      { method: "POST" }
    );

    const res = NextResponse.json(response, { status: 200 });

    // Actualizamos cookie del token
    res.cookies.set("access_token", response.access_token, {
      httpOnly: true,
      path: "/",
    });

    return res;

  } catch (err) {
    return NextResponse.json(
      { message: "Unable to refresh token" },
      { status: 401 }
    );
  }
}
