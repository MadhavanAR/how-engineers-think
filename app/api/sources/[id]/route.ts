import { NextRequest } from 'next/server';
import { getSourceById } from '@/lib/sources';
import { ApiResponse } from '@/lib/utils/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const source = await getSourceById(params.id);

    if (!source) {
      return ApiResponse.notFound('Source not found');
    }

    return ApiResponse.success(source);
  } catch (error) {
    console.error('Error fetching source:', error);
    return ApiResponse.internalError('Failed to fetch source');
  }
}
