
// ==========================================
// LESSONS ENDPOINTS
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/database/prisma';

interface Params {
  params: Promise<{ id: string }>;
}


// GET single lesson
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const {id} = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
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

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// UPDATE lesson
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const body = await request.json();
    const { title, content, videoUrl, fileUrl, order, type, moduleId } = body;
    const { id } = await params;

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Update lesson
    const lesson = await prisma.lesson.update({
      where: { id},
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(order !== undefined && { order }),
        ...(type && { type }),
        ...(moduleId && { moduleId }),
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

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE lesson
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id},
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Delete the lesson
    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Lesson deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}