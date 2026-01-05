import { getAllLessons } from '@/lib/lessons';
import { ApiResponse } from '@/lib/utils/api-response';

export async function GET() {
  try {
    const lessons = await getAllLessons();
    return ApiResponse.success(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return ApiResponse.internalError('Failed to fetch lessons');
  }
}
