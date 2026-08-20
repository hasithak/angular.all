import { Component, signal, computed, effect, OnDestroy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggingService } from '../../core/services/logging';

interface SignalEffectLog {
  timestamp: Date;
  message: string;
}

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './signals-demo.html',
  styleUrl: './signals-demo.css',
})
export class SignalsDemoComponent implements OnInit, OnDestroy {
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  // --- 1. SIGNALS SANDBOX STATES ---
  public quantity = signal(1);
  public unitPrice = signal(25);

  // computed() Signal: Derived reactive state, auto-updates and caches!
  public totalCost = computed(() => this.quantity() * this.unitPrice());

  // computed() Signal returning boolean discount alert
  public isDiscountEligible = computed(() => this.totalCost() >= 100);

  // Array signal mutations
  public tags = signal<string[]>(['Angular', 'Signals', 'Reactivity']);
  public newTagText = '';

  // Effect event logger state
  public readonly effectLogs = signal<SignalEffectLog[]>([]);

  // --- 2. RxJS COMPARISON STATE ---
  private readonly rxDestroy$ = new Subject<void>();
  public rxQuantity$ = new BehaviorSubject<number>(1);
  public rxUnitPrice$ = new BehaviorSubject<number>(25);
  public rxTotalCost$ = combineLatest([this.rxQuantity$, this.rxUnitPrice$]).pipe(
    map(([q, u]) => q * u)
  );

  constructor() {
    this.logger.info('SignalsDemo component initialized.', 'SignalsLab');

    // 3. effect(): Runs side-effects reactively when tracked signals change
    effect(() => {
      const currentTotal = this.totalCost();
      const currentQty = this.quantity();
      const currentPrice = this.unitPrice();
      
      const logMsg = `[effect] Total cost updated: Qty(${currentQty}) * Price($${currentPrice}) = $${currentTotal}`;
      this.logEffectEvent(logMsg);
    });
  }

  public ngOnInit(): void {
    // Monitor RxJS Streams for side-by-side UI values comparison
    this.rxTotalCost$.pipe(takeUntil(this.rxDestroy$)).subscribe((tot) => {
      this.logger.debug(`[RxJS Sync] Total cost recalculated: $${tot}`, 'SignalsLab');
    });
  }

  public ngOnDestroy(): void {
    // Cleanup RxJS to prevent memory leaks. Signals clean up automatically!
    this.rxDestroy$.next();
    this.rxDestroy$.complete();
  }

  // --- ACTIONS ---
  public incrementQuantity(): void {
    this.quantity.update((q) => q + 1);
    this.rxQuantity$.next(this.rxQuantity$.getValue() + 1); // keep RxJS in sync
  }

  public decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
      this.rxQuantity$.next(this.rxQuantity$.getValue() - 1);
    }
  }

  public updatePrice(event: Event): void {
    const value = +(event.target as HTMLInputElement).value || 0;
    this.unitPrice.set(value);
    this.rxUnitPrice$.next(value);
  }

  // Array signals actions
  public addTagItem(): void {
    if (!this.newTagText.trim()) return;

    // Mutate state immutably: create a new array containing the new tag
    this.tags.update((current) => [...current, this.newTagText.trim()]);
    this.newTagText = '';
    this.snackBar.open('Updated tags list signal!', 'Dismiss', { duration: 1500 });
  }

  public removeTagItem(index: number): void {
    this.tags.update((current) => current.filter((_, i) => i !== index));
  }

  // Helper loggers
  private logEffectEvent(msg: string): void {
    const log: SignalEffectLog = { timestamp: new Date(), message: msg };
    this.effectLogs.update((current) => [log, ...current].slice(0, 10));
    this.logger.info(msg, 'SignalsLab');
  }

  public clearEffectLogs(): void {
    this.effectLogs.set([]);
  }
}
