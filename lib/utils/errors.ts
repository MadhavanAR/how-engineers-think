export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class CodeExecutionError extends AppError {
  constructor(message: string) {
    super(message, 500, 'CODE_EXECUTION_ERROR');
  }
}

export class SecurityError extends AppError {
  constructor(message: string) {
    super(message, 400, 'SECURITY_ERROR');
  }
}
