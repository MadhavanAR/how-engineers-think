import { describe, it, expect } from 'vitest';
import { ApiResponse } from '@/lib/utils/api-response';

describe('ApiResponse', () => {
  it('should create success response', () => {
    const response = ApiResponse.success({ data: 'test' });
    expect(response.status).toBe(200);
  });

  it('should create error response', () => {
    const response = ApiResponse.error('Test error', 400);
    expect(response.status).toBe(400);
  });

  it('should create not found response', () => {
    const response = ApiResponse.notFound('Not found');
    expect(response.status).toBe(404);
  });

  it('should create bad request response', () => {
    const response = ApiResponse.badRequest('Bad request');
    expect(response.status).toBe(400);
  });

  it('should create internal error response', () => {
    const response = ApiResponse.internalError('Internal error');
    expect(response.status).toBe(500);
  });
});
