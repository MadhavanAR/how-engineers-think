import { CodeExecutionRequest } from '@/types';
import { EXECUTION_CONFIG, SUPPORTED_LANGUAGES } from './constants';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateExecutionRequest(
  request: CodeExecutionRequest
): void {
  if (!request.code || typeof request.code !== 'string') {
    throw new ValidationError('Code is required and must be a string');
  }

  if (request.code.length > EXECUTION_CONFIG.MAX_CODE_LENGTH) {
    throw new ValidationError(
      `Code exceeds maximum length of ${EXECUTION_CONFIG.MAX_CODE_LENGTH} characters`
    );
  }

  if (!request.language || !SUPPORTED_LANGUAGES.includes(request.language)) {
    throw new ValidationError(
      `Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`
    );
  }
}
