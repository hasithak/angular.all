import { TestBed } from '@angular/core/testing';
import { LoggingService, LogEntry } from './logging';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingService]
    });
    service = TestBed.inject(LoggingService);
    // Clear initial bootup logs to ensure a clean state for every test
    service.clearLogs();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an empty log history', () => {
    let currentLogs: LogEntry[] = [];
    service.logs$.subscribe(logs => currentLogs = logs).unsubscribe();
    expect(currentLogs).toEqual([]);
  });

  it('should append info logs correctly to the history stream', () => {
    service.info('Test Info Message', 'TestContext');
    
    let currentLogs: LogEntry[] = [];
    service.logs$.subscribe(logs => currentLogs = logs).unsubscribe();

    expect(currentLogs.length).toBe(1);
    expect(currentLogs[0].message).toBe('Test Info Message');
    expect(currentLogs[0].context).toBe('TestContext');
    expect(currentLogs[0].level).toBe('info');
  });

  it('should append error logs correctly', () => {
    service.error('Error occurred', 'ErrorContext');

    let currentLogs: LogEntry[] = [];
    service.logs$.subscribe(logs => currentLogs = logs).unsubscribe();

    expect(currentLogs.length).toBe(1);
    expect(currentLogs[0].message).toBe('Error occurred');
    expect(currentLogs[0].level).toBe('error');
  });

  it('should cap log history at 100 items', () => {
    for (let i = 0; i < 150; i++) {
      service.info(`Message ${i}`);
    }
    
    let currentLogs: LogEntry[] = [];
    service.logs$.subscribe(logs => currentLogs = logs).unsubscribe();

    expect(currentLogs.length).toBe(100);
    // The latest log should be at the end of the array
    expect(currentLogs[99].message).toBe('Message 149');
  });
});
