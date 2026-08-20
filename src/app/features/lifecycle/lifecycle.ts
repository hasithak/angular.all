import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LifecycleChildComponent } from './lifecycle-child';
import { LoggingService } from '../../core/services/logging';

interface LifecycleLogItem {
  order: number;
  hookName: string;
  details: string;
  timestamp: Date;
}

@Component({
  selector: 'app-lifecycle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    LifecycleChildComponent,
  ],
  templateUrl: './lifecycle.html',
  styleUrl: './lifecycle.css',
})
export class LifecycleComponent {
  private readonly logger = inject(LoggingService);

  // States to pass down
  public isChildMounted = signal(true);
  public textValue = signal('Alpha');
  public numericValue = signal(10);

  // Accumulate hook reports
  public readonly lifecycleLogs = signal<LifecycleLogItem[]>([]);
  private hookCounter = 0;

  constructor() {
    this.logger.info('Lifecycle Showcase Component initialized.', 'LifecycleLab');
  }

  public handleHookFired(event: { hook: string; details?: string }): void {
    this.hookCounter++;
    const logItem: LifecycleLogItem = {
      order: this.hookCounter,
      hookName: event.hook,
      details: event.details || '',
      timestamp: new Date(),
    };

    // Prepend to logs
    this.lifecycleLogs.update((logs) => [logItem, ...logs].slice(0, 50));
    
    // Log to standard developer output
    this.logger.debug(`Lifecycle Log #${this.hookCounter}: ${event.hook} - ${event.details}`, 'LifecycleLab');
  }

  public incrementInputs(): void {
    this.numericValue.update((c) => c + 5);
    this.textValue.set(`State Delta ${this.numericValue()}`);
  }

  // Forces a change detection run by modifying nothing but triggering an event handler
  public triggerCheckRun(): void {
    // Empty trigger - click handlers force change detection cycle execution
    this.logger.info('Change detection triggered manually (button press). Check DoCheck hooks.', 'LifecycleLab');
  }

  public clearLogs(): void {
    this.lifecycleLogs.set([]);
    this.hookCounter = 0;
  }
}
