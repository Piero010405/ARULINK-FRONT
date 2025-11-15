// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { LoginRequest, TokenResponse } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginRequest;

    // Llamamos a FastAPI usando tu apiClient
    const backendResponse = await apiClient<TokenResponse>(
      API_BACKEND_ENDPOINTS.AUTH.LOGIN,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      false
    );

    // Guardar token como cookie HTTPOnly
    const res = NextResponse.json(
      { access_token: backendResponse.access_token },
      { status: 200 }
    );

    res.cookies.set("access_token", backendResponse.access_token, {
      httpOnly: true,
      path: "/",
    });

    return res;
  
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
