import { Component, Inject, ErrorHandler, signal, inject, Self, SkipSelf, Host, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { APP_CONFIG, API_URL, LOGGER_CONFIG, AppConfig, LoggerConfig } from '../../core/tokens';
import { LoggingService } from '../../core/services/logging';
import { ConfigService } from '../../core/services/config';
import { GlobalErrorHandler } from '../../core/errors/global-error-handler';

// ==========================================
// Scoped Feature Services & Sub-components
// ==========================================

export class ScopedValueService {
  constructor(public value: string) {}
}

@Component({
  selector: 'app-di-grandchild',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="di-node grandchild-node">
      <div class="node-title">Grandchild Component</div>
      <ul class="resolution-list">
        <li>Default Injection (nearest parent): <code class="value-text">{{ defaultVal }}</code></li>
        <li>&#64;Self() &#64;Optional() (only grandchild): <code class="value-text">{{ selfVal }}</code></li>
        <li>&#64;SkipSelf() (skip grandchild & child, starts at parent): <code class="value-text">{{ skipSelfVal }}</code></li>
        <li>&#64;Optional() (graceful fallback if missing): <code class="value-text">{{ optionalVal }}</code></li>
      </ul>
    </div>
  `,
  styles: [`
    .grandchild-node {
      border: 1px solid rgba(233, 30, 99, 0.3);
      background: rgba(233, 30, 99, 0.03);
      padding: 12px;
      border-radius: 6px;
      margin-top: 12px;
    }
    .node-title { font-weight: bold; font-size: 12px; margin-bottom: 8px; color: #ff4081; }
    .resolution-list { margin: 0; padding-left: 20px; font-size: 12px; color: rgba(255,255,255,0.7); }
    .resolution-list li { margin-bottom: 6px; }
  `]
})
export class DiGrandchildComponent {
  public defaultVal = 'Not Injected';
  public selfVal = 'Not Injected';
  public skipSelfVal = 'Not Injected';
  public optionalVal = 'Not Injected';

  constructor(
    // 1. Default lookup goes from Grandchild -> Child -> Parent -> Root
    @Optional() private defaultService: ScopedValueService,

    // 2. @Self() restricts lookup only to this element's injector
    @Self() @Optional() private selfService: ScopedValueService,

    // 3. @SkipSelf() starts search from parent element injector
    @SkipSelf() @Optional() private skipSelfService: ScopedValueService,

    // 4. @Optional() resolves to null instead of throwing an error
    @Optional() private optionalService: ScopedValueService
  ) {
    this.defaultVal = this.defaultService ? this.defaultService.value : 'Null';
    this.selfVal = this.selfService ? this.selfService.value : 'Null (Grandchild has no provider)';
    this.skipSelfVal = this.skipSelfService ? this.skipSelfService.value : 'Null';
    this.optionalVal = this.optionalService ? this.optionalService.value : 'Null';
  }
}

@Component({
  selector: 'app-di-child',
  standalone: true,
  imports: [CommonModule, DiGrandchildComponent],
  // Provide unique instance of ScopedValueService with different value
  providers: [
    { provide: ScopedValueService, useValue: new ScopedValueService('Child Level Service') }
  ],
  template: `
    <div class="di-node child-node">
      <div class="node-title">Child Component (Provides: "Child Level Service")</div>
      <app-di-grandchild></app-di-grandchild>
    </div>
  `,
  styles: [`
    .child-node {
      border: 1px solid rgba(33, 150, 243, 0.3);
      background: rgba(33, 150, 243, 0.03);
      padding: 12px;
      border-radius: 6px;
      margin-top: 12px;
    }
    .node-title { font-weight: bold; font-size: 12px; color: #2196f3; }
  `]
})
export class DiChildComponent {}

@Component({
  selector: 'app-di-parent',
  standalone: true,
  imports: [CommonModule, DiChildComponent],
  // Provide unique instance of ScopedValueService
  providers: [
    { provide: ScopedValueService, useValue: new ScopedValueService('Parent Level Service') }
  ],
  template: `
    <div class="di-node parent-node">
      <div class="node-title">Parent Component (Provides: "Parent Level Service")</div>
      <app-di-child></app-di-child>
    </div>
  `,
  styles: [`
    .parent-node {
      border: 1px solid rgba(76, 175, 80, 0.3);
      background: rgba(76, 175, 80, 0.03);
      padding: 16px;
      border-radius: 8px;
    }
    .node-title { font-weight: bold; font-size: 13px; color: #81c784; }
  `]
})
export class DiParentComponent {}

// ==========================================
// Scoped Feature Service (Original)
// ==========================================

class ScopedFeatureService {
  public readonly instanceId = Math.floor(Math.random() * 10000);
  
  constructor() {
    console.log(`[DI Lab] ScopedFeatureService instance created with ID: ${this.instanceId}`);
  }

  public getIdentifier(): string {
    return `Scoped-Instance-#${this.instanceId}`;
  }
}

// ==========================================
// Main DI Host Component
// ==========================================

@Component({
  selector: 'app-di',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDividerModule, 
    MatSnackBarModule,
    DiParentComponent
  ],
  templateUrl: './di.html',
  styleUrl: './di.css',
  providers: [ScopedFeatureService],
})
export class DIComponent {
  private readonly snackBar = inject(MatSnackBar);

  public readonly isGlobalErrorHandlerActive = signal(false);

  constructor(
    public readonly loggingService: LoggingService,
    public readonly configService: ConfigService,

    @Inject(API_URL) public readonly apiUrl: string,
    @Inject(APP_CONFIG) public readonly appConfig: AppConfig,
    @Inject(LOGGER_CONFIG) public readonly loggerConfig: LoggerConfig,
    private readonly errorHandler: ErrorHandler,
    private readonly scopedService: ScopedFeatureService
  ) {
    this.loggingService.info('DI showcase component initialized.', 'DI_Lab');
    this.isGlobalErrorHandlerActive.set(this.errorHandler instanceof GlobalErrorHandler);
  }

  public getScopedServiceId(): string {
    return this.scopedService.getIdentifier();
  }

  public triggerConsoleLogAlert(): void {
    this.loggingService.debug('This is a simulated debug message logged to our reactive logs list.', 'DI_Lab');
    this.snackBar.open('Sent debug message to logger stream!', 'Dismiss', { duration: 2000 });
  }
}
