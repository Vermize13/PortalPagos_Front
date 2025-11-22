import { ApplicationConfig, importProvidersFrom, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app-routing.module';
import { ErrorHandlerInterceptor } from './data/services/interceptors/error-handler.interceptor';
import { JwtInterceptor } from './data/services/interceptors/jwt.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync('noop'),
    provideAnimations(),
    provideHttpClient(withInterceptors([JwtInterceptor, ErrorHandlerInterceptor])),
    importProvidersFrom([BrowserAnimationsModule]),
    MessageService,
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};
