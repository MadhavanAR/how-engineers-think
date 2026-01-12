import { describe, it, expect } from 'vitest';
import { sanitizeCode } from '@/lib/security';
import { SecurityError } from '@/lib/utils/errors';

describe('Code Sanitization', () => {
  describe('Python', () => {
    it('should allow safe Python code', () => {
      const code = `
def hello():
    print("Hello, World!")
      `.trim();
      expect(() => sanitizeCode(code, 'python')).not.toThrow();
    });

    it('should allow safe os.path operations', () => {
      const code = `
import os
if os.path.exists("file.txt"):
    print("File exists")
      `.trim();
      expect(() => sanitizeCode(code, 'python')).not.toThrow();
    });

    it('should reject dangerous imports', () => {
      const code = 'import subprocess';
      expect(() => sanitizeCode(code, 'python')).toThrow(SecurityError);
    });

    it('should reject eval()', () => {
      const code = 'eval("print(1)")';
      expect(() => sanitizeCode(code, 'python')).toThrow(SecurityError);
    });

    it('should reject exec()', () => {
      const code = 'exec("print(1)")';
      expect(() => sanitizeCode(code, 'python')).toThrow(SecurityError);
    });

    it('should reject file operations without checks', () => {
      const code = 'open("file.txt", "r")';
      expect(() => sanitizeCode(code, 'python')).toThrow(SecurityError);
    });
  });

  describe('C++', () => {
    it('should allow safe C++ code', () => {
      const code = `
#include <iostream>
int main() {
    std::cout << "Hello" << std::endl;
    return 0;
}
      `.trim();
      expect(() => sanitizeCode(code, 'cpp')).not.toThrow();
    });

    it('should reject dangerous includes', () => {
      const code = '#include <cstdlib>';
      expect(() => sanitizeCode(code, 'cpp')).toThrow(SecurityError);
    });

    it('should reject system calls', () => {
      const code = 'system("rm -rf /")';
      expect(() => sanitizeCode(code, 'cpp')).toThrow(SecurityError);
    });
  });
});
