import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError, from, switchMap, of } from "rxjs";
import { UserStateService } from "../../states/userState.service";
import { ToastService } from "../toast.service";

// Flag to prevent multiple simultaneous logout operations
let isLoggingOut = false;

/**
 * Extract error message from API response
 * @param errorBody The error body (already parsed if it was a blob)
 * @returns Extracted error message or null
 */
function extractErrorMessage(errorBody: any): string | null {
  if (typeof errorBody === 'string') {
    return errorBody;
  }

  if (typeof errorBody === 'object' && errorBody !== null) {
    if (errorBody.message) return errorBody.message;
    if (errorBody.detail) return errorBody.detail;
    if (errorBody.title) return errorBody.title;

    if (errorBody.errors) {
      const errors = errorBody.errors;
      // Join all error messages with a newline or comma
      return Object.keys(errors)
        .map(key => {
          const errorVal = errors[key];
          return Array.isArray(errorVal) ? errorVal.join(', ') : errorVal;
        })
        .join('. ');
    }
  }

  return null;
}

export const ErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userStateService = inject(UserStateService);
  const toastService = inject(ToastService);

  const handleError = (error: HttpErrorResponse, parsedErrorBody: any = null) => {
    let errorMessage = '';
    let errorTitle = 'Error';

    const errorBody = parsedErrorBody || error.error;
    const apiMessage = extractErrorMessage(errorBody);

    // Handle 401 Unauthorized
    if (error.status === 401) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        userStateService.clearUser();
        toastService.showError('Sesión Expirada', 'Por favor, inicie sesión nuevamente');
        router.navigate(['/login']).then(() => {
          isLoggingOut = false;
        });
      }
      errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
      return throwError(() => error);
    }

    switch (error.status) {
      case 400:
        errorTitle = 'Solicitud Inválida';
        errorMessage = apiMessage || 'Los datos enviados son inválidos';
        break;
      case 403:
        errorTitle = 'Acceso Denegado';
        errorMessage = apiMessage || 'No tiene permisos para realizar esta acción';
        break;
      case 404:
        errorTitle = 'No Encontrado';
        errorMessage = apiMessage || 'El recurso solicitado no existe';
        break;
      case 500:
        errorTitle = 'Error del Servidor';
        errorMessage = apiMessage || 'Ocurrió un error en el servidor. Por favor, intente nuevamente';
        break;
      case 0:
        errorTitle = 'Error de Conexión';
        errorMessage = 'No se puede conectar con el servidor. Verifique su conexión a internet';
        break;
      default:
        errorTitle = `Error(${error.status})`;
        errorMessage = apiMessage || 'Ocurrió un error inesperado';
        break;
    }

    toastService.showError(errorTitle, errorMessage);

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      title: errorTitle,
      originalError: error
    }));
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error instanceof Blob && error.error.type === 'application/json') {
        return from(error.error.text()).pipe(
          switchMap(jsonText => {
            let body;
            try {
              body = JSON.parse(jsonText);
            } catch {
              body = jsonText;
            }
            return handleError(error, body);
          }),
          catchError(() => handleError(error)) // Fallback if parsing fails
        );
      }
      return handleError(error);
    })
  );
}

