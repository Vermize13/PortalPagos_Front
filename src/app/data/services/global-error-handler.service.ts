import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';

/**
 * Global Error Handler for uncaught Angular/TypeScript errors
 * Catches errors that are not handled by HTTP interceptors or component-level error handlers
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    // Get ToastService using injector to avoid circular dependency issues
    const toastService = this.injector.get(ToastService);
    
    // Log the error to console for debugging
    console.error('Global error caught:', error);

    if (error instanceof HttpErrorResponse) {
      // HTTP errors are already handled by the interceptor
      // This is a fallback in case the interceptor didn't catch it
      if (!navigator.onLine) {
        toastService.showError('Sin Conexión', 'No hay conexión a internet');
      } else {
        toastService.showError('Error HTTP', 'Ocurrió un error de comunicación con el servidor');
      }
    } else {
      // Client-side or application error
      const errorMessage = error?.message || 'Ocurrió un error inesperado';
      
      // Show user-friendly error message
      toastService.showError('Error de Aplicación', 'Ocurrió un error inesperado. Por favor, recargue la página');
      
      // In development, you might want to show more detailed error info
      if (this.isDevelopmentMode()) {
        console.error('Detailed error:', {
          message: error.message,
          stack: error.stack,
          error: error
        });
      }
    }
  }

  private isDevelopmentMode(): boolean {
    // Check if running in development mode
    return !this.isProductionMode();
  }

  private isProductionMode(): boolean {
    // Simple check for production mode
    return typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  }
}
