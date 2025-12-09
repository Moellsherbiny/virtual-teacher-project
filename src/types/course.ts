
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