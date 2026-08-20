import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, BehaviorSubject, ReplaySubject, Observable, Subscription, of, timer, combineLatest, forkJoin } from 'rxjs';
import { switchMap, mergeMap, concatMap, exhaustMap, delay, takeUntil, tap, debounceTime, distinctUntilChanged, finalize, catchError } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { LoggingService } from '../../core/services/logging';

interface StreamLog {
  timestamp: Date;
  source: string;
  value: string;
  type: 'info' | 'warn' | 'success' | 'danger';
}

@Component({
  selector: 'app-rxjs-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatDividerModule,
  ],
  templateUrl: './rxjs-demo.html',
  styleUrl: './rxjs-demo.css',
})
export class RxJSDemoComponent implements OnInit, OnDestroy {
  private readonly logger = inject(LoggingService);

  // cleanup notifier for takeUntil
  private readonly destroy$ = new Subject<void>();

  // RxJS Logs list
  public readonly streamLogs = signal<StreamLog[]>([]);

  // 1. Flattening map inputs
  private readonly mapTrigger$ = new Subject<number>();
  private mapClickCount = 0;

  // 2. Subjects demonstration fields
  public standardSubject = new Subject<string>();
  public behaviorSubject = new BehaviorSubject<string>('Initial Value');
  public replaySubject = new ReplaySubject<string>(3); // Buffers last 3 items

  // Subscription states for late observers
  public isSubscribedToStandard = signal(false);
  public isSubscribedToBehavior = signal(false);
  public isSubscribedToReplay = signal(false);

  private standardSub?: Subscription;
  private behaviorSub?: Subscription;
  private replaySub?: Subscription;

  // 3. Combination Streams inputs
  private readonly streamA$ = new Subject<string>();
  private readonly streamB$ = new Subject<string>();
  private valA = 'A0';
  private valB = 'B0';

  // 4. Debounce Demo input
  public readonly debounceInput$ = new Subject<string>();
  public debouncedOutput = signal('');

  public ngOnInit(): void {
    this.logger.info('RxJSDemo component initialized.', 'RxJSLab');
    this.initMapDemoStreams();
    this.initDebounceDemoStream();
    this.initCombinationStreams();
  }

  public ngOnDestroy(): void {
    this.logger.info('RxJSDemo component destroyed. Triggering cleanup...', 'RxJSLab');
    this.destroy$.next();
    this.destroy$.complete();

    // Unsubscribe late subscribers
    this.unsubscribeAllSubjects();
  }

  // --- LOGGING HELPER ---
  private addLog(source: string, value: string, type: 'info' | 'warn' | 'success' | 'danger' = 'info'): void {
    const log: StreamLog = { timestamp: new Date(), source, value, type };
    this.streamLogs.update((logs) => [log, ...logs].slice(0, 40));
  }

  public clearLogs(): void {
    this.streamLogs.set([]);
  }

  // --- 1. MAP OPERATORS (switchMap, mergeMap, concatMap, exhaustMap) ---
  private initMapDemoStreams(): void {
    // Helper function that mocks a 2.5-second HTTP call
    const simulatedHttpCall = (clickNum: number) => {
      return of(`Response for Click #${clickNum}`).pipe(
        delay(2500),
        catchError((err) => {
          this.addLog('Inner HTTP', 'Error occurred!', 'danger');
          return of('Fallback Value');
        }),
        finalize(() => {
          this.logger.debug(`Inner HTTP for #${clickNum} completed.`, 'RxJSLab');
        })
      );
    };

    // register switchMap
    this.mapTrigger$
      .pipe(
        takeUntil(this.destroy$),
        tap((n) => this.addLog('switchMap', `Click #${n} registered -> Fetching...`, 'info')),
        switchMap((n) => simulatedHttpCall(n))
      )
      .subscribe((res) => this.addLog('switchMap Output', `Resolved: ${res}`, 'success'));

    // register mergeMap
    this.mapTrigger$
      .pipe(
        takeUntil(this.destroy$),
        tap((n) => this.addLog('mergeMap', `Click #${n} registered -> Fetching...`, 'info')),
        mergeMap((n) => simulatedHttpCall(n))
      )
      .subscribe((res) => this.addLog('mergeMap Output', `Resolved: ${res}`, 'success'));

    // register concatMap
    this.mapTrigger$
      .pipe(
        takeUntil(this.destroy$),
        tap((n) => this.addLog('concatMap', `Click #${n} queued -> Fetching...`, 'info')),
        concatMap((n) => simulatedHttpCall(n))
      )
      .subscribe((res) => this.addLog('concatMap Output', `Resolved: ${res}`, 'success'));

    // register exhaustMap
    this.mapTrigger$
      .pipe(
        takeUntil(this.destroy$),
        tap((n) => this.addLog('exhaustMap', `Click #${n} received -> Evaluating...`, 'info')),
        exhaustMap((n) => simulatedHttpCall(n))
      )
      .subscribe((res) => this.addLog('exhaustMap Output', `Resolved: ${res}`, 'success'));
  }

  public triggerMapEvent(): void {
    this.mapClickCount++;
    this.addLog('Click Trigger', `Firing Click #${this.mapClickCount}`, 'warn');
    this.mapTrigger$.next(this.mapClickCount);
  }

  // --- 2. SUBJECT TYPES DEMONSTRATION ---
  public emitValueToSubjects(valInput: string): void {
    if (!valInput.trim()) return;
    this.addLog('Subjects Emission', `Emitting: "${valInput}"`, 'warn');
    
    this.standardSubject.next(valInput);
    this.behaviorSubject.next(valInput);
    this.replaySubject.next(valInput);
  }

  public toggleSubStandard(): void {
    if (this.isSubscribedToStandard()) {
      this.standardSub?.unsubscribe();
      this.isSubscribedToStandard.set(false);
      this.addLog('Standard Observer', 'Disconnected.', 'danger');
    } else {
      this.isSubscribedToStandard.set(true);
      this.addLog('Standard Observer', 'Connected. Waiting for new emissions...', 'info');
      this.standardSub = this.standardSubject.subscribe((v) =>
        this.addLog('Standard Observer', `Received: "${v}"`, 'success')
      );
    }
  }

  public toggleSubBehavior(): void {
    if (this.isSubscribedToBehavior()) {
      this.behaviorSub?.unsubscribe();
      this.isSubscribedToBehavior.set(false);
      this.addLog('Behavior Observer', 'Disconnected.', 'danger');
    } else {
      this.isSubscribedToBehavior.set(true);
      this.addLog('Behavior Observer', 'Connected. Subscribing...', 'info');
      this.behaviorSub = this.behaviorSubject.subscribe((v) =>
        this.addLog('Behavior Observer', `Received: "${v}"`, 'success')
      );
    }
  }

  public toggleSubReplay(): void {
    if (this.isSubscribedToReplay()) {
      this.replaySub?.unsubscribe();
      this.isSubscribedToReplay.set(false);
      this.addLog('Replay Observer', 'Disconnected.', 'danger');
    } else {
      this.isSubscribedToReplay.set(true);
      this.addLog('Replay Observer', 'Connected. Buffer pulling...', 'info');
      this.replaySub = this.replaySubject.subscribe((v) =>
        this.addLog('Replay Observer', `Received: "${v}"`, 'success')
      );
    }
  }

  private unsubscribeAllSubjects(): void {
    this.standardSub?.unsubscribe();
    this.behaviorSub?.unsubscribe();
    this.replaySub?.unsubscribe();
  }

  // --- 3. COMBINATION STREAMS ---
  private initCombinationStreams(): void {
    // combineLatest demonstration
    combineLatest([this.streamA$, this.streamB$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([a, b]) => this.addLog('combineLatest', `Emitted: A=${a}, B=${b}`, 'success'),
      });
  }

  public triggerStreamA(): void {
    this.valA = `A${Math.floor(Math.random() * 100)}`;
    this.addLog('Stream A', `Emitted: ${this.valA}`, 'info');
    this.streamA$.next(this.valA);
  }

  public triggerStreamB(): void {
    this.valB = `B${Math.floor(Math.random() * 100)}`;
    this.addLog('Stream B', `Emitted: ${this.valB}`, 'info');
    this.streamB$.next(this.valB);
  }

  // forkJoin: requires streams to complete! We simulate completion of static streams
  public executeForkJoin(): void {
    this.addLog('forkJoin', 'Requested. Executing parallel async streams (timer A, timer B)...', 'warn');

    // Mocks two distinct http requests running and completing
    const reqA = of('Response Payload A').pipe(delay(1500));
    const reqB = of('Response Payload B').pipe(delay(2200));

    forkJoin([reqA, reqB])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([resA, resB]) => {
          this.addLog('forkJoin Result', `All completed! A: "${resA}", B: "${resB}"`, 'success');
        },
      });
  }

  // --- 4. DEBOUNCE TIME & DISTINCT UNTIL CHANGED ---
  private initDebounceDemoStream(): void {
    this.debounceInput$
      .pipe(
        takeUntil(this.destroy$),
        // Debounce for 400ms
        debounceTime(400),
        // Filter out if value is same as previous emission
        distinctUntilChanged(),
        tap((v) => this.addLog('Debounced Input', `Resolved: "${v}"`, 'success'))
      )
      .subscribe((val) => {
        this.debouncedOutput.set(val);
      });
  }

  public handleDebounceInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.addLog('Typing Stream', `Key registered: "${value}"`, 'info');
    this.debounceInput$.next(value);
  }
}
