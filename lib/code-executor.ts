import { spawn } from 'child_process';
import { CodeExecutionRequest, CodeExecutionResponse } from '@/types';
import { EXECUTION_CONFIG } from './constants';
import { validateExecutionRequest } from './validation';
import { sanitizeCode, SecurityError } from './security';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

export class CodeExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CodeExecutionError';
  }
}

export class CodeExecutor {
  private tempDir: string | null = null;

  async execute(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const startTime = Date.now();

    try {
      // Validate request
      validateExecutionRequest(request);

      // Sanitize code
      const sanitizedCode = sanitizeCode(request.code, request.language);

      // Handle different actions
      const action = request.action || 'compile-and-run';
      let result: CodeExecutionResponse;

      if (request.language === 'python') {
        // Python doesn't need compilation
        result = await this.executePython(sanitizedCode);
      } else {
        // C++ can compile, run, or both
        if (action === 'compile') {
          result = await this.compileCpp(sanitizedCode);
        } else if (action === 'run') {
          result = await this.runCpp(sanitizedCode, request.executablePath);
        } else {
          result = await this.executeCpp(sanitizedCode);
        }
      }

      result.executionTime = Date.now() - startTime;
      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
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
    } finally {
      // Cleanup temp files after execution
      // Note: For compile-only, we still cleanup as we can't persist across stateless API requests
      // Run will recompile if needed
      await this.cleanup();
    }
  }

  private async executePython(code: string): Promise<CodeExecutionResponse> {
    const tempFile = await this.createTempFile('py', code);
    
    try {
      const output = await this.runCommand('python3', [tempFile], EXECUTION_CONFIG.TIMEOUT_MS);
      return {
        success: true,
        output: this.truncateOutput(output),
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
      };
    }
  }

  private async compileCpp(code: string): Promise<CodeExecutionResponse> {
    const tempFile = await this.createTempFile('cpp', code);
    const executablePath = tempFile.replace('.cpp', '');

    try {
      // Compile only - capture both stdout and stderr
      try {
        await this.runCommand(
          'g++',
          ['-std=c++17', '-o', executablePath, tempFile],
          EXECUTION_CONFIG.TIMEOUT_MS
        );
      } catch (compileError) {
        // Compilation failed - return error
        return {
          success: false,
          output: '',
          error: compileError instanceof Error ? compileError.message : 'Compilation failed',
          compiled: false,
        };
      }

      // Check if executable exists and set execute permissions
      try {
        await fs.access(executablePath);
        // Set execute permissions (chmod +x)
        await fs.chmod(executablePath, 0o755);
        return {
          success: true,
          output: 'Compilation successful!',
          executablePath,
          compiled: true,
        };
      } catch (error) {
        return {
          success: false,
          output: '',
          error: `Compilation succeeded but executable not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`,
          compiled: false,
        };
      }
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Compilation failed',
        compiled: false,
      };
    }
  }

  private async runCpp(code: string, existingExecutablePath?: string): Promise<CodeExecutionResponse> {
    // For 'run' action, we always recompile since we can't persist executables
    // This is the same as executeCpp but we call it from runCpp for consistency
    const tempFile = await this.createTempFile('cpp', code);
    const executablePath = tempFile.replace('.cpp', '');

    try {
      // Compile
      const compileOutput = await this.runCommand(
        'g++',
        ['-std=c++17', '-o', executablePath, tempFile],
        EXECUTION_CONFIG.TIMEOUT_MS
      );

      // If there's any output from compilation, it's an error
      if (compileOutput && compileOutput.trim()) {
        return {
          success: false,
          output: '',
          error: `Compilation error: ${compileOutput}`,
        };
      }

      // Set execute permissions
      try {
        await fs.chmod(executablePath, 0o755);
      } catch {
        // Ignore chmod errors, try to run anyway
      }

      // Execute - combine stderr to capture cerr output
      const executionOutput = await this.runCommand(executablePath, [], EXECUTION_CONFIG.TIMEOUT_MS, true);
      
      // Clean up executable and source file
      try {
        await fs.unlink(executablePath);
        await fs.unlink(tempFile);
      } catch {
        // Ignore cleanup errors
      }

      // Return output even if empty (program might have run successfully with no output)
      return {
        success: true,
        output: executionOutput ? this.truncateOutput(executionOutput) : '',
      };
    } catch (error) {
      // Clean up on error
      try {
        await fs.unlink(executablePath).catch(() => {});
        await fs.unlink(tempFile).catch(() => {});
      } catch {
        // Ignore cleanup errors
      }

      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
      };
    }
  }

  private async executeCpp(code: string): Promise<CodeExecutionResponse> {
    const tempFile = await this.createTempFile('cpp', code);
    const executablePath = tempFile.replace('.cpp', '');

    try {
      // Compile
      const compileOutput = await this.runCommand(
        'g++',
        ['-std=c++17', '-o', executablePath, tempFile],
        EXECUTION_CONFIG.TIMEOUT_MS
      );

      if (compileOutput) {
        return {
          success: false,
          output: '',
          error: `Compilation error: ${compileOutput}`,
        };
      }

      // Set execute permissions and execute
      try {
        await fs.chmod(executablePath, 0o755);
      } catch {
        // Ignore chmod errors, try to run anyway
      }

      // Execute - combine stderr to capture cerr output
      const output = await this.runCommand(executablePath, [], EXECUTION_CONFIG.TIMEOUT_MS, true);
      
      // Clean up executable
      try {
        await fs.unlink(executablePath);
      } catch {
        // Ignore cleanup errors
      }

      return {
        success: true,
        output: this.truncateOutput(output),
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
      };
    }
  }

  private async createTempFile(extension: string, content: string): Promise<string> {
    if (!this.tempDir) {
      this.tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-exec-'));
    }

    const fileName = `code-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    const filePath = path.join(this.tempDir, fileName);
    
    await fs.writeFile(filePath, content, 'utf-8');
    return filePath;
  }

  private async runCommand(
    command: string,
    args: string[],
    timeoutMs: number,
    combineStderr: boolean = false
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args);
      let stdout = '';
      let stderr = '';

      const timeout = setTimeout(() => {
        process.kill();
        reject(new CodeExecutionError(`Execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      process.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        clearTimeout(timeout);
        
        if (code !== 0) {
          reject(new CodeExecutionError(stderr || `Process exited with code ${code}`));
        } else {
          // For execution (not compilation), combine stdout and stderr
          // This is important because C++ code may write to cerr
          if (combineStderr) {
            // Combine both stdout and stderr, even if one is empty
            const combined = [stdout, stderr].filter(s => s.trim()).join('\n');
            resolve(combined || stdout || stderr || '');
          } else {
            resolve(stdout);
          }
        }
      });

      process.on('error', (error) => {
        clearTimeout(timeout);
        reject(new CodeExecutionError(`Failed to start process: ${error.message}`));
      });
    });
  }

  private truncateOutput(output: string): string {
    if (output.length > EXECUTION_CONFIG.MAX_OUTPUT_LENGTH) {
      return output.substring(0, EXECUTION_CONFIG.MAX_OUTPUT_LENGTH) + '\n... (output truncated)';
    }
    return output;
  }

  private async cleanup(): Promise<void> {
    if (this.tempDir) {
      try {
        await fs.rm(this.tempDir, { recursive: true, force: true });
      } catch (error) {
        console.error('Failed to cleanup temp directory:', error);
      }
      this.tempDir = null;
    }
  }
}
