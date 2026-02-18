import { ErrorHandler, Injectable, Injector, isDevMode } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';

/**
 * Global Error Handler for uncaught Angular/TypeScript errors
 * Catches errors that are not handled by HTTP interceptors or component-level error handlers
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toastService: ToastService | null = null;

  constructor(private injector: Injector) { }

  handleError(error: Error | HttpErrorResponse): void {
    // Get ToastService using injector (cached after first call)
    if (!this.toastService) {
      this.toastService = this.injector.get(ToastService);
    }

    // Log the error to console for debugging
    console.error('Global error caught:', error);

    if (error instanceof HttpErrorResponse) {
      // HTTP errors are already handled by the interceptor
      console.warn('HTTP Error caught by Global Handler (already handled by interceptor):', error.message);
    } else {
      // Client-side or application error
      const errorMessage = error?.message || 'Ocurrió un error inesperado';

      // Show user-friendly error message
      this.toastService.showError('Error de Aplicación', 'Ocurrió un error inesperado. Por favor, recargue la página');

      // In development, show more detailed error info in console
      if (isDevMode()) {
        console.error('Detailed error:', {
          message: error.message,
          stack: error.stack,
          error: error
        });
      }
    }
  }
}
