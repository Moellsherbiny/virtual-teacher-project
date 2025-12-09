import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (session) {
    return NextResponse.json({ authenticated: true, user: session.user});
  } else {
    return NextResponse.json({ authenticated: false, user: null});
  }
}