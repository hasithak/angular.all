import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoggingService } from '../../core/services/logging';

@Component({
  selector: 'app-routing-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './routing-detail.html',
  styleUrl: './routing-detail.css',
})
export class RoutingDetailComponent implements OnInit {
  private readonly logger = inject(LoggingService);

  // 1. Path param (e.g. dynamic segment 'detail/:id' resolves to 'id' property)
  @Input() id!: string;

  // 2. Query parameters (e.g. ?category=signals maps to 'category' property)
  @Input() category?: string;
  @Input() source?: string;

  // 3. Resolver binding (e.g. route resolver data maps to 'resolverData' property)
  @Input() resolverData?: { resolvedTime: string; resolvedData: string };

  constructor() {}

  public ngOnInit(): void {
    this.logger.info(
      `RoutingDetailComponent loaded for item ID: ${this.id} | Category: ${this.category || 'None'} | Source: ${this.source || 'None'}`,
      'RoutingLab'
    );
  }
}
