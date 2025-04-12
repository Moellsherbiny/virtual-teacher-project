
import { NextResponse } from 'next/server';
import {pool} from '@/lib/database/db';
import { Enrollment } from '@/types/enrollment';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await pool.query<Enrollment>(
      'SELECT * FROM enrollments WHERE id = $1',
      [params.id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await pool.query('DELETE FROM enrollments WHERE id = $1', [params.id]);
    return NextResponse.json({ message: 'Enrollment deleted' }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}