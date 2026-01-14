import { codeExecutionRequestSchema } from './validation/schemas';
import { ValidationError } from './utils/errors';

/**
 * Validate code execution request using Zod schema
 * @deprecated Use codeExecutionRequestSchema.parse() directly
 */
export function validateExecutionRequest(request: unknown): void {
  const result = codeExecutionRequestSchema.safeParse(request);

  if (!result.success) {
    const errors = result.error.issues.map(e => e.message).join(', ');
    throw new ValidationError(`Validation error: ${errors}`);
  }
}
