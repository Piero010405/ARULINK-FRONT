// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";

export async function POST() {
  try {
    const result = await apiClient<{ message: string }>(
      API_BACKEND_ENDPOINTS.AUTH.LOGOUT,
      { method: "POST" }
    );

    if ("backendDown" in result) {
      return NextResponse.json(
        { success: false, backend: "down" },
        { status: 200 }
      );
    }

    const res = NextResponse.json(result, { status: 200 });

    res.cookies.set("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return res;

  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 200 }
    );
  }
}
