import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database/prisma";
import { auth } from "@/lib/auth";

// GET: Fetch all conversations for the Sidebar
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversations = await prisma.chatConversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      // Fetch the first message to use as a title/preview
      messages: {
        take: 1,
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  return NextResponse.json(conversations);
}

// POST: Create a new conversation
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId, lessonId } = await req.json();

  const conversation = await prisma.chatConversation.create({
    data: {
      userId: session.user.id,
      courseId: courseId || null,
      lessonId: lessonId || null,
    },
  });

  return NextResponse.json(conversation);
}