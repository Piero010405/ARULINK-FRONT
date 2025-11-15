// app/api/auth/changePassword/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { ChangePasswordRequest } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChangePasswordRequest;

    const response = await apiClient<{ message: string }>(
      API_BACKEND_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return NextResponse.json(response, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: "Error changing password" },
      { status: 400 }
    );
  }
}
