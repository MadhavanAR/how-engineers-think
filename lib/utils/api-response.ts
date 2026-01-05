import { NextResponse } from 'next/server';

export class ApiResponse {
  static success<T>(data: T, status: number = 200): NextResponse {
    return NextResponse.json(data, { status });
  }

  static error(message: string, status: number = 500): NextResponse {
    return NextResponse.json({ error: message }, { status });
  }

  static notFound(message: string = 'Resource not found'): NextResponse {
    return this.error(message, 404);
  }

  static badRequest(message: string = 'Bad request'): NextResponse {
    return this.error(message, 400);
  }

  static internalError(message: string = 'Internal server error'): NextResponse {
    return this.error(message, 500);
  }
}

