import { NextRequest, NextResponse } from 'next/server'
import prisma  from '@/lib/database/prisma'
import {auth} from "@/lib/auth"

// POST - Create enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseId } = body

    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const userId = session.user.id;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'userId and courseId are required' },
        { status: 400 }
      )
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 409 }
      )
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    )
  }
}

// DELETE - Remove enrollment
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseId } = body
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const userId = session.user.id
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'userId and courseId are required' },
        { status: 400 }
      )
    }

    // Check if enrollment exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    if (!existingEnrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 404 }
      )
    }

    // Delete enrollment
    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    return NextResponse.json(
      { message: 'Successfully unenrolled from course' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to unenroll from course' },
      { status: 500 }
    )
  }
}

// GET - Get user enrollments
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const userId = session.user.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}
