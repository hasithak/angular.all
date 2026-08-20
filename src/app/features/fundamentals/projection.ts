import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedCardComponent } from '../../shared/components/card';
import { LoggingService } from '../../core/services/logging';

@Component({
  selector: 'app-projection-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    SharedCardComponent
  ],
  templateUrl: './projection.html',
  styleUrl: './fundamentals.css'
})
export class ProjectionDemoComponent {
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.logger.info('Content Projection Lab initialized.', 'ProjectionLab');
  }

  public handleChildAlert(msg: string): void {
    this.snackBar.open(`[Projection Event] ${msg}`, 'Dismiss', {
      duration: 3000,
    });
    this.logger.info(`Projection: triggered action: ${msg}`, 'ProjectionLab');
  }
}
