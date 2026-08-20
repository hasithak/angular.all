import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoggingService } from '../../core/services/logging';

@Component({
  selector: 'app-security-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './security-demo.html',
  styleUrl: './security-demo.css',
})
export class SecurityDemoComponent {
  private readonly logger = inject(LoggingService);
  private readonly sanitizer = inject(DomSanitizer);

  // Default malicious payload
  public rawInput = signal('<span style="color: #ff4081; font-weight: bold;">Danger Zone</span>\n<script>alert("Malicious Script Fired!")</script>\n<button onclick="alert(\'Inline JavaScript Clicked!\')" style="background: #f44336; border: none; padding: 4px 8px; color: #fff; border-radius: 4px; cursor: pointer;">Malicious Button</button>');

  // Default video URL for bypass testing
  public videoIdInput = signal('dQw4w9WgXcQ'); // Rick Astley YouTube video

  // SafeHtml translation computations
  public safeHtmlBypassed = computed<SafeHtml>(() => {
    this.logger.warn('Bypassing standard HTML sanitization via DomSanitizer!', 'SecurityLab');
    return this.sanitizer.bypassSecurityTrustHtml(this.rawInput());
  });

  // Dynamic iframe resource URL
  public videoUrlSanitized = computed<SafeResourceUrl>(() => {
    const rawUrl = `https://www.youtube.com/embed/${this.videoIdInput()}`;
    this.logger.info(`Bypassing Resource URL check for: ${rawUrl}`, 'SecurityLab');
    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  });

  constructor() {
    this.logger.info('Security & Sanitization component initialized.', 'SecurityLab');
  }

  public resetInput(): void {
    this.rawInput.set('<span style="color: #ff4081; font-weight: bold;">Danger Zone</span>\n<script>alert("Malicious Script Fired!")</script>\n<button onclick="alert(\'Inline JavaScript Clicked!\')" style="background: #f44336; border: none; padding: 4px 8px; color: #fff; border-radius: 4px; cursor: pointer;">Malicious Button</button>');
    this.logger.info('Reset malicious HTML inputs.', 'SecurityLab');
  }
}
