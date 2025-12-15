"use server";

import * as z from "zod";
import  db  from "@/lib/database/prisma";
import { CourseSchema } from "@/lib/schemas";
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// === CREATE ===
export async function createCourse(values: z.infer<typeof CourseSchema>) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return { error: "Unauthorized" };

    const validatedFields = CourseSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields" };

    const course = await db.course.create({
      data: {
        title: validatedFields.data.title,
        instructorId: userId,
      },
    });

    return { success: "Course created!", id: course.id };
  } catch (error) {
    console.error("COURSE_CREATE_ERROR", error);
    return { error: "Something went wrong" };
  }
}

// === UPDATE ===
export async function updateCourse(
  courseId: string,
  values: z.infer<typeof CourseSchema>
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return { error: "Unauthorized" };

    const course = await db.course.update({
      where: { id: courseId, instructorId: userId },
      data: { ...values },
    });

    revalidatePath(`/teacher/courses/${courseId}`);
    return { success: "Course updated!", course };
  } catch (error) {
    return { error: "Database Error: Failed to update course." };
  }
}

// === DELETE ===
export async function deleteCourse(courseId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return { error: "Unauthorized" };

    // Validating ownership
    const course = await db.course.findUnique({
      where: { id: courseId, instructorId: userId },
    });

    if (!course) return { error: "Not found" };

    await db.course.delete({
      where: { id: courseId },
    });

    revalidatePath(`/teacher/courses`);
    return { success: "Course deleted" };
  } catch (error) {
    return { error: "Failed to delete course" };
  }
}