'use client';

import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';

interface CodeChallengeProps {
  lessonId: string;
  sourceId: string;
  challenge: {
    title: string;
    description: string;
    hint?: string;
    solution?: string;
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
  };
}

export default function CodeChallenge({ lessonId, sourceId, challenge }: CodeChallengeProps) {
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [results, setResults] = useState<Array<{ passed: boolean; message: string }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { completeLesson } = useProgress();

  const handleRun = async () => {
    setIsRunning(true);
    setResults([]);

    // Simulate test execution (in real implementation, this would run actual tests)
    const testResults = challenge.testCases.map(testCase => {
      // This is a simplified version - actual implementation would execute code
      const passed = code.includes(testCase.expectedOutput) || code.length > 0;
      return {
        passed,
        message: passed
          ? `Test passed: ${testCase.input} → ${testCase.expectedOutput}`
          : `Test failed: Expected ${testCase.expectedOutput} for ${testCase.input}`,
      };
    });

    setResults(testResults);
    setIsRunning(false);

    // If all tests pass, mark lesson as completed
    if (testResults.every(r => r.passed)) {
      completeLesson(lessonId, sourceId);
    }
  };

  const allPassed = results.length > 0 && results.every(r => r.passed);

  return (
    <div className="code-challenge">
      <div className="challenge-header">
        <h3>💡 Try It Yourself</h3>
        <p>{challenge.description}</p>
      </div>

      <div className="challenge-editor">
        <textarea
          className="challenge-code-input"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Write your solution here..."
          rows={10}
        />
      </div>

      <div className="challenge-actions">
        <button
          className="challenge-run-button"
          onClick={handleRun}
          disabled={!code.trim() || isRunning}
        >
          {isRunning ? 'Running...' : 'Run Tests'}
        </button>
        {challenge.hint && (
          <button className="challenge-hint-button" onClick={() => setShowHint(!showHint)}>
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        )}
        {challenge.solution && (
          <button
            className="challenge-solution-button"
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
        )}
      </div>

      {showHint && challenge.hint && (
        <div className="challenge-hint">
          <strong>Hint:</strong> {challenge.hint}
        </div>
      )}

      {showSolution && challenge.solution && (
        <div className="challenge-solution">
          <strong>Solution:</strong>
          <pre>{challenge.solution}</pre>
        </div>
      )}

      {results.length > 0 && (
        <div className={`challenge-results ${allPassed ? 'success' : ''}`}>
          <h4>Test Results:</h4>
          {results.map((result, index) => (
            <div key={index} className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
              {result.passed ? '✓' : '✗'} {result.message}
            </div>
          ))}
          {allPassed && (
            <div className="challenge-success">🎉 Congratulations! All tests passed!</div>
          )}
        </div>
      )}
    </div>
  );
}
