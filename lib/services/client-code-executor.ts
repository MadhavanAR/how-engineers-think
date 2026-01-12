/**
 * Client-Side Code Execution Service
 *
 * Executes Python and C++ code entirely in the browser using:
 * - Pyodide for Python execution
 * - WebAssembly for C++ compilation and execution
 */

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  compiled?: boolean;
}

// Lazy load Pyodide
let pyodidePromise: Promise<any> | null = null;
let stdoutBuffer = '';
let stderrBuffer = '';
let isLoadingPyodide = false;

/**
 * Check if Pyodide is currently loading
 */
export function isPyodideLoading(): boolean {
  return isLoadingPyodide;
}

/**
 * Initialize Pyodide for Python execution
 * Uses the official Pyodide loading method
 */
async function initPyodide(): Promise<any> {
  if (pyodidePromise) {
    return pyodidePromise;
  }

  pyodidePromise = (async () => {
    if (typeof window === 'undefined') {
      throw new Error('Pyodide can only be loaded in browser environment');
    }

    isLoadingPyodide = true;

    try {
      // Check if Pyodide is already loaded and initialized
      // @ts-ignore
      if (window.pyodide) {
        isLoadingPyodide = false;
        // @ts-ignore
        return window.pyodide;
      }

      // Check if loadPyodide is already available
      // @ts-ignore
      if (window.loadPyodide) {
        try {
          // @ts-ignore
          const { loadPyodide } = window;
          const pyodide = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
          });

          // Store globally for reuse
          // @ts-ignore
          window.pyodide = pyodide;

          // Set up stdout/stderr capture
          pyodide.setStdout({
            batched: (text: string) => {
              stdoutBuffer += text;
            },
          });
          pyodide.setStderr({
            batched: (text: string) => {
              stderrBuffer += text;
            },
          });

          isLoadingPyodide = false;
          return pyodide;
        } catch (error: any) {
          isLoadingPyodide = false;
          throw new Error(`Failed to initialize Pyodide: ${error.message || String(error)}`);
        }
      }

      // Load Pyodide using script tag (most reliable method)
      return new Promise((resolve, reject) => {
        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="pyodide"]');
        if (existingScript) {
          // Poll for loadPyodide to be available
          const checkInterval = setInterval(async () => {
            try {
              // @ts-ignore
              if (window.loadPyodide) {
                clearInterval(checkInterval);
                // @ts-ignore
                const { loadPyodide } = window;
                const pyodide = await loadPyodide({
                  indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
                });

                // @ts-ignore
                window.pyodide = pyodide;
                pyodide.setStdout({
                  batched: (text: string) => {
                    stdoutBuffer += text;
                  },
                });
                pyodide.setStderr({
                  batched: (text: string) => {
                    stderrBuffer += text;
                  },
                });

                resolve(pyodide);
              }
            } catch (error) {
              clearInterval(checkInterval);
              reject(error);
            }
          }, 100);

          // Timeout after 30 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            isLoadingPyodide = false;
            reject(new Error('Timeout waiting for Pyodide to load'));
          }, 30000);

          return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.type = 'text/javascript';
        script.async = true;
        script.crossOrigin = 'anonymous';

        script.onload = async () => {
          try {
            console.log('Pyodide script loaded, waiting for loadPyodide to be available...');

            // Wait for Pyodide to be fully available (with retries)
            let attempts = 0;
            const maxAttempts = 150; // 15 seconds total (Pyodide can take time to initialize)

            while (attempts < maxAttempts) {
              // Check multiple ways Pyodide might be exposed
              // @ts-ignore
              const loadPyodide = window.loadPyodide || (window as any).pyodide?.loadPyodide;

              if (loadPyodide) {
                try {
                  console.log('loadPyodide found, initializing Pyodide...');
                  const pyodide = await loadPyodide({
                    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
                  });

                  console.log('Pyodide initialized successfully');

                  // Store globally for reuse
                  // @ts-ignore
                  window.pyodide = pyodide;
                  pyodide.setStdout({
                    batched: (text: string) => {
                      stdoutBuffer += text;
                    },
                  });
                  pyodide.setStderr({
                    batched: (text: string) => {
                      stderrBuffer += text;
                    },
                  });

                  isLoadingPyodide = false;
                  resolve(pyodide);
                  return;
                } catch (loadError: any) {
                  console.error('Error initializing Pyodide:', loadError);
                  isLoadingPyodide = false;
                  reject(
                    new Error(
                      `Failed to initialize Pyodide: ${loadError.message || String(loadError)}`
                    )
                  );
                  return;
                }
              }

              // Log progress every 2 seconds
              if (attempts % 20 === 0 && attempts > 0) {
                console.log(`Still waiting for Pyodide... (${attempts * 0.1}s)`);
              }

              await new Promise(resolve => setTimeout(resolve, 100));
              attempts++;
            }

            console.error('loadPyodide not available after', maxAttempts * 0.1, 'seconds');
            isLoadingPyodide = false;
            reject(
              new Error(
                'loadPyodide function not available after loading script. The CDN may be blocked, or there may be a network issue. Please check your browser console for more details.'
              )
            );
          } catch (error: any) {
            console.error('Error in script.onload:', error);
            isLoadingPyodide = false;
            reject(new Error(`Failed to initialize Pyodide: ${error.message || String(error)}`));
          }
        };

        script.onerror = error => {
          console.error('Pyodide script load error:', error);
          console.error('Script src:', script.src);
          isLoadingPyodide = false;
          reject(
            new Error(
              'Failed to load Pyodide script from CDN. This may be due to:\n1. Network connectivity issues\n2. CORS restrictions\n3. CDN being blocked by firewall/ad-blocker\n4. Browser security settings\n\nPlease check your internet connection and browser console for details.'
            )
          );
        };

        // Add error handler for network errors
        script.addEventListener('error', event => {
          console.error('Script load event error:', event);
        });

        document.head.appendChild(script);
      });
    } catch (error: any) {
      isLoadingPyodide = false;
      throw error;
    }
  })();

  return pyodidePromise;
}

/**
 * Execute Python code using Pyodide
 */
export async function executePython(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    const pyodide = await initPyodide();

    // Clear previous output
    stdoutBuffer = '';
    stderrBuffer = '';

    // Execute code
    try {
      await pyodide.runPythonAsync(code);
      const executionTime = Math.round(performance.now() - startTime);

      return {
        success: true,
        output: stdoutBuffer || (stderrBuffer ? undefined : 'Code executed successfully'),
        error: stderrBuffer || undefined,
        executionTime,
      };
    } catch (error: any) {
      const executionTime = Math.round(performance.now() - startTime);
      return {
        success: false,
        error: error.message || String(error),
        executionTime,
      };
    }
  } catch (error: any) {
    const errorMessage = error.message || String(error);

    // Try fallback to backend API if available
    if (errorMessage.includes('Failed to load Pyodide') || errorMessage.includes('CDN')) {
      try {
        console.log('Pyodide failed to load, attempting fallback to backend API...');
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language: 'python' }),
        });

        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (apiError) {
        console.error('Backend API also failed:', apiError);
      }
    }

    // Provide helpful error message
    let userMessage = errorMessage;
    if (errorMessage.includes('Failed to load Pyodide') || errorMessage.includes('CDN')) {
      userMessage =
        'Unable to load Python runtime from CDN. This may be due to:\n\n• Network connectivity issues\n• Firewall or ad-blocker blocking the CDN\n• Browser security settings\n• CORS restrictions\n\nPlease check your internet connection and browser settings. Python execution requires loading ~10MB from the CDN on first use.';
    } else if (
      errorMessage.includes('loadPyodide not available') ||
      errorMessage.includes('Timeout')
    ) {
      userMessage =
        'Python runtime is taking longer than expected to load. Please wait a moment and try again. The first load can take 10-30 seconds.';
    }

    return {
      success: false,
      error: userMessage,
    };
  }
}

/**
 * Compile C++ code
 * Uses backend API for actual compilation
 */
export async function compileCpp(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    // Use backend API for actual compilation
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language: 'cpp',
        action: 'compile',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result: ExecutionResult = await response.json();
    const executionTime = Math.round(performance.now() - startTime);

    return {
      ...result,
      executionTime: result.executionTime || executionTime,
    };
  } catch (error: any) {
    const executionTime = Math.round(performance.now() - startTime);

    // Fallback to basic syntax checking if backend is unavailable
    const hasMain = code.includes('int main') || code.includes('void main');

    if (!hasMain) {
      return {
        success: false,
        error: 'C++ code must have a main() function',
        compiled: false,
        executionTime,
      };
    }

    const errorMessage = error.message || String(error);

    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return {
        success: false,
        error:
          'C++ compilation requires a backend service. The backend API is currently unavailable. Basic syntax check passed (has main function), but full compilation cannot be performed.',
        compiled: false,
        executionTime,
      };
    }

    return {
      success: false,
      error: errorMessage,
      compiled: false,
      executionTime,
    };
  }
}

/**
 * Execute C++ code
 * Falls back to backend API since full browser execution requires WASM compilation
 */
export async function executeCpp(code: string): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    // Try to use backend API as fallback (since full C++ execution in browser requires WASM)
    console.log('C++ execution: Attempting to use backend API...');

    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language: 'cpp',
        action: 'run',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result: ExecutionResult = await response.json();
    const executionTime = Math.round(performance.now() - startTime);

    return {
      ...result,
      executionTime: result.executionTime || executionTime,
    };
  } catch (error: any) {
    const executionTime = Math.round(performance.now() - startTime);

    // If backend is also unavailable, provide helpful message
    const errorMessage = error.message || String(error);

    if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
      return {
        success: false,
        error:
          'C++ execution requires a backend service. The backend API is currently unavailable. Please check your connection or use Python for browser-based execution.',
        executionTime,
      };
    }

    return {
      success: false,
      error: errorMessage,
      executionTime,
    };
  }
}

/**
 * Execute code based on language
 */
export async function executeCode(
  code: string,
  language: 'python' | 'cpp',
  action?: 'compile' | 'run'
): Promise<ExecutionResult> {
  if (language === 'python') {
    return executePython(code);
  }

  if (language === 'cpp') {
    if (action === 'compile') {
      return compileCpp(code);
    }
    return executeCpp(code);
  }

  return {
    success: false,
    error: `Unsupported language: ${language}`,
  };
}

/**
 * Check if Pyodide is available
 */
export function isPythonSupported(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if C++ execution is fully supported
 */
export function isCppFullySupported(): boolean {
  // C++ full execution requires WebAssembly compilation
  // For now, return false as we only support compilation checking
  return false;
}
