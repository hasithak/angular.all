import { ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { APP_CONFIG, API_URL, LOGGER_CONFIG, AppConfig, LoggerConfig } from './core/tokens';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { loggingInterceptor } from './core/interceptors/logging';
import { errorInterceptor } from './core/interceptors/error';

// 1. AppConfig definition for Value Provider
const appConfigValue: AppConfig = {
  appName: 'Angular Feature Showcase',
  apiVersion: 'v1.0.0',
  environment: 'development',
  enableLogging: true,
  maxHttpRetries: 3,
};

// 2. Factory function for LoggerConfig to demonstrate Factory Providers
export function loggerConfigFactory(config: AppConfig): LoggerConfig {
  return {
    prefix: `[${config.appName.toUpperCase()}]`,
    logLevel: config.environment === 'production' ? 'warn' : 'debug',
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Router support with component input binding enabled (useful for route params as Inputs)
    provideRouter(routes, withComponentInputBinding()),
    
    // HTTP Client with functional interceptor registration
    provideHttpClient(
      withInterceptors([loggingInterceptor, errorInterceptor])
    ),
    
    // Animations for Angular Material
    provideAnimations(),

    // DI: Value Provider for AppConfig
    { provide: APP_CONFIG, useValue: appConfigValue },

    // DI: Value Provider for API Base URL
    { provide: API_URL, useValue: 'https://api.mockbin.com/v1' },

    // DI: Factory Provider for LoggerConfig, resolving dependancies dynamically
    {
      provide: LOGGER_CONFIG,
      useFactory: loggerConfigFactory,
      deps: [APP_CONFIG],
    },

    // DI: Class Provider for Global Error Handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
