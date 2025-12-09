import { auth } from "@/lib/auth";
import prisma from "@/lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });



    // --- Query users ---
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const total = await prisma.user.count();

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
