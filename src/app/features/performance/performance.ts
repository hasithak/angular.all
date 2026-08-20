import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PureComputePipe } from '../../shared/pipes/memoize';
import { LoggingService } from '../../core/services/logging';

interface ProfileItem {
  id: number;
  name: string;
  randVal: number;
}

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    PureComputePipe,
  ],
  templateUrl: './performance.html',
  styleUrl: './performance.css',
})
export class PerformanceComponent implements OnInit {
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  // 1. Large dataset for Virtual Scrolling
  public readonly largeItemsList = signal<Array<{ id: number; label: string; value: number }>>([]);

  // 2. States for TrackBy profiling
  public trackByList = signal<ProfileItem[]>([]);
  public trackByExecutionCount = signal(0);
  public trackByProfilerStatus = signal<'inactive' | 'without' | 'with'>('inactive');

  // 3. States for Pure Pipe vs Template Method check
  public readonly memoizationNumbers = signal<number[]>([17, 23, 100, 113, 150]);
  public templateMethodCallCount = signal(0);

  constructor() {
    this.logger.info('Performance Showcase component initialized.', 'PerformanceLab');
  }

  public ngOnInit(): void {
    // Generate 10,000 items for virtual scroll
    const items = Array.from({ length: 10000 }).map((_, i) => ({
      id: i,
      label: `Performance Metric #${i}`,
      value: Math.floor(Math.random() * 1000) + 1,
    }));
    this.largeItemsList.set(items);

    this.initTrackByItems();
  }

  private initTrackByItems(): void {
    this.trackByList.set([
      { id: 1, name: 'Core Framework Bootstrap', randVal: 45 },
      { id: 2, name: 'Route Map compilation', randVal: 72 },
      { id: 3, name: 'Signal graph calculations', randVal: 19 },
    ]);
  }

  // --- 1. TRACK BY PROFILING ---
  public trackByIdentity(index: number, item: ProfileItem): number {
    return item.id;
  }

  public refreshListWithoutTrackBy(): void {
    this.trackByProfilerStatus.set('without');
    this.trackByExecutionCount.update((c) => c + 1);

    // Re-create items array with completely new object references (but same contents)
    this.trackByList.set([
      { id: 1, name: 'Core Framework Bootstrap', randVal: 45 },
      { id: 2, name: 'Route Map compilation', randVal: 72 },
      { id: 3, name: 'Signal graph calculations', randVal: 19 },
    ]);

    this.logger.debug('Recreated list without trackBy. Angular will recreate DOM nodes.', 'PerformanceLab');
    this.snackBar.open('List updated! (DOM nodes re-evaluated)', 'Dismiss', { duration: 1500 });
  }

  public refreshListWithTrackBy(): void {
    this.trackByProfilerStatus.set('with');
    this.trackByExecutionCount.update((c) => c + 1);

    // Recreate array but since trackBy maps ID, DOM matches and won't trigger redraws
    this.trackByList.set([
      { id: 1, name: 'Core Framework Bootstrap', randVal: 45 },
      { id: 2, name: 'Route Map compilation', randVal: 72 },
      { id: 3, name: 'Signal graph calculations', randVal: 19 },
    ]);

    this.logger.debug('Recreated list with trackBy. DOM matching prevents redraws.', 'PerformanceLab');
    this.snackBar.open('List updated! (DOM matches trackBy: No DOM churn)', 'Dismiss', { duration: 1500 });
  }

  // --- 2. TEMPLATE METHOD VS PURE PIPE ---
  // Heavy computation executed directly in the HTML template. Bad practice!
  public heavyTemplateMethodCompute(value: number): string {
    // Increment evaluation count (trigger updates without infinite loops using macro/setTimeout or micro check bypass)
    // To safely increment without expressionChangedAfterItHasBeenCheckedError, we run it in micro-task
    Promise.resolve().then(() => {
      this.templateMethodCallCount.update((c) => c + 1);
    });

    const result = this.isPrimeCheck(value);
    return `Prime: ${result ? 'YES' : 'NO'}`;
  }

  private isPrimeCheck(num: number): boolean {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }

  public triggerParentCD(): void {
    // Simply executing this click handler forces CD to run.
    // Notice that templateMethodCallCount will increase immediately, while the Pure Pipe stays silent!
    this.logger.info('Change detection cycle run. Auditing computations.', 'PerformanceLab');
  }
}
