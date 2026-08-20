import { InjectionToken } from '@angular/core';

export interface AppConfig {
  appName: string;
  apiVersion: string;
  environment: 'development' | 'production' | 'staging';
  enableLogging: boolean;
  maxHttpRetries: number;
}

// 1. InjectionToken for Application Configuration (Value Provider example)
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

// 2. InjectionToken for API Endpoint URL (Value Provider example)
export const API_URL = new InjectionToken<string>('API_URL');

// 3. InjectionToken for Logger Configuration (Factory Provider example)
export interface LoggerConfig {
  prefix: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('LOGGER_CONFIG');
