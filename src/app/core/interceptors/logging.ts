import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, finalize } from 'rxjs/operators';
import { LoggingService } from '../services/logging';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);
  const startTime = Date.now();
  let status = 'pending';

  logger.info(`HTTP Request started: ${req.method} ${req.url}`, 'HttpLogger');

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          status = `SUCCEEDED (${event.status})`;
        }
      },
      error: (err) => {
        status = `FAILED (${err.status || err.message})`;
      },
    }),
    finalize(() => {
      const duration = Date.now() - startTime;
      logger.info(
        `HTTP Request completed: ${req.method} ${req.url} -> Status: ${status} in ${duration}ms`,
        'HttpLogger'
      );
    })
  );
};
