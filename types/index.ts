export interface CodeExecutionRequest {
  code: string;
  language: 'python' | 'cpp';
  action?: 'compile' | 'run' | 'compile-and-run';
  executablePath?: string;
}

export interface CodeExecutionResponse {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  executablePath?: string;
  compiled?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  concept: {
    title: string;
    content: string;
  };
  scenario: {
    title: string;
    content: string;
  };
  applications: string[];
  examples: CodeExample[];
}

export interface CodeExample {
  language: 'python' | 'cpp';
  code: string;
  executable: boolean;
  compileNote?: string;
}
