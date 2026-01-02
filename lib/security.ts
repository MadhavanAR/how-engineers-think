import { EXECUTION_CONFIG } from './constants';

const DANGEROUS_PATTERNS = [
  /import\s+os\s*$/m,
  /import\s+subprocess/m,
  /import\s+sys/m,
  /__import__/,
  /eval\(/,
  /exec\(/,
  /open\(/,
  /file\(/,
  /input\(/,
  /raw_input\(/,
  /system\(/,
  /popen\(/,
  /spawn\(/,
  /fork\(/,
  /execve\(/,
];

const ALLOWED_IMPORTS = [
  'os.path.exists',
  'os.path.isfile',
  'os.path.isdir',
];

export class SecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityError';
  }
}

export function sanitizeCode(code: string, language: 'python' | 'cpp'): string {
  if (language === 'python') {
    return sanitizePythonCode(code);
  }
  return sanitizeCppCode(code);
}

function sanitizePythonCode(code: string): string {
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      // Allow specific safe patterns - if importing os, only allow if using safe methods
      if (pattern.source.includes('import\\s+os')) {
        const usesSafeOsMethods = 
          code.includes('os.path.exists') || 
          code.includes('os.path.isfile') ||
          code.includes('os.path.isdir');
        
        if (usesSafeOsMethods) {
          continue; // Allow this import
        }
      }
      
      throw new SecurityError(
        `Potentially unsafe code detected: ${pattern.source}`
      );
    }
  }

  // Additional checks for file operations
  if (code.includes('open(') && !code.includes('os.path.exists')) {
    throw new SecurityError('File operations must be preceded by existence checks');
  }

  return code;
}

function sanitizeCppCode(code: string): string {
  // C++ is more restrictive - check for dangerous includes
  const dangerousIncludes = [
    '<cstdlib>',
    '<stdlib.h>',
    '<unistd.h>',
    '<sys/wait.h>',
    '<process.h>',
  ];

  for (const include of dangerousIncludes) {
    if (code.includes(`#include ${include}`)) {
      throw new SecurityError(`Dangerous include detected: ${include}`);
    }
  }

  // Check for system calls
  if (code.includes('system(') || code.includes('exec(')) {
    throw new SecurityError('System calls are not allowed');
  }

  return code;
}
