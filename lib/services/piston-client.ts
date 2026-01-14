import { CodeExecutionError } from '../utils/errors';
import { EXECUTION_CONFIG } from '../constants';
import { env } from '../config/env';

export type SupportedLanguage = 'python' | 'cpp';

interface PistonExecuteRequest {
  language: string;
  version: string;
  files: Array<{ content: string }>;
  compile_timeout: number;
  run_timeout: number;
  compile_args?: string[];
}

interface PistonResponse {
  compile?: {
    code: number;
    stdout: string;
    stderr: string;
  };
  run: {
    code: number;
    stdout: string;
    stderr: string;
  };
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

const LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  python: 'python3',
  cpp: 'cpp',
} as const;

export class PistonClient {
  private readonly apiUrl: string;
  private readonly timeout: number;

  constructor() {
    this.apiUrl = env.pistonApiUrl;
    this.timeout = EXECUTION_CONFIG.TIMEOUT_MS;
  }

  async execute(
    language: SupportedLanguage,
    code: string,
    compileArgs?: string[]
  ): Promise<ExecutionResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.buildRequest(language, code, compileArgs)),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new CodeExecutionError(`Piston API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as PistonResponse;
      return this.parseResponse(data);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new CodeExecutionError(`Execution timed out after ${this.timeout}ms`);
        }
        if (error instanceof CodeExecutionError) {
          throw error;
        }
        throw new CodeExecutionError(error.message);
      }

      throw new CodeExecutionError('Unknown error occurred');
    }
  }

  async checkCompilation(
    language: SupportedLanguage,
    code: string,
    compileArgs?: string[]
  ): Promise<{ success: boolean; error?: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const request = this.buildRequest(language, code, compileArgs);
      request.run_timeout = 1000; // Minimal timeout for compile-only

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new CodeExecutionError(`Piston API error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as PistonResponse;

      if (data.compile) {
        if (data.compile.code !== 0) {
          return {
            success: false,
            error: data.compile.stderr || data.compile.stdout || 'Compilation failed',
          };
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new CodeExecutionError(`Execution timed out after ${this.timeout}ms`);
        }
        if (error instanceof CodeExecutionError) {
          throw error;
        }
        throw new CodeExecutionError(error.message);
      }

      throw new CodeExecutionError('Unknown error occurred');
    }
  }

  private buildRequest(
    language: SupportedLanguage,
    code: string,
    compileArgs?: string[]
  ): PistonExecuteRequest {
    return {
      language: LANGUAGE_MAP[language],
      version: '*',
      files: [{ content: code }],
      compile_timeout: 10000,
      run_timeout: 10000,
      compile_args: compileArgs,
    };
  }

  private parseResponse(data: PistonResponse): ExecutionResult {
    const { compile, run } = data;

    // Check compilation errors
    if (compile && compile.code !== 0) {
      return {
        success: false,
        output: '',
        error: compile.stderr || compile.stdout || 'Compilation failed',
      };
    }

    // Check runtime errors
    if (run.code !== 0) {
      const errorOutput = [run.stderr, run.stdout].filter(Boolean).join('\n');
      return {
        success: false,
        output: '',
        error: errorOutput || `Process exited with code ${run.code}`,
      };
    }

    // Success - combine stdout and stderr
    const output = [run.stdout, run.stderr].filter(Boolean).join('\n');
    return {
      success: true,
      output: output || '',
    };
  }
}
