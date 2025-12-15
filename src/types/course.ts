
export enum LessonType {
  VIDEO = "VIDEO",
  TEXT = "TEXT",
  MATERIALS = "MATERIALS",
}

export interface Lesson {
  id: string;
  title: string;
  isPublished: boolean;
  order: number;
  content?: string;
  type: LessonType;
  videoUrl?: string;
  fileUrl?: string;
}


export interface Module {
  id: string;
  title: string;
  isPublished: boolean;
  courseId: string;
  order: number;
  lessons: Lesson[];
}

export type Course = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  instructorName: string;
  modulesCount: number;
  enrollmentCount: number;
};


// src/types/course.ts
export interface LessonContent {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'FILE';
  content: string | null;
  videoUrl: string | null;
  fileUrl: string | null;
  order: number;
  quizzes: { id: string; title: string }[];
  isCompleted: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: LessonContent[];
}

export type ModuleStructure = {
  id: string;
  title: string;
  order: number;
  lessons: LessonContent[];
};
export interface CourseDetails {
   id: string;
    title: string;
    description: string | null;
    instructorName: string | null;
    modules: ModuleStructure[];
    totalLessons: number;
    completedLessons: number;
    overallProgress: number;
}
