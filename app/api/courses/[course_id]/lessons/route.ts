
import {pool} from '@/lib/database/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { course_id: number } }) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM "Lesson" WHERE "course_id" = $1',
      [params.course_id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.error();
  }
}
