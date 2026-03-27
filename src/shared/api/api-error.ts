export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    
    // Set the prototype explicitly for extending built-in Error in TS
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
