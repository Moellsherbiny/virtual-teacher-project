import { Course } from "./course";

export interface Enrollment {
  id: number;
  userId: number;
  course_id: number;
  enrolled_at: Date;
  Course: Course;
}
