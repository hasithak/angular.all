import { Component, ElementRef, ViewChild, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FundamentalsChildComponent } from './fundamentals-child';
import { LoggingService } from '../../core/services/logging';

@Component({
  selector: 'app-parent-child-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    FundamentalsChildComponent
  ],
  templateUrl: './parent-child.html',
  styleUrl: './fundamentals.css'
})
export class ParentChildDemoComponent {
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  // State bindings passed to Child
  public messageText = signal('Greetings from the Parent Component!');
  public latestChildCounter = signal(0);

  // @ViewChild query referencing the child component instance
  @ViewChild(FundamentalsChildComponent) 
  public primaryChild!: FundamentalsChildComponent;

  constructor() {
    this.logger.info('Parent-Child Lab initialized.', 'ParentChildLab');
  }

  public handleCounterChange(count: number): void {
    this.latestChildCounter.set(count);
    this.logger.info(`Parent-Child: received counter update: ${count}`, 'ParentChildLab');
  }

  public handleChildAlert(msg: string): void {
    this.snackBar.open(`[Parent Received Event] ${msg}`, 'Dismiss', {
      duration: 3000,
    });
    this.logger.info(`Parent-Child: child emitted alert: ${msg}`, 'ParentChildLab');
  }

  // Invoke a method directly on the ViewChild instance
  public resetChildCounters(): void {
    this.logger.info('Invoking method on @ViewChild instance...', 'ParentChildLab');
    if (this.primaryChild) {
      this.primaryChild.resetChildState();
      this.messageText.set('');
      this.latestChildCounter.set(0);
      this.snackBar.open('Primary child state reset via @ViewChild!', 'Dismiss', { duration: 2000 });
    } else {
      this.snackBar.open('ViewChild reference not bound yet.', 'Dismiss', { duration: 2000 });
    }
  }
}
