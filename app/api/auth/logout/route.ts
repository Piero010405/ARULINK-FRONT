// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";

export async function POST() {
  try {
    // Llamamos al backend
    const response = await apiClient<{ message: string }>(
      API_BACKEND_ENDPOINTS.AUTH.LOGOUT,
      { method: "POST" }
    );

    // Respuesta para cliente
    const res = NextResponse.json(response, { status: 200 });

    // Eliminamos cookie
    res.cookies.set("access_token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return res;

  } catch (err) {
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}
