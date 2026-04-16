import { toast } from 'sonner';

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface AppErrorOptions {
  severity?: ErrorSeverity;
  context?: Record<string, any>;
  showToast?: boolean;
  silent?: boolean;
}

export class AppError extends Error {
  public severity: ErrorSeverity;
  public context: Record<string, any>;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.context = options.context || {};
    
    // Ensure the stack trace is captured correctly
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export const handleError = (error: unknown, options: AppErrorOptions = {}) => {
  const { 
    severity = ErrorSeverity.MEDIUM, 
    context = {}, 
    showToast = true, 
    silent = false 
  } = options;

  let message = 'An unexpected error occurred';
  let errorToLog = error;

  if (error instanceof AppError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  // Comprehensive logging
  if (!silent) {
    const logData = {
      timestamp: new Date().toISOString(),
      message,
      severity,
      context,
      stack: error instanceof Error ? error.stack : undefined,
      originalError: errorToLog,
    };

    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        console.error('[CRITICAL ERROR]', logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('[ERROR]', logData);
        break;
      default:
        console.log('[LOG]', logData);
    }
  }

  // User-facing feedback
  if (showToast) {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        toast.error(message, {
          description: 'Our technical team has been notified. Please try again later.',
          duration: 6000,
        });
        break;
      case ErrorSeverity.MEDIUM:
        toast.error(message);
        break;
      default:
        toast.info(message);
    }
  }

  return { message, severity, context };
};
