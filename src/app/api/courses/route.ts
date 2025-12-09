import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/database/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: { instructor: { select: { id: true, name: true } } },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // if (session.user.role === "STUDENT")
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });


    const body = await req.json();
    const { title, description, imageUrl } = body;

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        imageUrl,
        instructorId: session.user.id,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
