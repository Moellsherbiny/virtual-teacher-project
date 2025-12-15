"use server";

import db from "@/lib/database/prisma";
import { revalidatePath } from "next/cache";
import { quizFormSchema, questionSchema } from "@/lib/schemas";
import { QuestionType } from "@/generated/prisma/enums";
import { z } from "zod";


export async function getQuizAttempts(quizId: string): Promise<{
  attempts?: {
    id: string;
    score: number | null;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];
  error?: string;
}> {
  try {
  

    const attempts = await db.quizAttempt.findMany({
      where: { quizId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { attempts };
  } catch (error) {
    console.error("getQuizAttempts error:", error);
    return { error: "Failed to load quiz attempts" };
  }
}


export async function createQuiz(formData: FormData) {
  // await requireAdmin()

  const title = formData.get("title")?.toString()
  const description = formData.get("description")?.toString()
  const courseId = formData.get("courseId")?.toString()
  const lessonId = formData.get("lessonId")?.toString()

  if (!title) {
    throw new Error("Title is required")
  }

  await db.quiz.create({
    data: {
      title,
      description: description || null,
      courseId: courseId || null,
      lessonId: lessonId || null
    }
  })

  revalidatePath("/dashboard/quizzes")
}

export async function updateQuiz(quizId: string, data: any) {


  await db.quiz.update({ where: { id: quizId }, data });
  revalidatePath(`/dashboard/quizzes/${quizId}`);
}

// export async function deleteQuiz(quizId: string) {

//   await db.quiz.delete({ where: { id: quizId } });
//   revalidatePath("/admin/quizzes");
// }

export async function createQuestion(quizId: string, data: any) {
  // await requireAdmin();

  await db.quizQuestion.create({
    data: { ...data, quizId },
  });

  revalidatePath(`/admin/quizzes/${quizId}/questions`);
}

export async function upsertQuiz(
  data: z.infer<typeof quizFormSchema>,
  quizId?: string
) {
  const parsed = quizFormSchema.safeParse(data);
  if (!parsed.success) return { error: "بيانات غير صالحة" };

  try {
    let quiz;
    if (quizId) {
      quiz = await db.quiz.update({ where: { id: quizId }, data: parsed.data });
    } else {
      quiz = await db.quiz.create({ data: parsed.data });
    }

    revalidatePath(`/dashboard/quizzes`);
    return { success: true, quiz };
  } catch (error) {
    return { error: "حدث خطأ أثناء حفظ الاختبار" };
  }
}

// 2. إضافة أو تعديل سؤال مع إجاباته
export async function upsertQuestion(
  quizId: string,
  data: z.infer<typeof questionSchema>
) {
  const parsed = questionSchema.safeParse(data);
  if (!parsed.success) return { error: "بيانات السؤال غير صالحة" };

  const { id, answers, ...questionData } = parsed.data;

  try {
    // 1️⃣ إنشاء أو تعديل السؤال
    const question = id
      ? await db.quizQuestion.update({
          where: { id },
          data: { ...questionData, quizId },
        })
      : await db.quizQuestion.create({
          data: { ...questionData, quizId },
        });

    // 2️⃣ لو النوع لا يحتاج إجابات → امسحهم
    if (
      questionData.type === QuestionType.COMPLETE ||
      questionData.type === QuestionType.WRITTEN
    ) {
      await db.quizAnswer.deleteMany({
        where: { questionId: question.id },
      });
    }

    // 3️⃣ لو النوع يحتاج إجابات
    if (
      answers?.length &&
      (questionData.type === QuestionType.MULTIPLE_CHOICE ||
        questionData.type === QuestionType.TRUE_FALSE)
    ) {
      // امسح القديم
      await db.quizAnswer.deleteMany({
        where: { questionId: question.id },
      });

      // أضف الجديد
      await db.quizAnswer.createMany({
        data: answers.map((ans) => ({
          text: ans.text,
          isCorrect: ans.isCorrect,
          questionId: question.id,
        })),
      });
    }

    revalidatePath(`/dashboard/quizzes/${quizId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "فشل حفظ السؤال" };
  }
}

// 3. حذف سؤال
export async function deleteQuestion(questionId: string, quizId: string) {
  try {
    await db.quizQuestion.delete({ where: { id: questionId } });
    revalidatePath(`/dashboard/quizzes/${quizId}`);
    return { success: true };
  } catch (error) {
    return { error: "فشل حذف السؤال" };
  }
}

export async function getQuizResults(quizId: string) {
  try {
    const attempts = await db.quizAttempt.findMany({
      where: { quizId },
      include: {
        user: true,
        answers: true,
      },
      orderBy: { score: "desc" },
    });
    return { success: true, data: attempts };
  } catch (error) {
    return { error: "فشل جلب النتائج" };
  }
}

export async function deleteQuiz(quizId: string) {
  try {
    await db.quiz.delete({ where: { id: quizId } });
    revalidatePath("/dashboard/quizzes");
    return { success: true };
  } catch (error) {
    return { error: "لا يمكن حذف الاختبار، قد يكون مرتبطاً بمحاولات طلاب." };
  }
}
