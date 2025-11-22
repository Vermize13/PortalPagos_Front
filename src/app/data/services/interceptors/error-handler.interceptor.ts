import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { UserStateService } from "../../states/userState.service";

export const ErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const userStateService = inject(UserStateService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      
      // Handle 401 Unauthorized - logout and redirect to login
      if (error.status === 401) {
        // Clear user session
        userStateService.clearUser();
        
        // Redirect to login page
        router.navigate(['/login']);
        
        errorMessage = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
      } else if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      
      return throwError(() => errorMessage);
    })
  );
}
