import { Component, ComponentRef, ElementRef, OnInit, OnDestroy, ViewChild, ViewContainerRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoggingService } from '../../core/services/logging';

// ==========================================
// Sub-components to be loaded dynamically
// ==========================================

@Component({
  selector: 'app-info-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="widget-card widget-info">
      <div class="widget-header">
        <mat-icon>info</mat-icon>
        <h3>System Diagnostics</h3>
      </div>
      <p>Node status: <strong>Online</strong></p>
      <p>Latency: <strong class="latency-val">42ms</strong></p>
      <p class="tag">Rendered Dynamically</p>
    </div>
  `,
  styles: [`
    .widget-card {
      padding: 16px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 150, 243, 0.03) 100%);
      border: 1px solid rgba(33, 150, 243, 0.3);
    }
    .widget-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: #2196f3;
    }
    .widget-header h3 { margin: 0; font-size: 15px; }
    p { margin: 4px 0; font-size: 13px; color: rgba(255,255,255,0.7); }
    .latency-val { color: #81c784; }
    .tag { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 10px; text-transform: uppercase; }
  `]
})
export class InfoWidgetComponent {}

@Component({
  selector: 'app-alert-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="widget-card widget-alert">
      <div class="widget-header">
        <mat-icon>warning</mat-icon>
        <h3>Critical Alerts</h3>
      </div>
      <p>Memory Usage: <strong>87% (High)</strong></p>
      <p class="warning-text">Database sync delayed by 5m</p>
      <div style="margin-top: 10px; display: flex; gap: 8px;">
        <button mat-flat-button color="warn" class="small-btn" (click)="triggerAlertAck()">Acknowledge</button>
      </div>
    </div>
  `,
  styles: [`
    .widget-card {
      padding: 16px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(244, 67, 54, 0.03) 100%);
      border: 1px solid rgba(244, 67, 54, 0.3);
    }
    .widget-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: #f44336;
    }
    .widget-header h3 { margin: 0; font-size: 15px; }
    p { margin: 4px 0; font-size: 13px; color: rgba(255,255,255,0.7); }
    .warning-text { color: #ffb74d; }
    .small-btn { font-size: 11px; height: 28px; line-height: 28px; padding: 0 12px; }
  `]
})
export class AlertWidgetComponent {
  public onAck = signal<boolean>(false);
  public triggerAlertAck(): void {
    this.onAck.set(true);
  }
}

// ==========================================
// Main Host Component
// ==========================================

@Component({
  selector: 'app-dynamic-comp',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    InfoWidgetComponent,
    AlertWidgetComponent
  ],
  templateUrl: './dynamic-comp.html',
  styleUrl: './dynamic-comp.css',
})
export class DynamicCompComponent implements OnInit, OnDestroy {
  private readonly logger = inject(LoggingService);

  // TemplateOutlet reference widget type
  public activeTemplateOutletWidget = signal<any>(null);

  // ViewChild dynamic insertion target for programmatic container
  @ViewChild('programmaticContainer', { read: ViewContainerRef, static: true })
  private programmaticContainerRef!: ViewContainerRef;

  // Track the reference of programmatically created component
  private createdComponentRef: ComponentRef<any> | null = null;
  public isProgrammaticCreated = signal(false);
  public alertAcknowledgeState = signal('Unacknowledged');

  public ngOnInit(): void {
    this.logger.info('Dynamic Component component initialized.', 'DynamicComponents');
  }

  public ngOnDestroy(): void {
    this.cleanupProgrammaticComponent();
  }

  // Showcase 1: ngComponentOutlet toggle
  public setTemplateOutletWidget(type: 'info' | 'alert' | 'none'): void {
    this.logger.info(`Setting dynamic component via ngComponentOutlet to: ${type}`, 'DynamicComponents');
    if (type === 'info') {
      this.activeTemplateOutletWidget.set(InfoWidgetComponent);
    } else if (type === 'alert') {
      this.activeTemplateOutletWidget.set(AlertWidgetComponent);
    } else {
      this.activeTemplateOutletWidget.set(null);
    }
  }

  // Showcase 2: Programmatic createComponent
  public mountProgrammaticAlertWidget(): void {
    this.cleanupProgrammaticComponent();

    this.logger.info('Creating alert widget programmatically using ViewContainerRef...', 'DynamicComponents');
    
    // Create the component instance
    this.createdComponentRef = this.programmaticContainerRef.createComponent(AlertWidgetComponent);
    this.isProgrammaticCreated.set(true);
    this.alertAcknowledgeState.set('Waiting for action...');

    // Subscribe to events / read states of programmatic component instance
    const instance = this.createdComponentRef.instance as AlertWidgetComponent;
    
    // Listen to changes in the component state
    // For reactive signals in dynamically created components:
    const effectRef = this.createdComponentRef.injector.get(ViewContainerRef);
    
    // Simulate events by reading custom emitter inside the child
    const intervalId = setInterval(() => {
      if (this.createdComponentRef) {
        const currentAck = this.createdComponentRef.instance.onAck();
        if (currentAck) {
          this.alertAcknowledgeState.set('Acknowledged ✅');
          this.logger.info('Programmatic alert acknowledged by user event.', 'DynamicComponents');
          clearInterval(intervalId);
        }
      } else {
        clearInterval(intervalId);
      }
    }, 100);
  }

  public cleanupProgrammaticComponent(): void {
    if (this.createdComponentRef) {
      this.logger.info('Destroying dynamic component instance to clear memory.', 'DynamicComponents');
      this.programmaticContainerRef.clear();
      this.createdComponentRef = null;
      this.isProgrammaticCreated.set(false);
      this.alertAcknowledgeState.set('Unacknowledged');
    }
  }
}
