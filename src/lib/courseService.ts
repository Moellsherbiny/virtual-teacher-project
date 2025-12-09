
import { Prisma } from "../generated/prisma/client";
import  db  from "./database/prisma";

// ===========================================
// TYPE DEFINITIONS FOR DATA FETCHING
// ===========================================

// Define the shape of data needed for the student course page
const courseDetailsSelect = {
  id: true,
  title: true,
  description: true,
  imageUrl: true,
  instructor: {
    select: {
      id: true,
      // Add other necessary user fields like name, profileImage, etc.
    },
  },
  modules: {
    orderBy: { order: 'asc' },
    select: {
      id: true,
      title: true,
      order: true,
      lessons: {
        orderBy: { order: 'asc' },
        select: {
          id: true,
          title: true,
          type: true,
          order: true,
        },
      },
    },
  },
} satisfies Prisma.CourseSelect;
export type CourseDetails = Prisma.CourseGetPayload<{
  select: typeof courseDetailsSelect;
}>;

export type RecommendedCourse = Pick<CourseDetails, 'id' | 'title' | 'imageUrl'>;

// ===========================================
// CORE SERVICE FUNCTIONS
// ===========================================

export async function getCourseDetailsForStudent(courseId: string, userId: string): Promise<CourseDetails | null> {
  // NOTE: This query handles fetching all modules and lessons efficiently.
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      ...courseDetailsSelect,
      enrollments: {
        where: { userId },
        select: { id: true }, // Used for enrollment check
      },
      // You would add progress/completion data here
    },
  });

  if (!course) {
    return null;
  }
  
  // Basic enrollment check (modify as per your auth logic)
  if (course.enrollments.length === 0) {
      // return null or throw an error if the user is not enrolled
  }
  
  const { enrollments, ...courseDetails } = course;
  return courseDetails;
}


export async function getRecommendedCourses(currentCourseId: string): Promise<RecommendedCourse[]> {
    // Example logic for recommended courses
    const recommendedCourses = await db.course.findMany({
        where: {
            id: { not: currentCourseId },
        },
        select: {
            id: true,
            title: true,
            imageUrl: true,
        },
        take: 4, 
    });

    return recommendedCourses;
}

const lessonContentSelect = {
    id: true,
    title: true,
    content: true,
    videoUrl: true,
    fileUrl: true,
    type: true,
    order: true,
    module: {
        select: {
            title: true,
            course: {
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    }
} satisfies Prisma.LessonSelect;

export type LessonContent = Prisma.LessonGetPayload<{
    select: typeof lessonContentSelect;
}>;


export async function getLessonContent(lessonId: string): Promise<LessonContent | null> {
    const lesson = await db.lesson.findUnique({
        where: { id: lessonId },
        select: lessonContentSelect,
    });

    return lesson;
}