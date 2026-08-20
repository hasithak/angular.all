import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { App } from './app';
import { LoggingService } from './core/services/logging';
import { APP_CONFIG, API_URL, LOGGER_CONFIG } from './core/tokens';

describe('App', () => {
  let loggingServiceSpy: any;

  beforeEach(async () => {
    loggingServiceSpy = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      logs$: {
        subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() })
      }
    };

    await TestBed.configureTestingModule({
      imports: [App, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: LoggingService, useValue: loggingServiceSpy },
        { provide: API_URL, useValue: 'https://mock.api' },
        { provide: APP_CONFIG, useValue: { appName: 'Test App', production: false } },
        { provide: LOGGER_CONFIG, useValue: { minLevel: 'DEBUG' } }
      ]
    }).compileComponents();
  });

  it('should create the app shell successfully', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render side navigation shell', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-sidenav-container')).toBeTruthy();
  });
});
