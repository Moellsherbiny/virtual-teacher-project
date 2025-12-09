import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database/prisma";
import { auth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    courseId: string;
    moduleId: string;
  }>;
}

/* --------------------------- Helpers --------------------------- */

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const forbidden = () =>
  NextResponse.json({ error: "Forbidden" }, { status: 403 });

const badRequest = (msg: string) =>
  NextResponse.json({ error: msg }, { status: 400 });

/* ----------------------------- GET ----------------------------- */
/* Get all lessons inside a module */

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorized();

    const { moduleId } = await params;

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lessons", details: error },
      { status: 500 }
    );
  }
}

/* ----------------------------- POST ---------------------------- */
/* Create a lesson inside a module */

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorized();
    if (session.user.role === "STUDENT") return forbidden();

    const { moduleId } = await params;
    const { title, content, videoUrl, fileUrl, order, type } =
      await req.json();

    if (!title || !moduleId)
      return badRequest("Missing required fields");

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content: content || null,
        videoUrl: videoUrl || null,
        fileUrl: fileUrl || null,
        order: Number(order) || 0,
        type: type || "VIDEO",
        moduleId,
      },
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create lesson", details: error },
      { status: 500 }
    );
  }
}

/* ------------------------------ PUT ---------------------------- */
/* Update a lesson */

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorized();
    if (session.user.role === "STUDENT") return forbidden();

    const { moduleId } = await params;
    const { lessonId, title, content, videoUrl, fileUrl, order, type } =
      await req.json();

    if (!lessonId) return badRequest("lessonId is required");

    const exists = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!exists)
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: title ?? exists.title,
        content: content ?? exists.content,
        videoUrl: videoUrl ?? exists.videoUrl,
        fileUrl: fileUrl ?? exists.fileUrl,
        order: order ?? exists.order,
        type: type ?? exists.type,
        moduleId: moduleId, // prevent detach
      },
    });

    return NextResponse.json(
      { updated, message: "Lesson updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update lesson", details: error },
      { status: 500 }
    );
  }
}

/* ----------------------------- DELETE -------------------------- */
/* Delete a lesson */

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return unauthorized();
    if (session.user.role === "STUDENT") return forbidden();

    const { lessonId } = await req.json();
    if (!lessonId) return badRequest("lessonId is required");

    const exists = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!exists)
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json(
      { message: "Lesson deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete lesson", details: error },
      { status: 500 }
    );
  }
}
