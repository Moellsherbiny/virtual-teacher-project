
import { Course } from './course';

export interface Lessons {
  lesson_id: number;
  course_id: number;
  title: string;
  content: string;
  Course: Course;
}