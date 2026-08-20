import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../tokens';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(@Inject(APP_CONFIG) private readonly appConfig: AppConfig) {}

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.appConfig[key];
  }

  public getAllConfig(): AppConfig {
    return { ...this.appConfig };
  }
}
