// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { LoginRequest, TokenResponse } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginRequest;

    const result = await apiClient<TokenResponse>(
      API_BACKEND_ENDPOINTS.AUTH.LOGIN,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      false // login NO usa token
    );

    if ("backendDown" in result) {
      return NextResponse.json(
        { success: false, backend: "down" },
        { status: 200 }
      );
    }

    // result ahora SÍ es TokenResponse
    const res = NextResponse.json(
      { success: true, access_token: result.access_token },
      { status: 200 }
    );

    res.cookies.set("access_token", result.access_token, {
      httpOnly: true,
      path: "/",
    });

    return res;

  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }
}

