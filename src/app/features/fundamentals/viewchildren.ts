import { Component, QueryList, ViewChildren, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FundamentalsChildComponent } from './fundamentals-child';
import { LoggingService } from '../../core/services/logging';

@Component({
  selector: 'app-viewchildren-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FundamentalsChildComponent
  ],
  templateUrl: './viewchildren.html',
  styleUrl: './fundamentals.css'
})
export class ViewChildrenDemoComponent {
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  // Counter array tracking how many instances to spawn
  public childTriggerCount = signal(2);

  // @ViewChildren query referencing all instances of FundamentalsChildComponent
  @ViewChildren(FundamentalsChildComponent) 
  public childList!: QueryList<FundamentalsChildComponent>;

  constructor() {
    this.logger.info('ViewChildren Lab initialized.', 'ViewChildrenLab');
  }

  // Demonstrate @ViewChildren by triggering state changes on all rendered children
  public resetAllChildren(): void {
    this.logger.info(`Resetting all ${this.childList.length} children via @ViewChildren query`, 'ViewChildrenLab');
    
    this.childList.forEach((child, index) => {
      child.resetChildState();
      this.logger.debug(`Reset child index ${index}`, 'ViewChildrenLab');
    });

    this.snackBar.open(`Reset all ${this.childList.length} child nodes via @ViewChildren!`, 'Dismiss', { 
      duration: 2500 
    });
  }

  public addChildNode(): void {
    if (this.childTriggerCount() < 4) {
      this.childTriggerCount.update(c => c + 1);
      this.logger.info(`Added new child instance. Spawns count: ${this.childTriggerCount()}`, 'ViewChildrenLab');
    } else {
      this.snackBar.open('Limit of 4 child nodes reached for demo.', 'Dismiss', { duration: 2000 });
    }
  }

  public removeChildNode(): void {
    if (this.childTriggerCount() > 1) {
      this.childTriggerCount.update(c => c - 1);
      this.logger.info(`Removed child instance. Spawns count: ${this.childTriggerCount()}`, 'ViewChildrenLab');
    } else {
      this.snackBar.open('Must have at least 1 child component.', 'Dismiss', { duration: 2000 });
    }
  }

  public handleChildAlert(msg: string, index: number): void {
    this.snackBar.open(`[Child #${index} Alert] ${msg}`, 'Dismiss', {
      duration: 3000,
    });
    this.logger.info(`ViewChildren: Child #${index} emitted alert: ${msg}`, 'ViewChildrenLab');
  }
}
