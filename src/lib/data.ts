import 'server-only';
import  prisma  from './database/prisma'; // Assuming this is your singleton Prisma client instance
import { unstable_noStore as noStore } from 'next/cache';
import api from './apiHandler';
import { auth } from './auth';

// Mock/Placeholder for a student's ID (In a real app, this comes from an auth session)
export const getStudentId = async () => {

  const session = await auth();

  return session?.user.id;
};

export type DashboardSummary = {
  totalCourses: number;
  activeCourses: number;
  completedQuizzes: number;
  avgQuizScore: number;
  latestEnrollments: {
    id: string;
    courseTitle: string;
    enrollmentDate: Date;
    instructorName: string | null;
  }[];
};

export async function getStudentDashboardData(): Promise<DashboardSummary> {
  noStore();
  const studentId = await getStudentId();
  if (!studentId) {
    throw new Error("Authentication error: Student ID not found.");
  }

  try {
    const [
      enrollmentsCount,
      quizAttempts,
      latestEnrollments,
    ] = await Promise.all([
      prisma.enrollment.count({
        where: { userId: studentId },
      }),

      // 2. All Quiz Attempts for score calculation
      prisma.quizAttempt.findMany({
        where: { userId: studentId },
        select: { score: true },
      }),

      // 3. Latest Enrollments for Activity Feed
      prisma.enrollment.findMany({
        where: { userId: studentId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          course: {
            select: {
              title: true,
              instructor: {
                select: { name: true },
              },
            },
          },
        },
      }),
    ]);

    // Calculate derived data
    const totalQuizzesAttempted = quizAttempts.length;
    const completedQuizzes = quizAttempts.filter(a => a.score !== null).length;
    const totalScore = quizAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
    const avgQuizScore = totalQuizzesAttempted > 0 ? totalScore / totalQuizzesAttempted : 0;
    
    // In a real scenario, you'd need a more complex query to determine 'active' courses.
    // For simplicity, we'll assume all enrolled courses are 'active' for now.
    const activeCourses = enrollmentsCount; 

    return {
      totalCourses: enrollmentsCount,
      activeCourses,
      completedQuizzes,
      avgQuizScore: parseFloat(avgQuizScore.toFixed(2)),
      latestEnrollments: latestEnrollments.map(e => ({
        id: e.id,
        courseTitle: e.course.title,
        enrollmentDate: e.createdAt,
        instructorName: e.course.instructor?.name || 'N/A',
      })),
    };
  } catch (error) {
    console.error("Database Error fetching student dashboard data:", error);
    // Re-throw or return a default structure for graceful degradation
    throw new Error("Failed to fetch student dashboard data.");
  }
}



// ... (previous imports and getStudentDashboardData function) ...

export type CourseProgress = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  instructorName: string | null;
  progressPercentage: number;
  totalQuizzes: number;
  completedQuizzes: number;
};

/**
 * Fetches all enrolled courses for a student and calculates their progress.
 * Progress is calculated as: (Quizzes Completed / Total Quizzes) * 100
 * NOTE: For a real LMS, progress should also include lessons/modules completion.
 */
export async function getStudentEnrolledCourses(): Promise<CourseProgress[]> {
  noStore();
  const studentId = await getStudentId(); // Reusing the mock/placeholder student ID
  if (!studentId) {
    throw new Error("Authentication error: Student ID not found for courses.");
  }
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: studentId },
      select: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            instructor: { select: { name: true } },
            quizzes: { select: { id: true } },
          },
        },
      },
    });

    // Fetch all quiz attempts by the student for score calculation (Optimized)
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId: studentId },
      select: { quizId: true, score: true },
    });

    const coursesProgress: CourseProgress[] = enrollments.map(enrollment => {
      const course = enrollment.course;
      const totalQuizzes = course.quizzes.length;
      
      // Get all quiz IDs for this specific course
      const courseQuizIds = course.quizzes.map(q => q.id);

      // Filter attempts that belong to this course and are completed (score is not null)
      const completedQuizzes = quizAttempts.filter(attempt => 
        courseQuizIds.includes(attempt.quizId) && attempt.score !== null
      ).length;

      const progressPercentage = totalQuizzes > 0 
        ? Math.round((completedQuizzes / totalQuizzes) * 100) 
        : 0;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        imageUrl: course.imageUrl,
        instructorName: course.instructor?.name || 'N/A',
        progressPercentage,
        totalQuizzes,
        completedQuizzes,
      };
    });

    return coursesProgress;
  } catch (error) {
    console.error("Database Error fetching student courses:", error);
    throw new Error("Failed to fetch student enrolled courses.");
  }
}

// --- Mock Data Function for Fallback/Skeleton ---
export const getEmptyEnrolledCourses = (): CourseProgress[] => [
  {
    id: "mock1",
    title: "The Fundamentals of Web Development",
    description: "Learn HTML, CSS, and JavaScript from scratch.",
    imageUrl: "/images/webdev.jpg",
    instructorName: "Dr. Ahmed",
    progressPercentage: 75,
    totalQuizzes: 4,
    completedQuizzes: 3,
  },
  {
    id: "mock2",
    title: "Advanced Data Structures & Algorithms",
    description: "Deep dive into efficient algorithms and complex data structures.",
    imageUrl: "/images/dsa.jpg",
    instructorName: "Prof. Sarah",
    progressPercentage: 20,
    totalQuizzes: 10,
    completedQuizzes: 2,
  },
];



// ... (previous imports and functions) ...

export type LessonContent = {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'MATERILAS';
  content: string | null; // For TEXT lesson
  videoUrl: string | null; // For VIDEO lesson
  fileUrl: string | null; // For MATERIALS lesson
  order: number;
  quizzes: { id: string; title: string; }[];
  isCompleted: boolean; // Not tracked in Prisma directly, calculated later
};

export type ModuleStructure = {
  id: string;
  title: string;
  order: number;
  lessons: LessonContent[];
};

export type CourseDetails = {
  id: string;
  title: string;
  description: string | null;
  instructorName: string | null;
  modules: ModuleStructure[];
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
};

/**
 * Fetches the detailed structure of a single course, including all modules and lessons,
 * and calculates the student's progress.
 */
export async function getStudentCourseDetails(courseId: string, studentId: string): Promise<CourseDetails> {
  noStore();
  
  if (!studentId || !courseId) {
    throw new Error("Missing Student ID or Course ID.");
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        instructor: { select: { name: true } },
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
                content: true,
                videoUrl: true,
                fileUrl: true,
                order: true,
                quizzes: { select: { id: true, title: true } },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new Error(`Course with ID ${courseId} not found.`);
    }

    // NOTE: For a real LMS, you would track lesson completion in a new table
    // (e.g., 'StudentLessonCompletion'). Since it's not in the schema, we'll
    // mock 'isCompleted' based on whether the course has any quiz attempts.
    
    // Total Quizzes in Course
    const allQuizIds = course.modules.flatMap(m => m.lessons).flatMap(l => l.quizzes).map(q => q.id);
    
    // Get all completed quiz attempts for this course
    const completedQuizAttempts = await prisma.quizAttempt.count({
      where: {
        userId: studentId,
        quizId: { in: allQuizIds },
        score: { not: null }, // Assuming score means it was completed/graded
      },
    });

    const totalQuizzes = allQuizIds.length;
    
    // Mock Lesson Completion (highly simplified: every 4 quizzes is 1 lesson completed)
    const totalLessons = course.modules.flatMap(m => m.lessons).length;
    const completedLessons = Math.min(totalLessons, Math.floor(completedQuizAttempts / 4)); // Simplistic calculation

    const overallProgress = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100) 
      : 0;

    const structuredModules: ModuleStructure[] = course.modules.map(module => ({
      ...module,
      lessons: module.lessons.map(lesson => ({
        ...lesson,
        // Mock isCompleted: assume the first N lessons are completed based on overall progress
        isCompleted: lesson.order <= (completedLessons / totalLessons) * lesson.order 
      })),
    }));


    return {
      id: course.id,
      title: course.title,
      description: course.description,
      instructorName: course.instructor?.name || 'N/A',
      modules: structuredModules,
      totalLessons,
      completedLessons,
      overallProgress,
    };

  } catch (error) {
    console.error(`Database Error fetching course ${courseId}:`, error);
    throw new Error("Failed to fetch course details.");
  }
}