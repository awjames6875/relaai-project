/**
 * Error Type Definitions
 * 
 * Standardized error formats for consistent error handling
 */

// ==================== BASE ERROR TYPES ====================

export interface ApiError {
    error: string;
    message: string;
    code: string;
    details?: Record<string, any>;
    timestamp: string;
  }
  
  export interface ValidationError {
    error: 'validation_failed';
    message: string;
    code: 'VALIDATION_400';
    details: {
      fields: Record<string, string>;
    };
    timestamp: string;
  }
  
  export interface AuthenticationError {
    error: 'unauthorized' | 'invalid_credentials' | 'token_expired';
    message: string;
    code: 'AUTH_401';
    timestamp: string;
  }
  
  export interface AuthorizationError {
    error: 'forbidden' | 'insufficient_permissions';
    message: string;
    code: 'AUTH_403';
    timestamp: string;
  }
  
  export interface NotFoundError {
    error: 'not_found';
    message: string;
    code: 'NOT_FOUND_404';
    details?: {
      resource: string;
      id: string;
    };
    timestamp: string;
  }
  
  export interface ConflictError {
    error: 'conflict' | 'already_exists' | 'duplicate_entry';
    message: string;
    code: 'CONFLICT_409';
    details?: {
      field: string;
      value: string;
    };
    timestamp: string;
  }
  
  export interface RateLimitError {
    error: 'rate_limit_exceeded';
    message: string;
    code: 'RATE_LIMIT_429';
    details: {
      limit: number;
      remaining: number;
      resetAt: string;
    };
    timestamp: string;
  }
  
  export interface ServerError {
    error: 'internal_server_error' | 'service_unavailable';
    message: string;
    code: 'SERVER_500' | 'SERVER_503';
    timestamp: string;
  }
  
  // ==================== SPECIFIC ERROR TYPES ====================
  
  export interface MessageGenerationError {
    error: 'generation_failed' | 'ai_service_error' | 'insufficient_context';
    message: string;
    code: 'MESSAGE_GEN_ERROR';
    details?: {
      contactId: string;
      occasion: string;
      reason: string;
    };
    timestamp: string;
  }
  
  export interface ContactImportError {
    error: 'import_failed';
    message: string;
    code: 'IMPORT_ERROR';
    details: {
      totalContacts: number;
      successfulImports: number;
      failedImports: number;
      errors: Array<{
        index: number;
        name: string;
        reason: string;
      }>;
    };
    timestamp: string;
  }
  
  export interface SubscriptionError {
    error: 'subscription_required' | 'limit_exceeded' | 'feature_unavailable';
    message: string;
    code: 'SUBSCRIPTION_ERROR';
    details: {
      currentTier: string;
      requiredTier: string;
      feature: string;
      limit?: number;
      current?: number;
    };
    timestamp: string;
  }
  
  // ==================== ERROR CODES ====================
  
  export enum ErrorCode {
    // Validation Errors (400)
    VALIDATION_FAILED = 'VALIDATION_400',
    INVALID_INPUT = 'INVALID_INPUT_400',
    MISSING_REQUIRED_FIELD = 'MISSING_FIELD_400',
  
    // Authentication Errors (401)
    UNAUTHORIZED = 'AUTH_401',
    INVALID_CREDENTIALS = 'INVALID_CREDS_401',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED_401',
    TOKEN_INVALID = 'TOKEN_INVALID_401',
  
    // Authorization Errors (403)
    FORBIDDEN = 'FORBIDDEN_403',
    INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMS_403',
  
    // Not Found Errors (404)
    NOT_FOUND = 'NOT_FOUND_404',
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND_404',
  
    // Conflict Errors (409)
    CONFLICT = 'CONFLICT_409',
    ALREADY_EXISTS = 'ALREADY_EXISTS_409',
    EMAIL_EXISTS = 'EMAIL_EXISTS_409',
    DUPLICATE_ENTRY = 'DUPLICATE_409',
  
    // Rate Limit Errors (429)
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_429',
  
    // Server Errors (500)
    INTERNAL_SERVER_ERROR = 'SERVER_500',
    SERVICE_UNAVAILABLE = 'SERVICE_503',
  
    // Custom Business Logic Errors
    MESSAGE_GENERATION_FAILED = 'MSG_GEN_FAILED',
    AI_SERVICE_ERROR = 'AI_SERVICE_ERROR',
    IMPORT_FAILED = 'IMPORT_FAILED',
    EXPORT_FAILED = 'EXPORT_FAILED',
    SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
    LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  }
  
  // ==================== ERROR FACTORY FUNCTIONS ====================
  
  export const createValidationError = (
    fields: Record<string, string>,
    message: string = 'Request validation failed'
  ): ValidationError => ({
    error: 'validation_failed',
    message,
    code: 'VALIDATION_400',
    details: { fields },
    timestamp: new Date().toISOString(),
  });
  
  export const createAuthenticationError = (
    type: 'unauthorized' | 'invalid_credentials' | 'token_expired',
    message?: string
  ): AuthenticationError => {
    const messages = {
      unauthorized: 'Authentication required',
      invalid_credentials: 'Invalid email or password',
      token_expired: 'Access token has expired',
    };
  
    return {
      error: type,
      message: message || messages[type],
      code: 'AUTH_401',
      timestamp: new Date().toISOString(),
    };
  };
  
  export const createNotFoundError = (
    resource: string,
    id?: string,
    message?: string
  ): NotFoundError => ({
    error: 'not_found',
    message: message || `${resource} not found`,
    code: 'NOT_FOUND_404',
    details: id ? { resource, id } : { resource, id: '' },
    timestamp: new Date().toISOString(),
  });
  
  export const createConflictError = (
    field: string,
    value: string,
    message?: string
  ): ConflictError => ({
    error: 'already_exists',
    message: message || `${field} already exists`,
    code: 'CONFLICT_409',
    details: { field, value },
    timestamp: new Date().toISOString(),
  });
  
  export const createRateLimitError = (
    limit: number,
    remaining: number,
    resetAt: string
  ): RateLimitError => ({
    error: 'rate_limit_exceeded',
    message: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_429',
    details: { limit, remaining, resetAt },
    timestamp: new Date().toISOString(),
  });
  
  export const createServerError = (
    message: string = 'Internal server error'
  ): ServerError => ({
    error: 'internal_server_error',
    message,
    code: 'SERVER_500',
    timestamp: new Date().toISOString(),
  });
  
  // ==================== ERROR HANDLER UTILITIES ====================
  
  export const isApiError = (error: unknown): error is ApiError => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      'message' in error &&
      'code' in error &&
      'timestamp' in error
    );
  };
  
  export const getErrorMessage = (error: unknown): string => {
    if (isApiError(error)) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  };
  
  export const getErrorCode = (error: unknown): string => {
    if (isApiError(error)) {
      return error.code;
    }
    return 'UNKNOWN_ERROR';
  };
  
  // ==================== HTTP STATUS CODES ====================
  
  export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
  }
  
  // ==================== ERROR RESPONSE TYPE ====================
  
  export type ErrorResponse =
    | ValidationError
    | AuthenticationError
    | AuthorizationError
    | NotFoundError
    | ConflictError
    | RateLimitError
    | ServerError
    | MessageGenerationError
    | ContactImportError
    | SubscriptionError;