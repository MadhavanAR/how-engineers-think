import { NextRequest } from 'next/server';
import { getLessonById } from '@/lib/lessons';
import { ApiResponse } from '@/lib/utils/api-response';
import { NotFoundError } from '@/lib/utils/errors';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await getLessonById(params.id);

    if (!lesson) {
      return ApiResponse.notFound('Lesson not found');
    }

    return ApiResponse.success(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    
    if (error instanceof NotFoundError) {
      return ApiResponse.notFound(error.message);
    }

    return ApiResponse.internalError('Failed to fetch lesson');
  }
}
