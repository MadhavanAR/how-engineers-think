import { CodeExecutionRequest, CodeExecutionResponse } from '@/types';
import { EXECUTION_CONFIG } from './constants';
import { validateExecutionRequest } from './validation';
import { sanitizeCode } from './security';
import { SecurityError, CodeExecutionError } from './utils/errors';
import { PistonClient } from './services/piston-client';

export class CodeExecutor {
  private readonly pistonClient: PistonClient;

  constructor() {
    this.pistonClient = new PistonClient();
  }

  async execute(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const startTime = Date.now();

    try {
      validateExecutionRequest(request);
      const sanitizedCode = sanitizeCode(request.code, request.language);
      const action = request.action || 'compile-and-run';

      const result = await this.executeByLanguage(sanitizedCode, request.language, action);
      result.executionTime = Date.now() - startTime;
      
      return result;
    } catch (error) {
      return this.handleError(error, Date.now() - startTime);
    }
  }

  private async executeByLanguage(
    code: string,
    language: 'python' | 'cpp',
    action: string
  ): Promise<CodeExecutionResponse> {
    if (language === 'python') {
      return this.executePython(code);
    }

    switch (action) {
      case 'compile':
        return this.compileCpp(code);
      case 'run':
      case 'compile-and-run':
      default:
        return this.executeCpp(code);
    }
  }

  private async executePython(code: string): Promise<CodeExecutionResponse> {
    const result = await this.pistonClient.execute('python', code);
    
    return {
      success: result.success,
      output: result.success ? this.truncateOutput(result.output) : '',
      error: result.success ? undefined : result.error,
    };
  }

  private async compileCpp(code: string): Promise<CodeExecutionResponse> {
    const result = await this.pistonClient.checkCompilation('cpp', code, ['-std=c++17']);
    
    return {
      success: result.success,
      output: result.success ? 'Compilation successful!' : '',
      error: result.success ? undefined : result.error,
      compiled: result.success,
    };
  }

  private async executeCpp(code: string): Promise<CodeExecutionResponse> {
    const result = await this.pistonClient.execute('cpp', code, ['-std=c++17']);
    
    return {
      success: result.success,
      output: result.success ? this.truncateOutput(result.output) : '',
      error: result.success ? undefined : result.error,
    };
  }

  private handleError(error: unknown, executionTime: number): CodeExecutionResponse {
    if (error instanceof SecurityError || error instanceof CodeExecutionError) {
      return {
        success: false,
        output: '',
        error: error.message,
        executionTime,
      };
    }

    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      executionTime,
    };
  }

  private truncateOutput(output: string): string {
    if (output.length > EXECUTION_CONFIG.MAX_OUTPUT_LENGTH) {
      return (
        output.substring(0, EXECUTION_CONFIG.MAX_OUTPUT_LENGTH) +
        '\n... (output truncated)'
      );
    }
    return output;
  }
}
