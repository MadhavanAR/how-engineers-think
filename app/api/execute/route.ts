import { NextRequest } from 'next/server';
import { CodeExecutionRequest } from '@/types';
import { CodeExecutor } from '@/lib/code-executor';
import { ApiResponse } from '@/lib/utils/api-response';
import { ValidationError, SecurityError } from '@/lib/utils/errors';

export async function POST(request: NextRequest) {
  try {
    const body: CodeExecutionRequest = await request.json();
    const executor = new CodeExecutor();
    const result = await executor.execute(body);

    return ApiResponse.success(result);
  } catch (error) {
    console.error('Code execution error:', error);

    if (error instanceof ValidationError) {
      return ApiResponse.badRequest(error.message);
    }

    if (error instanceof SecurityError) {
      return ApiResponse.badRequest(error.message);
    }

    return ApiResponse.internalError(
      error instanceof Error ? error.message : 'Internal server error'
    );
  }
}
