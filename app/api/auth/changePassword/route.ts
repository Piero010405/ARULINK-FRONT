// app/api/auth/changePassword/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { ChangePasswordRequest } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChangePasswordRequest;

    const result = await apiClient<{ message: string }>(
      API_BACKEND_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    if ("backendDown" in result) {
      return NextResponse.json(
        { success: false, backend: "down" },
        { status: 200 }
      );
    }

    return NextResponse.json(result, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Error changing password" },
      { status: 200 }
    );
  }
}

