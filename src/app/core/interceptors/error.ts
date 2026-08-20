import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggingService } from '../services/logging';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let clientErrorMessage = 'An error occurred during communication with the server.';

      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred
        clientErrorMessage = `Client-side error: ${error.error.message}`;
      } else {
        // The backend returned an unsuccessful response code
        clientErrorMessage = `Server returned code ${error.status}: ${error.error?.message || error.statusText}`;

        // Handle specific status codes
        if (error.status === 401) {
          logger.warn('HTTP 401 Unauthorized detected.', 'ErrorInterceptor');
        }
      }

      logger.error(`HTTP Error: ${clientErrorMessage} (URL: ${req.url})`, 'ErrorInterceptor');
      return throwError(() => new Error(clientErrorMessage));
    })
  );
};
