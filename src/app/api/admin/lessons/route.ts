import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/database/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get('moduleId');

    const where = moduleId ? { moduleId } : {};

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        module: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// CREATE new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, videoUrl, fileUrl, order, type, moduleId } = body;

    // Validation
    if (!title || !moduleId) {
      return NextResponse.json(
        { error: 'Title and module are required' },
        { status: 400 }
      );
    }

    // Validate lesson type
    const validTypes = ['VIDEO', 'TEXT', 'MATERILAS'];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid lesson type. Must be VIDEO, TEXT, or MATERILAS' },
        { status: 400 }
      );
    }

    // Check if module exists
    const moduleExists = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!moduleExists) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Get the next order number if not provided
    let lessonOrder = order;
    if (lessonOrder === undefined || lessonOrder === null) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { moduleId },
        orderBy: { order: 'desc' },
      });
      lessonOrder = (lastLesson?.order || 0) + 1;
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        content: content || null,
        videoUrl: videoUrl || null,
        fileUrl: fileUrl || null,
        order: lessonOrder,
        type: type || 'VIDEO',
        moduleId,
      },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}