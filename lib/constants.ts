export const EXECUTION_CONFIG = {
  TIMEOUT_MS: 10000, // 10 seconds
  MAX_OUTPUT_LENGTH: 10000,
  MAX_CODE_LENGTH: 50000,
} as const;

export const SUPPORTED_LANGUAGES = ['python', 'cpp'] as const;
