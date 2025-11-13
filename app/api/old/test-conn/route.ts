import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function GET() {
  await connectDB();
  const count = await User.countDocuments();
  return NextResponse.json({ ok: true, users: count });
}
