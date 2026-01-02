'use client';

import { useState, useEffect } from 'react';
import { CodeExample as CodeExampleType, CodeExecutionResponse } from '@/types';

interface CodeExampleProps {
  example: CodeExampleType;
  exampleIndex: number;
}

export default function CodeExample({ example, exampleIndex }: CodeExampleProps) {
  const [originalCode] = useState<string>(example.code);
  const [currentCode, setCurrentCode] = useState<string>(example.code);
  const [output, setOutput] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [compilationMessage, setCompilationMessage] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isModified, setIsModified] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const isCpp = example.language === 'cpp';

  // Check if code has been modified
  useEffect(() => {
    setIsModified(currentCode !== originalCode);
    if (currentCode !== originalCode) {
      setCompiled(false);
      setOutput('');
      setError(undefined);
      setCompilationMessage('');
    }
  }, [currentCode, originalCode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentCode(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
      setCurrentCode(newValue);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleReset = () => {
    setCurrentCode(originalCode);
    setOutput('');
    setError(undefined);
    setCompiled(false);
    setCompilationMessage('');
  };

  const handleCompile = async () => {
    if (!isCpp) return;

    setIsCompiling(true);
    setError(undefined);
    setCompilationMessage('');

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: originalCode, // Use original code for C++ (not editable)
          language: example.language,
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
  };

  const handleRun = async () => {
    if (!example.executable) return;

    setIsRunning(true);
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);
    setCompilationMessage(''); // Clear compilation message when running

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: isCpp ? originalCode : currentCode, // Use original for C++, current for Python
          language: example.language,
          action: isCpp ? 'run' : undefined,
        }),
      });

      const result: CodeExecutionResponse = await response.json();

      if (result.success) {
        setOutput(result.output || ''); // Ensure output is set even if empty string
        setExecutionTime(result.executionTime);
        setError(undefined);
        setCompilationMessage(''); // Clear compilation message
      } else {
        setError(result.error || 'Execution failed');
        setOutput('');
        setCompilationMessage(''); // Clear compilation message on error
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute code');
      setOutput('');
      setCompilationMessage(''); // Clear compilation message on error
    } finally {
      setIsRunning(false);
    }
  };

  const getOutputClassName = () => {
    if (isRunning) return 'output';
    if (error) return 'output error';
    if (output) return 'output success';
    if (compilationMessage) return 'output success';
    return 'output empty';
  };

  const getOutputContent = () => {
    if (isRunning) {
      return (
        <>
          <span className="loading"></span>
          Running code...
        </>
      );
    }
    if (isCompiling) {
      return (
        <>
          <span className="loading"></span>
          Compiling...
        </>
      );
    }
    if (error) return error;
    // Show output if it exists (even if empty string, show it)
    if (output !== '') return output;
    // Show compilation message only if no output
    if (compilationMessage) return compilationMessage;
    if (isCpp) {
      return 'Click "Compile" to compile, then "Run" to execute';
    }
    return 'Click "Run" to execute the code';
  };

  return (
    <div className="code-example">
      <div className="code-header">
        <h4>{example.language.toUpperCase()}</h4>
        <div className="header-actions">
          {!isCpp && isModified && (
            <button
              className="reset-button"
              onClick={handleReset}
              title="Reset to original code"
            >
              Reset
            </button>
          )}
          {example.executable && (
            <div className="action-buttons">
              {isCpp && (
                <button
                  className="compile-button"
                  onClick={handleCompile}
                  disabled={isCompiling || isRunning}
                >
                  {isCompiling ? 'Compiling...' : 'Compile'}
                </button>
              )}
              <button
                className="run-button"
                onClick={handleRun}
                disabled={isRunning || isCompiling || (isCpp && !compiled)}
              >
                {isRunning ? 'Running...' : 'Run'}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={`code-block code-block-${theme}`}>
        {isCpp ? (
          <pre className="code-content">{originalCode}</pre>
        ) : (
          <textarea
            className="code-editor"
            value={currentCode}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            placeholder="Edit the code here and test with different inputs..."
            spellCheck={false}
          />
        )}
      </div>
      <div className={`${getOutputClassName()} output-header`}>
        <div className="output-content">
          {getOutputContent()}
          {executionTime && (
            <div className="execution-time">
              Executed in {executionTime}ms
            </div>
          )}
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  );
}
