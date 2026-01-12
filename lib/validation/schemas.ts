import { z } from 'zod';

export const codeExecutionRequestSchema = z.object({
  code: z.string().min(1).max(100000, 'Code is too long'),
  language: z.enum(['python', 'cpp']),
  action: z.enum(['run', 'compile', 'compile-and-run']).optional(),
});

export const sourceIdSchema = z.string().regex(/^[a-z0-9-]+$/, 'Invalid source ID format');

export const lessonIdSchema = z.string().regex(/^[a-z0-9-]+$/, 'Invalid lesson ID format');

export type CodeExecutionRequestInput = z.infer<typeof codeExecutionRequestSchema>;
export type SourceIdInput = z.infer<typeof sourceIdSchema>;
export type LessonIdInput = z.infer<typeof lessonIdSchema>;
