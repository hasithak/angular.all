import { Component, computed, signal, ErrorHandler, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { LoggingService } from './core/services/logging';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly logger = inject(LoggingService);
  private readonly errorHandler = inject(ErrorHandler) as GlobalErrorHandler;

  // Signal exposure of global error signal
  public readonly globalError = computed(() => GlobalErrorHandler.lastError());

  // List of items in the sidebar navigation
  public readonly navItems = signal<NavItem[]>([
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Parent-Child & ViewChild', route: '/fundamentals/parent-child', icon: 'swap_horiz' },
    { label: 'ViewChildren QueryList', route: '/fundamentals/viewchildren', icon: 'filter_none' },
    { label: 'Template Refs & DOM', route: '/fundamentals/templateref', icon: 'tag' },
    { label: 'Content Projection', route: '/fundamentals/projection', icon: 'vertical_align_center' },
    { label: 'Data Binding', route: '/databinding', icon: 'sync_alt' },
    { label: 'Directives & Pipes', route: '/directives-pipes', icon: 'filter_alt' },
    { label: 'Modern Control Flow', route: '/control-flow', icon: 'alt_route' },
    { label: 'Dependency Injection', route: '/di', icon: 'mediation' },
    { label: 'Routing Lab', route: '/routing-demo', icon: 'navigation' },
    { label: 'Forms Studio', route: '/forms-demo', icon: 'feed' },
    { label: 'HTTP Operations', route: '/http-demo', icon: 'cloud_sync' },
    { label: 'RxJS Streams', route: '/rxjs-demo', icon: 'waves' },
    { label: 'Reactive State', route: '/state-demo', icon: 'database' },
    { label: 'Lifecycle Hooks', route: '/lifecycle', icon: 'history_edu' },
    { label: 'Change Detection', route: '/change-detection', icon: 'radar' },
    { label: 'Signals Studio', route: '/signals-demo', icon: 'bolt' },
    { label: 'Performance Suite', route: '/performance', icon: 'trending_up' },
    { label: 'Dynamic Components', route: '/dynamic-components', icon: 'extension' },
    { label: 'Security Lab', route: '/security', icon: 'security' },
    { label: 'Animations Arena', route: '/animations', icon: 'animation' },
  ]);

  public dismissError(): void {
    this.errorHandler.clearError();
  }

  public triggerGlobalErrorDemo(): void {
    this.logger.warn('Simulating developer runtime error...', 'App');
    throw new Error('Simulation of an unexpected application runtime error!');
  }
}
