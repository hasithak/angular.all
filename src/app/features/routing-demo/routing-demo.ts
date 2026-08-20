import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LoggingService } from '../../core/services/logging';

@Component({
  selector: 'app-routing-demo',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './routing-demo.html',
  styleUrl: './routing-demo.css',
})
export class RoutingDemoComponent implements OnInit {
  private readonly logger = inject(LoggingService);
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);

  // 1. Inputs matched directly to Route parameters/resolvers by withComponentInputBinding()
  @Input() resolverData?: { resolvedTime: string; resolvedData: string };

  // Local query parameters tracking (demonstrates traditional ActivatedRoute access as fallback comparison)
  public queryParamsDisplay = signal<string>('{}');

  public readonly sampleItems = signal([
    { id: '101', name: 'Angular Advanced Blueprint', category: 'architecture' },
    { id: '102', name: 'RxJS Streams Performance Lab', category: 'streams' },
    { id: '103', name: 'Angular Signals State Engine', category: 'signals' },
  ]);

  constructor() {
    this.logger.info('RoutingDemo component initialized.', 'RoutingLab');
  }

  public ngOnInit(): void {
    // Audit query parameters on load
    this.activeRoute.queryParams.subscribe((params) => {
      this.queryParamsDisplay.set(JSON.stringify(params, null, 2));
      this.logger.debug(`QueryParams updated: ${JSON.stringify(params)}`, 'RoutingLab');
    });
  }

  // Programmatic router navigation with parameters and query values
  public navigateProgrammatically(id: string, cat: string): void {
    this.logger.info(`Programmatic navigation to detail/${id} with category=${cat}`, 'RoutingLab');
    this.router.navigate(['/routing-demo', 'detail', id], {
      queryParams: { category: cat, refreshed: 'true' },
    });
  }
}
