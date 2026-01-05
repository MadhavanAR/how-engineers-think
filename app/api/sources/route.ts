import { getAllSources } from '@/lib/sources';
import { ApiResponse } from '@/lib/utils/api-response';

export async function GET() {
  try {
    const sources = await getAllSources();
    return ApiResponse.success(sources);
  } catch (error) {
    console.error('Error fetching sources:', error);
    return ApiResponse.internalError('Failed to fetch sources');
  }
}
