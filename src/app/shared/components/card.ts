import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shared-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class SharedCardComponent {
  @Input() title = 'Card Title';
  @Input() subtitle?: string;
  @Input() showFooter = true;

  // Demonstrates targeting projected content templates using @ContentChild
  @ContentChild('customHeader') customHeaderTemplate?: TemplateRef<any>;
  @ContentChild('customFooter') customFooterTemplate?: TemplateRef<any>;
}
