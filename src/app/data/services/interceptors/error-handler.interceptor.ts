import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { UserStateService } from "../../states/userState.service";
import { ToastService } from "../toast.service";

// Flag to prevent multiple simultaneous logout operations
let isLoggingOut = false;

/**
 * Extract error message from API response
 * @param error The HTTP error response
 * @returns Extracted error message or null
 */
function extractApiErrorMessage(error: HttpErrorResponse): string | null {
  return error.error?.title || error.error?.detail || error.error?.message || null;
}

export const ErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userStateService = inject(UserStateService);
  const toastService = inject(ToastService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      let errorTitle = 'Error';
      
      // Handle 401 Unauthorized - logout and redirect to login
      if (error.status === 401) {
        // Prevent multiple simultaneous logout operations
        if (!isLoggingOut) {
          isLoggingOut = true;
          
          // Clear user session
          userStateService.clearUser();
          
          // Show toast notification
          toastService.showError('Sesión Expirada', 'Por favor, inicie sesión nuevamente');
          
          // Redirect to login page
          router.navigate(['/login']).then(() => {
            // Reset flag after navigation completes
            isLoggingOut = false;
          });
        }
        
        errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
      } else if (error.status === 403) {
        // Forbidden
        errorTitle = 'Acceso Denegado';
        errorMessage = 'No tiene permisos para realizar esta acción';
        toastService.showError(errorTitle, errorMessage);
      } else if (error.status === 404) {
        // Not Found
        errorTitle = 'No Encontrado';
        errorMessage = 'El recurso solicitado no existe';
        toastService.showError(errorTitle, errorMessage);
      } else if (error.status === 400) {
        // Bad Request
        errorTitle = 'Solicitud Inválida';
        errorMessage = extractApiErrorMessage(error) || 'Los datos enviados son inválidos';
        toastService.showError(errorTitle, errorMessage);
      } else if (error.status === 500) {
        // Internal Server Error
        errorTitle = 'Error del Servidor';
        errorMessage = 'Ocurrió un error en el servidor. Por favor, intente nuevamente';
        toastService.showError(errorTitle, errorMessage);
      } else if (error.status === 0) {
        // Network error or CORS issue
        errorTitle = 'Error de Conexión';
        errorMessage = 'No se puede conectar con el servidor. Verifique su conexión a internet';
        toastService.showError(errorTitle, errorMessage);
      } else if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorTitle = 'Error del Cliente';
        errorMessage = error.error.message || 'Ocurrió un error inesperado';
        toastService.showError(errorTitle, errorMessage);
      } else {
        // Other server-side errors
        errorTitle = 'Error';
        errorMessage = extractApiErrorMessage(error) || `Error del servidor (${error.status})`;
        toastService.showError(errorTitle, errorMessage);
      }
      
      // Return the error for components that want to handle it specifically
      return throwError(() => ({ 
        status: error.status, 
        message: errorMessage,
        title: errorTitle,
        originalError: error 
      }));
    })
  );
}
