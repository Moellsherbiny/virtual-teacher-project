
export interface Course {
  course_id: number;
  title: string;
  description: string;
  created_at: Date;
  filed: boolean;
  course_image: string;
  enrollments: number;
  lessons: number;
}