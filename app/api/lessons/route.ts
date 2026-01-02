import { NextResponse } from 'next/server';
import { getAllLessons } from '@/lib/lessons';

export async function GET() {
  try {
    const lessons = getAllLessons();
    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
