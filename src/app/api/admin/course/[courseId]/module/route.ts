import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database/prisma";
import { auth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ courseId: string }>;
}

/* --------------------------- Helpers --------------------------- */

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

function badRequest(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

/* ----------------------------- GET ----------------------------- */

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorized();

    const { courseId } = await params;

    const modules = await prisma.module.findMany({
      where: { courseId },
      include: { lessons: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ modules }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch modules", details: error },
      { status: 500 }
    );
  }
}

/* ----------------------------- POST ---------------------------- */

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) return unauthorized();
    if (session.user.role === "STUDENT") return forbidden();

    const { courseId } = await params;
    const { title, order } = await req.json();

    if (!title || order === undefined || !courseId)
      return badRequest("Missing required fields");

    const module = await prisma.module.create({
      data: {
        title,
        order: Number(order) || 0,
        courseId,
      },
    });

    return NextResponse.json({ module }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create module", details: error },
      { status: 500 }
    );
  }
}

/* ------------------------------ PUT ---------------------------- */

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return unauthorized();
    if (session.user.role === "STUDENT") return forbidden();

    const { moduleId, title, order } = await req.json();

    if (!moduleId) return badRequest("moduleId is required");

    const existing = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!existing)
      return NextResponse.json({ error: "Module not found" }, { status: 404 });

    const updated = await prisma.module.update({
      where: { id: moduleId },
      data: {
        title: title ?? existing.title,
        order: order ?? existing.order,
      },
    });

    return NextResponse.json(
      { updated, message: "Module updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update module", details: error },
      { status: 500 }
    );
  }
}

/* ----------------------------- DELETE -------------------------- */

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return unauthorized();
    if (session.user.role === "STUDENT") return forbidden();

    const { moduleId } = await req.json();
    if (!moduleId) return badRequest("moduleId is required");

    const existing = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!existing)
      return NextResponse.json({ error: "Module not found" }, { status: 404 });

    await prisma.module.delete({
      where: { id: moduleId },
    });

    return NextResponse.json(
      { message: "Module deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete module", details: error },
      { status: 500 }
    );
  }
}
