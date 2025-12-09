import { NextRequest, NextResponse } from 'next/server';
import prisma  from '@/lib/database/prisma';
import {auth} from "@/lib/auth"
export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.quiz.findMany();

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title and instructor are required' },
        { status: 400 }
      );
    }

    const course = await prisma.quiz.create({
      data: {
        title,
        description,
      },
    
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}