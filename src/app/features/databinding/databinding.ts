import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { LoggingService } from '../../core/services/logging';

@Component({
  selector: 'app-databinding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatIconModule,
  ],
  templateUrl: './databinding.html',
  styleUrl: './databinding.css',
})
export class DataBindingComponent {
  private readonly logger = inject(LoggingService);

  // States for interpolation
  public currentTimestamp = new Date();
  public appName = 'Angular Showcase Lab';

  // States for Property Binding
  public isButtonDisabled = signal(false);
  public dynamicImageUrl = 'public/favicon.ico';
  public boxSize = signal(60); // size in pixels
  public colorPalette = signal('#3f51b5');

  // States for Event Binding
  public clickCount = signal(0);
  public lastMouseCoords = signal({ x: 0, y: 0 });

  // States for Two-way Binding
  public userName = signal('Developer');
  public userProfileTheme = signal('indigo');

  constructor() {
    this.logger.info('DataBinding component initialized.', 'DataBinding');
    // Refresh date time
    setInterval(() => {
      this.currentTimestamp = new Date();
    }, 1000);
  }

  // Event handler for button clicks
  public handleButtonClick(event: MouseEvent): void {
    this.clickCount.update(c => c + 1);
    this.logger.info(`Event Binding triggered. Click count: ${this.clickCount()}`, 'DataBinding');
  }

  // Event handler for mouse movements
  public handleMouseMove(event: MouseEvent): void {
    this.lastMouseCoords.set({ x: event.offsetX, y: event.offsetY });
  }

  public toggleButtonState(): void {
    this.isButtonDisabled.update(state => !state);
    this.logger.info(`Property binding toggled button state: disabled=${this.isButtonDisabled()}`, 'DataBinding');
  }

  public changeColor(color: string): void {
    this.colorPalette.set(color);
  }
}
