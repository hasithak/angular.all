import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { LoggingService } from '../../core/services/logging';

interface MetricCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  description: string;
}

interface FeatureModule {
  name: string;
  route: string;
  description: string;
  icon: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatGridListModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private readonly logger = inject(LoggingService);

  public readonly metrics = signal<MetricCard[]>([
    {
      title: 'Angular Concepts',
      value: '50+',
      icon: 'psychology',
      color: '#3f51b5',
      description: 'Fundamentals, Directives, Pipes, Signals, DI',
    },
    {
      title: 'RxJS Operators',
      value: '16',
      icon: 'linear_scale',
      color: '#e91e63',
      description: 'Mapping, Combination, Timing, Multicasting',
    },
    {
      title: 'Form Validation',
      value: '5 Types',
      icon: 'assignment_turned_in',
      color: '#4caf50',
      description: 'Sync, Async, Nested, Dynamic, FormArray',
    },
    {
      title: 'Performance Optimization',
      value: '4 Patterns',
      icon: 'speed',
      color: '#ff9800',
      description: 'OnPush, trackBy, Virtual Scroll, Memoization',
    },
  ]);

  public readonly featureModules = signal<FeatureModule[]>([
    {
      name: 'Angular Fundamentals',
      route: '/fundamentals',
      description: 'Parent-child communication, @Input, @Output, Template Variables, Content Projection, and ViewChild/ViewChildren.',
      icon: 'extension',
      complexity: 'Beginner',
    },
    {
      name: 'Data Binding & Interactivity',
      route: '/databinding',
      description: 'Interpolation, Property Binding, Event Binding, and dynamic Two-Way data-binding examples.',
      icon: 'sync_alt',
      complexity: 'Beginner',
    },
    {
      name: 'Directives & Pipes Lab',
      route: '/directives-pipes',
      description: 'Standard built-in directives/pipes, alongside Custom Attribute, Structural Directives, and Custom Pipes.',
      icon: 'filter_alt',
      complexity: 'Intermediate',
    },
    {
      name: 'Dependency Injection Engine',
      route: '/di',
      description: 'Deep dive into DI providers: Class, Value, Factory, InjectionTokens, and providedIn scopes.',
      icon: 'mediation',
      complexity: 'Advanced',
    },
    {
      name: 'Enterprise Routing Lab',
      route: '/routing-demo',
      description: 'Lazy loading, child routing, path/query arguments, functional Route Guards, and Resolvers.',
      icon: 'navigation',
      complexity: 'Intermediate',
    },
    {
      name: 'Modern Forms Studio',
      route: '/forms-demo',
      description: 'Template Driven vs Reactive Forms. Nested groups, dynamic arrays, custom sync/async validators.',
      icon: 'feed',
      complexity: 'Advanced',
    },
    {
      name: 'HTTP Client Operations',
      route: '/http-demo',
      description: 'REST operations (GET, POST, PUT, DELETE) linked to loaders, retry strategies, and interceptor chains.',
      icon: 'cloud_sync',
      complexity: 'Intermediate',
    },
    {
      name: 'RxJS Streams Playground',
      route: '/rxjs-demo',
      description: 'Interactive marble track simulating flattening operators, combination streams, and debouncing.',
      icon: 'waves',
      complexity: 'Advanced',
    },
    {
      name: 'Reactive State & Store',
      route: '/state-demo',
      description: 'Store pattern simulation utilizing BehaviorSubject streams, state histories, and NgRx concepts.',
      icon: 'database',
      complexity: 'Advanced',
    },
    {
      name: 'Component Lifecycle Tracker',
      route: '/lifecycle',
      description: 'Real-time trace engine logging hook activations: OnInit, OnChanges, DoCheck, AfterContentInit/ViewInit.',
      icon: 'history_edu',
      complexity: 'Intermediate',
    },
    {
      name: 'Change Detection Auditor',
      route: '/change-detection',
      description: 'Direct performance benchmarks contrasting Default vs OnPush strategies and ChangeDetectorRef usage.',
      icon: 'radar',
      complexity: 'Advanced',
    },
    {
      name: 'Angular Signals Studio',
      route: '/signals-demo',
      description: 'Working with signal(), computed(), effect(), and comparing signal state management against RxJS.',
      icon: 'bolt',
      complexity: 'Beginner',
    },
    {
      name: 'Performance Suite',
      route: '/performance',
      description: 'Virtual scrolling lists (10k items), trackBy performance benchmark, and memoized pure pipes.',
      icon: 'trending_up',
      complexity: 'Advanced',
    },
    {
      name: 'Modern Control Flow',
      route: '/control-flow',
      description: 'Native template control syntax using @if, @for, @switch, and @empty blocks.',
      icon: 'alt_route',
      complexity: 'Beginner',
    },
    {
      name: 'Dynamic Components',
      route: '/dynamic-components',
      description: 'Instantiate and load components programmatically or declaratively using ngComponentOutlet.',
      icon: 'extension',
      complexity: 'Advanced',
    },
    {
      name: 'Security & Sanitization',
      route: '/security',
      description: 'Cross-Site Scripting (XSS) protections and safe resource URL overrides using DomSanitizer.',
      icon: 'security',
      complexity: 'Intermediate',
    },
    {
      name: 'Animations Arena',
      route: '/animations',
      description: 'Trigger-based component animations, state changes, transitions, and staggered lists.',
      icon: 'animation',
      complexity: 'Intermediate',
    },
  ]);

  public ngOnInit(): void {
    this.logger.info('Dashboard rendered successfully.', 'Dashboard');
  }
}
