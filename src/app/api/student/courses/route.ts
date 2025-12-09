
import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/database/prisma';


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
 
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
        enrollments: userId ? {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Add isEnrolled flag if userId provided
    const coursesWithEnrollment = courses.map(course => ({
      ...course,
      isEnrolled: userId ? (course.enrollments && course.enrollments.length > 0) : undefined,
      enrollments: undefined, // Remove enrollments array from response
    }))

    return NextResponse.json(coursesWithEnrollment)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}