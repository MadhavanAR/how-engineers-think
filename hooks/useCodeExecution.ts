import { useState, useCallback } from 'react';
import { CodeExecutionRequest, CodeExecutionResponse } from '@/types';

interface UseCodeExecutionReturn {
  output: string;
  error: string | undefined;
  executionTime: number | undefined;
  isRunning: boolean;
  isCompiling: boolean;
  compiled: boolean;
  compilationMessage: string;
  execute: (request: CodeExecutionRequest) => Promise<void>;
  compile: (code: string, language: 'cpp') => Promise<void>;
  reset: () => void;
}

export function useCodeExecution(): UseCodeExecutionReturn {
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | undefined>();
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [compilationMessage, setCompilationMessage] = useState('');

  const execute = useCallback(async (request: CodeExecutionRequest) => {
    setIsRunning(true);
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const result: CodeExecutionResponse = await response.json();

      if (result.success) {
        setOutput(result.output || '');
        setExecutionTime(result.executionTime);
        setError(undefined);
      } else {
        setError(result.error || 'Execution failed');
        setOutput('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute code');
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  }, []);

  const compile = useCallback(async (code: string, language: 'cpp') => {
    setIsCompiling(true);
    setError(undefined);
    setCompilationMessage('');

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          action: 'compile',
        }),
      });

      const result: CodeExecutionResponse = await response.json();

      if (result.success) {
        setCompiled(true);
        setCompilationMessage(result.output || 'Compilation successful!');
        setError(undefined);
      } else {
        setCompiled(false);
        setError(result.error || 'Compilation failed');
        setCompilationMessage('');
      }
    } catch (err) {
      setCompiled(false);
      setError(err instanceof Error ? err.message : 'Failed to compile code');
      setCompilationMessage('');
    } finally {
      setIsCompiling(false);
    }
  }, []);

  const reset = useCallback(() => {
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);
    setCompiled(false);
    setCompilationMessage('');
  }, []);

  return {
    output,
    error,
    executionTime,
    isRunning,
    isCompiling,
    compiled,
    compilationMessage,
    execute,
    compile,
    reset,
  };
}

