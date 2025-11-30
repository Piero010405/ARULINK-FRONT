// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { RegisterAsesorRequest, RegisterAsesorResponse } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterAsesorRequest;

    const result = await apiClient<RegisterAsesorResponse>(
      API_BACKEND_ENDPOINTS.AUTH.REGISTER,
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

  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error registering asesor" },
      { status: 200 }
    );
  }
}
