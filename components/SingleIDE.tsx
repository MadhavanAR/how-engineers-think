'use client';

import { useState, useEffect } from 'react';
import { Lesson, CodeExecutionResponse } from '@/types';
import CopyCodeButton from './CopyCodeButton';

interface SingleIDEProps {
  lesson: Lesson;
}

export default function SingleIDE({ lesson }: SingleIDEProps) {
  const pythonExample = lesson.examples.find(e => e.language === 'python');
  const cppExample = lesson.examples.find(e => e.language === 'cpp');

  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'cpp'>('python');
  const [originalCode, setOriginalCode] = useState<string>(pythonExample?.code || '');
  const [currentCode, setCurrentCode] = useState<string>(pythonExample?.code || '');
  const [output, setOutput] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [compilationMessage, setCompilationMessage] = useState<string>('');
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isModified, setIsModified] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [codeHistory, setCodeHistory] = useState<string[]>([pythonExample?.code || '']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const isCpp = selectedLanguage === 'cpp';
  const currentExample = isCpp ? cppExample : pythonExample;

  // Update code when language changes
  useEffect(() => {
    if (selectedLanguage === 'cpp' && cppExample) {
      setOriginalCode(cppExample.code);
      setCurrentCode(cppExample.code);
      setCodeHistory([cppExample.code]);
    } else if (pythonExample) {
      setOriginalCode(pythonExample.code);
      setCurrentCode(pythonExample.code);
      setCodeHistory([pythonExample.code]);
    }
    setHistoryIndex(0);
    setOutput('');
    setError(undefined);
    setCompiled(false);
    setCompilationMessage('');
    setIsModified(false);
  }, [selectedLanguage, cppExample, pythonExample]);

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
    const newCode = e.target.value;
    setCurrentCode(newCode);

    // Add to history (limit to last 50 changes)
    if (newCode !== codeHistory[historyIndex]) {
      const newHistory = codeHistory.slice(0, historyIndex + 1);
      newHistory.push(newCode);
      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        setHistoryIndex(newHistory.length - 1);
      }
      setCodeHistory(newHistory);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentCode(codeHistory[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < codeHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentCode(codeHistory[newIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = currentCode.substring(0, start) + '  ' + currentCode.substring(end);
      setCurrentCode(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleReset = () => {
    setCurrentCode(originalCode);
    setCodeHistory([originalCode]);
    setHistoryIndex(0);
    setOutput('');
    setError(undefined);
    setCompiled(false);
    setCompilationMessage('');
  };

  const handleCompile = async () => {
    if (!isCpp || !cppExample?.executable) return;

    setIsCompiling(true);
    setError(undefined);
    setCompilationMessage('');

    try {
      // Use client-side code executor instead of API
      const { compileCpp } = await import('@/lib/services/client-code-executor');
      const result = await compileCpp(originalCode);

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
    if (!currentExample?.executable) return;

    setIsRunning(true);
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);
    setCompilationMessage('');

    try {
      // Use client-side code executor instead of API
      const { executeCode } = await import('@/lib/services/client-code-executor');
      const result = await executeCode(
        isCpp ? originalCode : currentCode,
        selectedLanguage,
        isCpp ? 'run' : undefined
      );

      if (result.success) {
        setOutput(result.output || '');
        setExecutionTime(result.executionTime);
        setError(undefined);
        setCompilationMessage('');
      } else {
        setError(result.error || 'Execution failed');
        setOutput('');
        setCompilationMessage('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute code');
      setOutput('');
      setCompilationMessage('');
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
    if (output !== '') return output;
    if (compilationMessage) return compilationMessage;
    if (isCpp) {
      return 'Click "Compile" to compile, then "Run" to execute';
    }
    return 'Click "Run" to execute the code';
  };

  if (!pythonExample && !cppExample) {
    return null;
  }

  return (
    <div className="code-example">
      <div className="code-header">
        <div className="code-header-left">
          <div className="language-tabs">
            {pythonExample && (
              <button
                className={`language-tab ${selectedLanguage === 'python' ? 'active' : ''}`}
                onClick={() => setSelectedLanguage('python')}
              >
                Python
              </button>
            )}
            {cppExample && (
              <button
                className={`language-tab ${selectedLanguage === 'cpp' ? 'active' : ''}`}
                onClick={() => setSelectedLanguage('cpp')}
              >
                C++
              </button>
            )}
          </div>
          {!isCpp && <CopyCodeButton code={currentCode} />}
        </div>
        <div className="header-actions">
          {!isCpp && (
            <div className="code-history-buttons">
              <button
                className="history-button"
                onClick={handleUndo}
                disabled={historyIndex === 0}
                title="Undo (Ctrl+Z)"
              >
                ↶
              </button>
              <button
                className="history-button"
                onClick={handleRedo}
                disabled={historyIndex === codeHistory.length - 1}
                title="Redo (Ctrl+Y)"
              >
                ↷
              </button>
              {isModified && (
                <button
                  className="reset-button"
                  onClick={handleReset}
                  title="Reset to original code"
                >
                  Reset
                </button>
              )}
            </div>
          )}
          {currentExample?.executable && (
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
          {executionTime && <div className="execution-time">Executed in {executionTime}ms</div>}
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
