import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoggingService } from '../../core/services/logging';

interface AnimationItem {
  id: number;
  label: string;
}

@Component({
  selector: 'app-animations-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './animations.html',
  styleUrl: './animations.css',
  animations: [
    // 1. Open/Close panel trigger
    trigger('openClose', [
      state('open', style({
        height: '140px',
        opacity: 1,
        backgroundColor: 'rgba(233, 30, 99, 0.15)',
        borderColor: 'rgba(233, 30, 99, 0.4)'
      })),
      state('closed', style({
        height: '60px',
        opacity: 0.7,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderColor: 'rgba(255, 255, 255, 0.05)'
      })),
      transition('open <=> closed', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),

    // 2. List Enter/Leave slide-in trigger
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-30px)' }),
          stagger('80ms', [
            animate('0.25s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('0.2s ease-in', style({ opacity: 0, transform: 'translateX(30px)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AnimationsDemoComponent {
  private readonly logger = inject(LoggingService);

  // Trigger 1 state
  public isCardOpen = signal(true);

  // Trigger 2 state
  public items = signal<AnimationItem[]>([
    { id: 1, label: 'Standard CSS Layout' },
    { id: 2, label: 'Transition Triggers' },
    { id: 3, label: 'Stagger Multi-List' }
  ]);
  private nextItemId = 4;

  constructor() {
    this.logger.info('Animations component initialized.', 'Animations');
  }

  public toggleCardState(): void {
    this.isCardOpen.update(o => !o);
    this.logger.info(`Toggled card animation state. Open: ${this.isCardOpen()}`, 'Animations');
  }

  public addItem(): void {
    const newItem = {
      id: this.nextItemId++,
      label: `Staggered Item #${this.nextItemId - 1}`
    };
    this.items.update(i => [...i, newItem]);
    this.logger.info(`Added item to anim list. Size: ${this.items().length}`, 'Animations');
  }

  public removeItem(id: number): void {
    this.items.update(items => items.filter(i => i.id !== id));
    this.logger.info(`Removed item from anim list. Size: ${this.items().length}`, 'Animations');
  }

  public resetItems(): void {
    this.items.set([
      { id: 1, label: 'Standard CSS Layout' },
      { id: 2, label: 'Transition Triggers' },
      { id: 3, label: 'Stagger Multi-List' }
    ]);
    this.logger.info('Reset animation list.', 'Animations');
  }
}
