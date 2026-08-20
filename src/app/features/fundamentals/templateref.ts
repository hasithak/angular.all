import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggingService } from '../../core/services/logging';

@Component({
  selector: 'app-templateref-demo',
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
    MatRadioModule,
    MatDividerModule
  ],
  templateUrl: './templateref.html',
  styleUrl: './fundamentals.css'
})
export class TemplateRefDemoComponent {
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  // Reference the #templateInput element in the DOM
  @ViewChild('templateInput') 
  public inputElementRef!: ElementRef<HTMLInputElement>;

  // States for ngTemplateOutlet & context demonstration
  public selectedLayout = signal<'card' | 'list'>('card');
  public templateContext = {
    $implicit: 'Dynamic Context Header',
    description: 'This description is bound dynamically from the host component parent context.'
  };

  // States for Null-Safe navigation & Alias
  public activeUser = signal<{ name: string; profile?: { bio: string } } | null>({
    name: 'Jane Doe',
    profile: { bio: 'Principal software engineer specializing in web scale app interfaces.' }
  });

  constructor() {
    this.logger.info('TemplateRef Lab initialized.', 'TemplateRefLab');
  }

  // Demonstrate Template Reference Variable element access
  public focusInputElement(): void {
    if (this.inputElementRef) {
      this.inputElementRef.nativeElement.focus();
      this.snackBar.open('Focused input using ElementRef from @ViewChild(#templateInput)!', 'Dismiss', { 
        duration: 2000 
      });
      this.logger.info('Focused DOM element using @ViewChild reference.', 'TemplateRefLab');
    } else {
      this.snackBar.open('Element reference not found.', 'Dismiss', { duration: 2000 });
    }
  }

  public nullifyUser(): void {
    this.activeUser.set(null);
    this.logger.info('Nullified user object to demonstrate null-safety.', 'TemplateRefLab');
    this.snackBar.open('User object nullified!', 'Dismiss', { duration: 2000 });
  }

  public restoreUser(): void {
    this.activeUser.set({
      name: 'Jane Doe',
      profile: { bio: 'Principal software engineer specializing in web scale app interfaces.' }
    });
    this.logger.info('Restored user object.', 'TemplateRefLab');
    this.snackBar.open('User object restored!', 'Dismiss', { duration: 2000 });
  }
}
