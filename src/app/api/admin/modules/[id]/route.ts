// ==========================================
// MODULES ENDPOINTS
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import  prisma from '@/lib/database/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

// GET single module
export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;
    const module = await prisma.module.findUnique({
      where: { id },
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
    });

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    );
  }
}

// UPDATE module
export async function PATCH(
  request: NextRequest,
  { params }: Params
) {
  try {
    const body = await request.json();
    const { title, order, courseId } = body;
    const { id } = await params;

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id },
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Update module
    const module = await prisma.module.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(order !== undefined && { order }),
        ...(courseId && { courseId }),
      },
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
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    );
  }
}

// DELETE module
export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Delete all lessons in this module first
    await prisma.lesson.deleteMany({
      where: { moduleId: id },
    });

    // Delete the module
    await prisma.module.delete({
      where: { id: id },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Module and all lessons deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}
