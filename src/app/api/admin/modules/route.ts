// ==========================================
// MODULES ROUTES
// ==========================================

// app/api/admin/modules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/database/prisma';

// GET all modules (with optional courseId filter)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');

    const where = courseId ? { courseId } : {};

    const modules = await prisma.module.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        lessons: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

// CREATE new module
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, order, courseId } = body;

    // Validation
    if (!title || !courseId) {
      return NextResponse.json(
        { error: 'Title and course are required' },
        { status: 400 }
      );
    }

    // Check if course exists
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get the next order number if not provided
    let moduleOrder = order;
    if (moduleOrder === undefined || moduleOrder === null) {
      const lastModule = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
      });
      moduleOrder = (lastModule?.order || 0) + 1;
    }

    // Create module
    const module = await prisma.module.create({
      data: {
        title,
        order: moduleOrder,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        lessons: true,
      },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}

