"use server";
import  db  from "@/lib/database/prisma";
import { auth } from "@/lib/auth";
import { ModuleSchema } from "@/lib/schemas";
import * as z from "zod";
import { revalidatePath } from "next/cache";

export async function createModule(courseId: string, values: z.infer<typeof ModuleSchema>) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return { error: "Unauthorized" };


    // Find last order
    const lastModule = await db.module.findFirst({
      where: { courseId },
      orderBy: { order: "desc" },
    });

    const newOrder = lastModule ? lastModule.order + 1 : 1;

    const module = await db.module.create({
      data: {
        title: values.title,
        courseId,
        order: newOrder,
      },
    });

    revalidatePath(`/dashboard/courses/${courseId}`);
    return { success: "Module created", module };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function reorderModules(
  courseId: string,
  updateData: { id: string; position: number }[]
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) return { error: "Unauthorized" };
     
     // Loop through and update transactionally
     for (const item of updateData) {
       await db.module.update({
         where: { id: item.id },
         data: { order: item.position }
       });
     }
     
     revalidatePath(`/dashboard/courses/${courseId}`);
     return { success: "Reordered" };
  } catch (error) {
     return { error: "Failed to reorder" };
  }
}