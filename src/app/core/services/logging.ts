import { Injectable, Inject, Optional } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LOGGER_CONFIG, LoggerConfig } from '../tokens';

export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private readonly logsSubject = new BehaviorSubject<LogEntry[]>([]);
  public readonly logs$ = this.logsSubject.asObservable();

  private prefix = '[APP]';
  private minLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  constructor(@Optional() @Inject(LOGGER_CONFIG) private config: LoggerConfig | null) {
    if (config) {
      this.prefix = config.prefix;
      this.minLevel = config.logLevel;
    }
    this.info('LoggingService initialized.', 'Core');
  }

  public debug(message: string, context?: string): void {
    this.log('debug', message, context);
  }

  public info(message: string, context?: string): void {
    this.log('info', message, context);
  }

  public warn(message: string, context?: string): void {
    this.log('warn', message, context);
  }

  public error(message: string, context?: string): void {
    this.log('error', message, context);
  }

  public clearLogs(): void {
    this.logsSubject.next([]);
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, context?: string): void {
    if (this.shouldLog(level)) {
      const entry: LogEntry = {
        timestamp: new Date(),
        level,
        message,
        context,
      };

      // Output to standard console
      const formattedMessage = `${this.prefix}${context ? `[${context}]` : ''} [${level.toUpperCase()}] ${message}`;
      switch (level) {
        case 'debug':
          console.debug(formattedMessage);
          break;
        case 'info':
          console.info(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'error':
          console.error(formattedMessage);
          break;
      }

      // Add to reactive log history stream
      const currentLogs = this.logsSubject.getValue();
      this.logsSubject.next([...currentLogs, entry].slice(-100)); // limit to last 100 logs
    }
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }
}
