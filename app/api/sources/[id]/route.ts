import { NextRequest } from 'next/server';
import { getSourceById } from '@/lib/sources';
import { ApiResponse } from '@/lib/utils/api-response';

// Force dynamic rendering - don't statically generate this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const source = await getSourceById(id);

    if (!source) {
      console.log(`Source not found: ${id}`);
      return ApiResponse.notFound('Source not found');
    }

    console.log(`Source found: ${source.name}, Lessons: ${source.lessons.length}`);
    source.lessons.forEach((lesson, index) => {
      console.log(`  Lesson ${index + 1}: ${lesson.title} (ID: ${lesson.id})`);
    });

    return ApiResponse.success(source);
  } catch (error) {
    console.error('Error fetching source:', error);
    return ApiResponse.internalError('Failed to fetch source');
  }
}
