import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fundamentals-child',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card class="child-card">
      <mat-card-header>
        <mat-card-title class="child-title">
          <mat-icon>subdirectory_arrow_right</mat-icon> Child Component
        </mat-card-title>
      </mat-card-header>
      <mat-card-content class="child-content">
        <!-- 1. Demonstrating @Input data reception -->
        <div class="input-display">
          <strong>Received from Parent (@Input):</strong> 
          <span class="received-value">{{ parentMessage || 'No message yet' }}</span>
        </div>

        <div class="counter-display">
          <strong>Local State Counter:</strong> 
          <span class="counter-val">{{ counter() }}</span>
        </div>

        <!-- 2. Demonstrating @Output event broadcasting -->
        <div class="actions-row">
          <button mat-stroked-button color="primary" (click)="incrementCounter()">
            Increment & Notify Parent
          </button>
          <button mat-stroked-button color="warn" (click)="notifyReset()">
            Trigger Child Reset Alert
          </button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .child-card {
      background: rgba(255, 255, 255, 0.03) !important;
      border: 1px dashed rgba(63, 81, 181, 0.3) !important;
      border-radius: 8px !important;
      margin-top: 16px;
    }
    .child-title {
      font-size: 14px;
      font-weight: 500;
      color: #7986cb;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .child-content {
      padding: 12px 16px !important;
    }
    .input-display, .counter-display {
      margin-bottom: 12px;
      font-size: 13px;
    }
    .received-value {
      color: #00bcd4;
      font-weight: 500;
      margin-left: 6px;
    }
    .counter-val {
      color: #e91e63;
      font-weight: 700;
      margin-left: 6px;
      font-size: 15px;
    }
    .actions-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  `]
})
export class FundamentalsChildComponent {
  // 1. @Input: Receives data from Parent
  @Input() parentMessage = '';

  // 2. @Output: Event Emitter to notify Parent
  @Output() counterChange = new EventEmitter<number>();
  @Output() alertTriggered = new EventEmitter<string>();

  // Local counter state
  public counter = signal(0);

  public incrementCounter(): void {
    this.counter.update(c => c + 1);
    // Emit the new counter state to the parent
    this.counterChange.emit(this.counter());
  }

  // Method that will be invoked by Parent using @ViewChild
  public resetChildState(): void {
    this.counter.set(0);
  }

  public notifyReset(): void {
    this.resetChildState();
    this.alertTriggered.emit('Child component state was reset!');
  }
}
