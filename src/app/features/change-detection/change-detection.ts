import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoggingService } from '../../core/services/logging';

// --- 1. DEFAULT CHANGE DETECTION STRATEGY CHILD ---
@Component({
  selector: 'app-default-child',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  // Default change detection strategy
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <mat-card class="strategy-card default-style">
      <h3 class="strategy-title">Default Strategy</h3>
      <div class="card-metric">
        <span>Template Evaluation Count:</span>
        <strong class="count-glow">{{ checkRender() }}</strong>
      </div>
      <div class="card-metric">
        <span>Received Input Count:</span>
        <strong>{{ parentCount }}</strong>
      </div>
      <p class="desc-info">Re-evaluates every time ANY event occurs in the application.</p>
    </mat-card>
  `,
  styles: [`
    .strategy-card {
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      border-radius: 8px !important;
      margin-top: 12px;
      background: rgba(255, 255, 255, 0.02) !important;
    }
    .default-style {
      border-left: 4px solid #e91e63 !important;
    }
    .strategy-title {
      font-size: 14px;
      margin: 0 0 12px 0;
      color: #e91e63;
    }
    .card-metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12.5px;
    }
    .count-glow {
      color: #e91e63;
      font-size: 15px;
    }
    .desc-info {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.45);
      margin: 8px 0 0 0;
      line-height: 1.3;
    }
  `]
})
export class DefaultChildComponent {
  @Input() parentCount = 0;
  private checkCount = 0;

  // Increments on every CD cycle
  public checkRender(): number {
    this.checkCount++;
    return this.checkCount;
  }
}

// --- 2. ON-PUSH CHANGE DETECTION STRATEGY CHILD ---
@Component({
  selector: 'app-onpush-child',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  // OnPush change detection strategy
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="strategy-card onpush-style">
      <h3 class="strategy-title">OnPush Strategy</h3>
      <div class="card-metric">
        <span>Template Evaluation Count:</span>
        <strong class="count-glow">{{ checkRender() }}</strong>
      </div>
      <div class="card-metric">
        <span>Received Input Count:</span>
        <strong>{{ parentCount }}</strong>
      </div>
      <p class="desc-info">Only re-evaluates when Inputs change references or local events fire.</p>

      <div class="onpush-actions">
        <button mat-stroked-button color="accent" size="small" (click)="triggerLocalEvent()">
          Trigger Local Event
        </button>
        <button mat-stroked-button color="primary" size="small" (click)="forceChangeDetection()">
          CD markForCheck()
        </button>
      </div>
    </mat-card>
  `,
  styles: [`
    .strategy-card {
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      border-radius: 8px !important;
      margin-top: 12px;
      background: rgba(255, 255, 255, 0.02) !important;
    }
    .onpush-style {
      border-left: 4px solid #00bcd4 !important;
    }
    .strategy-title {
      font-size: 14px;
      margin: 0 0 12px 0;
      color: #00bcd4;
    }
    .card-metric {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12.5px;
    }
    .count-glow {
      color: #00bcd4;
      font-size: 15px;
    }
    .desc-info {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.45);
      margin: 8px 0 12px 0;
      line-height: 1.3;
    }
    .onpush-actions {
      display: flex;
      gap: 8px;
    }
    .onpush-actions button {
      font-size: 10px !important;
      height: 28px !important;
      line-height: 28px !important;
      padding: 0 8px !important;
    }
  `]
})
export class OnPushChildComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() parentCount = 0;
  private checkCount = 0;

  public checkRender(): number {
    this.checkCount++;
    return this.checkCount;
  }

  // Local clicks automatically mark this path as dirty, triggering render check
  public triggerLocalEvent(): void {
    // Local empty handler is enough to trigger CD under OnPush
  }

  // Manually tell Angular to check this view path
  public forceChangeDetection(): void {
    this.cdr.markForCheck();
  }
}

// --- 3. MAIN AUDITOR PARENT COMPONENT ---
@Component({
  selector: 'app-change-detection',
  standalone: true,
  imports: [CommonModule, DefaultChildComponent, OnPushChildComponent, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './change-detection.html',
  styleUrl: './change-detection.css',
})
export class ChangeDetectionComponent {
  private readonly logger = inject(LoggingService);

  // States passed to children
  public boundCounter = signal(0);

  // Parent internal state (not passed as input to children)
  public parentOnlyCounter = signal(0);

  constructor() {
    this.logger.info('ChangeDetection Auditor initialized.', 'ChangeDetection');
  }

  public incrementBoundInput(): void {
    this.boundCounter.update((c) => c + 1);
    this.logger.debug(`Incremented Input Bound Counter: ${this.boundCounter()}`, 'ChangeDetection');
  }

  public incrementParentOnlyState(): void {
    this.parentOnlyCounter.update((c) => c + 1);
    this.logger.debug(`Incremented Parent Internal Counter: ${this.parentOnlyCounter()}`, 'ChangeDetection');
  }

  // Empty handler that triggers change detection at application level
  public triggerCDCycle(): void {
    // Standard handler execution forces CD check
    this.logger.debug('Fired empty event handler. Re-running Change Detection.', 'ChangeDetection');
  }
}
