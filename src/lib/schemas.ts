import * as z from "zod";
import { LessonType, QuestionType } from "@/generated/prisma/enums";

export const LessonTypeEnum = z.enum(["VIDEO", "TEXT", "MATERILAS"]);
export const QuestionTypeEnum = z.enum(["MCQ", "WRITTEN", "TRUE_FALSE"]);

export const CourseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const ModuleSchema = z.object({
  title: z.string().min(1),
});



export const LessonSchema = z.object({
  title: z.string().min(1),
  // Use the local Zod enum instead of Prisma's
  type: z.nativeEnum(LessonType), 
  videoUrl: z.string().optional(),
  fileUrl: z.string().optional(),
  content: z.string().optional(),
});


export interface LessonDTO {
  id: string;
  title: string;
  type: LessonType;
  content: string | null;
  videoUrl: string | null;
  fileUrl: string | null;
  moduleId: string;
}

// schema للإجابات المتاحة (للمدرس)
const answerSchema = z.object({
  id: z.string().optional(), // اختياري في حالة الإنشاء
  text: z.string().min(1, "نص الإجابة مطلوب"),
  isCorrect: z.boolean().default(false),
});

// schema للسؤال (للمدرس)
export const questionSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(3, "السؤال مطلوب"),
  type: z.nativeEnum(QuestionType),
  maxScore: z.number().min(0.5).default(1),
  correctText: z.string().optional(), // يستخدم في حالة Complete
  answers: z.array(answerSchema).optional(),
});

// schema للكويز كامل (للمدرس)
export const quizFormSchema = z.object({
  title: z.string().min(3, "عنوان الاختبار مطلوب"),
  description: z.string().optional(),
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
});

// schema لإجابة الطالب (عند الحل)
export const studentAnswerSchema = z.object({
  questionId: z.string(),
  answerId: z.string().optional().nullable(), // في حالة الاختيار
  writtenAnswer: z.string().optional().nullable(), // في حالة الكتابة
});

export const submitQuizSchema = z.object({
  quizId: z.string(),
  answers: z.array(studentAnswerSchema),
});