import { NextRequest, NextResponse } from 'next/server';
import { CodeExecutionRequest, CodeExecutionResponse } from '@/types';
import { CodeExecutor } from '@/lib/code-executor';

export async function POST(request: NextRequest) {
  try {
    const body: CodeExecutionRequest = await request.json();

    const executor = new CodeExecutor();
    const result: CodeExecutionResponse = await executor.execute(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Code execution error:', error);
    
    const errorResponse: CodeExecutionResponse = {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Internal server error',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
