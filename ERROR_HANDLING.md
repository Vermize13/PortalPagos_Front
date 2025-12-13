# Error Handling Strategy

## Overview

This document describes the comprehensive error handling strategy implemented in the Portal Pagos frontend application. The goal is to ensure all errors (API, network, and application errors) are properly caught and displayed to users through toast notifications.

## Architecture

### 1. HTTP Error Interceptor (`error-handler.interceptor.ts`)

The HTTP Error Interceptor automatically catches all HTTP errors from API calls and displays appropriate toast notifications:

#### Error Types Handled:

- **401 Unauthorized**: Automatically logs out the user and redirects to login
- **403 Forbidden**: Shows "Access Denied" message
- **404 Not Found**: Shows "Resource Not Found" message
- **400 Bad Request**: Extracts and shows API validation errors
- **500 Internal Server Error**: Shows generic server error message
- **0 Network Error**: Shows connection error message
- **Other Errors**: Shows generic error message with status code

#### Features:

- Automatically shows toast notifications for all HTTP errors
- Extracts error messages from API response when available
- Returns structured error object for component-level handling
- Prevents multiple simultaneous logout operations

### 2. Global Error Handler (`global-error-handler.service.ts`)

The Global Error Handler catches all uncaught Angular/TypeScript errors:

#### Features:

- Catches application errors not handled by HTTP interceptor
- Shows user-friendly error messages via toast
- Logs detailed error information to console for debugging
- Handles both HTTP and client-side errors
- Production/development mode aware

### 3. Toast Service (`toast.service.ts`)

Centralized service for displaying toast notifications:

#### Methods:

- `Success(summary, detail)`: Success notifications (green)
- `Error(summary, detail)`: Error notifications (red)
- `Warn(summary, detail)`: Warning notifications (yellow)
- `Info(summary, detail)`: Information notifications (blue)
- Synchronous convenience methods: `showSuccess`, `showError`, `showInfo`, `showWarn`

#### Configuration:

- Global toast key: `'global-toast'`
- Default lifetime: 3000ms (3 seconds)
- Position: Configured in component (default: top-right)

## Implementation Guidelines

### For New Components

When implementing new components with HTTP calls, follow these patterns:

#### Pattern 1: Rely on Interceptor (Recommended for simple cases)

```typescript
this.myService.getData().subscribe({
  next: (data) => {
    // Handle success
    this.processData(data);
  },
  error: (error) => {
    // Interceptor already showed toast
    // Only add handler if you need specific logic
    console.error('Error loading data:', error);
  }
});
```

#### Pattern 2: Custom Error Handling

```typescript
this.myService.saveData(payload).subscribe({
  next: (response) => {
    this.toastService.showSuccess('Success', 'Data saved successfully');
    this.router.navigate(['/list']);
  },
  error: (error) => {
    console.error('Save failed:', error);
    // Interceptor shows generic error
    // Add specific handling if needed
    if (error.status === 409) {
      this.toastService.showError('Conflict', 'This record already exists');
    }
  }
});
```

#### Pattern 3: Form Validation Errors

```typescript
onSubmit() {
  if (!this.form.valid) {
    this.toastService.showWarn('Invalid Form', 'Please fill all required fields');
    return;
  }
  
  this.service.submit(this.form.value).subscribe({
    next: () => {
      this.toastService.showSuccess('Success', 'Form submitted successfully');
    },
    error: (error) => {
      // Interceptor handles HTTP errors
      console.error('Submission error:', error);
    }
  });
}
```

### Best Practices

1. **Always Add Error Handlers**: Every `.subscribe()` should have an error handler, even if it just logs to console

2. **Reset Loading States**: Always reset loading/busy states in error handlers:
   ```typescript
   this.loading = true;
   this.service.getData().subscribe({
     next: (data) => {
       this.data = data;
       this.loading = false;
     },
     error: (error) => {
       console.error('Error:', error);
       this.loading = false; // Important!
     }
   });
   ```

3. **User-Friendly Messages**: The interceptor provides generic messages. Add specific messages for better UX:
   ```typescript
   error: (error) => {
     if (error.status === 404) {
       this.toastService.showError('Not Found', 'The project you are looking for does not exist');
     }
   }
   ```

4. **Don't Duplicate Toasts**: The interceptor already shows toasts for all HTTP errors. Only show additional toasts if you have specific business logic:
   ```typescript
   // ❌ Bad - duplicate toast
   error: (error) => {
     this.toastService.showError('Error', 'Failed to load'); // Already shown by interceptor
   }
   
   // ✅ Good - specific handling
   error: (error) => {
     if (this.isFirstLoad) {
       this.loadFallbackData(); // Custom logic
     }
   }
   ```

5. **Log Errors**: Always log errors to console for debugging:
   ```typescript
   error: (error) => {
     console.error('Error loading user:', error);
   }
   ```

## Testing Error Scenarios

### Manual Testing Checklist

- [ ] 401 Unauthorized - Expires token and verify auto-logout
- [ ] 403 Forbidden - Try accessing forbidden resource
- [ ] 404 Not Found - Request non-existent resource
- [ ] 400 Bad Request - Submit invalid form data
- [ ] 500 Server Error - Trigger server error
- [ ] Network Error - Disconnect internet and make request
- [ ] Client-Side Error - Trigger undefined variable access
- [ ] Form Validation - Submit incomplete form
- [ ] Concurrent Requests - Multiple errors at once

### Toast Verification

1. Toast should appear with appropriate color (red for errors, green for success, etc.)
2. Toast should display for 3 seconds by default
3. Toast position should be consistent (global-toast key)
4. Multiple toasts should stack properly
5. Error messages should be user-friendly in Spanish

## Configuration

### App Config (`app.config.ts`)

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideHttpClient(withInterceptors([JwtInterceptor, ErrorHandlerInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    MessageService // Required for PrimeNG Toast
  ]
};
```

### Global Toast Component (`app.component.html`)

```html
<router-outlet></router-outlet>
<p-toast key="global-toast"></p-toast>
```

## Migration Notes

### Existing Components

Most existing components already have error handlers. Key changes:

1. **Error Interceptor Enhancement**: Now automatically shows toasts for all HTTP errors
2. **Global Error Handler**: Catches previously uncaught errors
3. **Consistency**: All errors now displayed via toast notifications

### Components Updated

- `cambioPassword.component.ts` - Added error handler with toast notification
- All other components already had error handling in place

## Future Improvements

1. **Error Tracking**: Integrate with error tracking service (e.g., Sentry)
2. **Retry Logic**: Add automatic retry for transient failures
3. **Offline Support**: Better handling of offline scenarios
4. **Error Boundaries**: Implement Angular error boundaries for isolated failures
5. **Localization**: Full Spanish translation of all error messages
6. **Custom Error Pages**: Dedicated pages for common errors (404, 500)

## Summary

The error handling strategy ensures:

- ✅ All HTTP errors are caught and displayed to users
- ✅ Uncaught application errors are handled gracefully
- ✅ Consistent user experience across the application
- ✅ Proper cleanup and state management on errors
- ✅ Comprehensive error logging for debugging
- ✅ User-friendly error messages in Spanish
