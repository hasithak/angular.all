import { ErrorHandler, Injectable, Injector, signal } from '@angular/core';
import { LoggingService } from '../services/logging';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  // A signal to capture the last error, allowing components (like a toast or banner) to display it
  public static readonly lastError = signal<string | null>(null);

  constructor(private readonly injector: Injector) {}

  public handleError(error: any): void {
    // Resolve LoggingService dynamically to prevent circular dependency issues during bootstrap
    const logger = this.injector.get(LoggingService);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';

    logger.error(`Unhandled exception: ${errorMessage}\nStack: ${errorStack}`, 'GlobalErrorHandler');

    // Update the error signal so the UI can show a notification
    GlobalErrorHandler.lastError.set(`An unexpected error occurred: ${errorMessage}`);

    // Still log to default console for developers
    console.error('GlobalErrorHandler caught:', error);
  }

  public clearError(): void {
    GlobalErrorHandler.lastError.set(null);
  }
}
