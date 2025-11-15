// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { apiClient } from "@/lib/backend/apiClient";
import { API_BACKEND_ENDPOINTS } from "@/lib/backend/endpoints";
import { RegisterAsesorRequest, RegisterAsesorResponse } from "@/types/auth";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterAsesorRequest;

    const response = await apiClient<RegisterAsesorResponse>(
      API_BACKEND_ENDPOINTS.AUTH.REGISTER,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return NextResponse.json(response, { status: 200 });

  } catch (err) {
    return NextResponse.json(
      { message: "Error registering asesor" },
      { status: 400 }
    );
  }
}
