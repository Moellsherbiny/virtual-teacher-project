"use server";

import db from "@/lib/database/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { LessonSchema } from "@/lib/schemas";
import * as z from "zod";
/* ---------------------------------
   Create Lesson
---------------------------------- */
export async function createLesson(
  moduleId: string,
  values: z.infer<typeof LessonSchema>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const lastLesson = await db.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastLesson ? lastLesson.order + 1 : 1;

    const lesson = await db.lesson.create({
      data: {
        title: values.title,
        type: values.type,
        content: values.content,
        videoUrl: values.videoUrl,
        fileUrl: values.fileUrl,
        moduleId,
        order: newOrder,
      },
    });

    revalidatePath(`/dashboard/modules/${moduleId}`);
    return { success: true, lesson };
  } catch {
    return { error: "Failed to create lesson" };
  }
}

/* ---------------------------------
   Update Lesson
---------------------------------- */
export async function updateLesson(
  lessonId: string,
  values: z.infer<typeof LessonSchema>
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: values,
    });

    revalidatePath(`/dashboard/lessons/${lessonId}`);
    return { success: true, lesson };
  } catch {
    return { error: "Failed to update lesson" };
  }
}
