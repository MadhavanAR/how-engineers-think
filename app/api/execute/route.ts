import { NextRequest, NextResponse } from 'next/server';
import { CodeExecutor } from '@/lib/code-executor';
import { ApiResponse } from '@/lib/utils/api-response';
import { ValidationError, SecurityError } from '@/lib/utils/errors';
import { codeExecutionRequestSchema } from '@/lib/validation/schemas';
import { codeExecutionRateLimiter } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!codeExecutionRateLimiter.isAllowed(ip)) {
      const resetTime = codeExecutionRateLimiter.getResetTime(ip);
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': String(codeExecutionRateLimiter.getRemaining(ip)),
            'X-RateLimit-Reset': String(resetTime),
          },
        }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = codeExecutionRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.badRequest(
        `Validation error: ${validationResult.error.issues.map(e => e.message).join(', ')}`
      );
    }

    const executor = new CodeExecutor();
    const result = await executor.execute(validationResult.data);

    // Add rate limit headers to response
    const response = ApiResponse.success(result);
    response.headers.set('X-RateLimit-Limit', '10');
    response.headers.set(
      'X-RateLimit-Remaining',
      String(codeExecutionRateLimiter.getRemaining(ip))
    );
    response.headers.set('X-RateLimit-Reset', String(codeExecutionRateLimiter.getResetTime(ip)));

    return response;
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
