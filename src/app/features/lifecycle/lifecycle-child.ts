import {
  Component,
  Input,
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lifecycle-child',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="child-card">
      <mat-card-header>
        <mat-card-title class="child-title">
          <mat-icon>hourglass_full</mat-icon> Child Component Under Audit
        </mat-card-title>
      </mat-card-header>
      <mat-card-content class="child-content">
        <p><strong>Injected Message:</strong> <span class="val">{{ textInput || '(None)' }}</span></p>
        <p><strong>Injected Index:</strong> <span class="val">{{ numericInput }}</span></p>
        <div class="active-badge">Active &amp; Hooking</div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .child-card {
      background: rgba(255, 255, 255, 0.02) !important;
      border: 1px dashed #e91e63 !important;
      border-radius: 8px !important;
      margin-top: 16px;
    }
    .child-title {
      font-size: 13.5px;
      font-weight: 500;
      color: #e91e63;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .child-content {
      padding: 12px 16px !important;
      font-size: 13px;
    }
    .child-content p {
      margin: 4px 0;
    }
    .val {
      color: #00bcd4;
      font-weight: 500;
    }
    .active-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      background: rgba(233, 30, 99, 0.15);
      color: #e91e63;
      padding: 2px 6px;
      border-radius: 4px;
      margin-top: 8px;
    }
  `]
})
export class LifecycleChildComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  @Input() textInput = '';
  @Input() numericInput = 0;

  @Output() hookFired = new EventEmitter<{ hook: string; details?: string }>();

  constructor() {
    this.reportHook('constructor', 'Instantiated child class instance.');
  }

  // --- LIFECYCLE HOOKS ---

  public ngOnChanges(changes: SimpleChanges): void {
    const changesSummary: string[] = [];
    for (const key in changes) {
      const prop = changes[key];
      changesSummary.push(`${key}: '${prop.previousValue}' -> '${prop.currentValue}'`);
    }
    this.reportHook('ngOnChanges', changesSummary.join(', '));
  }

  public ngOnInit(): void {
    this.reportHook('ngOnInit', 'Initialized component logic.');
  }

  public ngDoCheck(): void {
    this.reportHook('ngDoCheck', 'Checked for changes (runs frequently).');
  }

  public ngAfterContentInit(): void {
    this.reportHook('ngAfterContentInit', 'Projected content (ng-content) fully bound.');
  }

  public ngAfterContentChecked(): void {
    this.reportHook('ngAfterContentChecked', 'Projected content checked.');
  }

  public ngAfterViewInit(): void {
    this.reportHook('ngAfterViewInit', 'Component template (HTML view) fully initialized.');
  }

  public ngAfterViewChecked(): void {
    this.reportHook('ngAfterViewChecked', 'Component template checked.');
  }

  public ngOnDestroy(): void {
    this.reportHook('ngOnDestroy', 'Component unmounted and cleaned up.');
  }

  private reportHook(name: string, desc: string): void {
    // We emit to parent deferredly to avoid infinite change detection cycles
    setTimeout(() => {
      this.hookFired.emit({ hook: name, details: desc });
    });
  }
}
