import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { HighlightDirective } from '../../shared/directives/highlight';
import { UnlessDirective } from '../../shared/directives/unless';
import { TruncatePipe } from '../../shared/pipes/truncate';
import { SortPipe } from '../../shared/pipes/sort';
import { LoggingService } from '../../core/services/logging';

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  releaseDate: Date;
  description: string;
}

@Component({
  selector: 'app-directives-pipes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    HighlightDirective,
    UnlessDirective,
    TruncatePipe,
    SortPipe,
  ],
  templateUrl: './directives-pipes.html',
  styleUrl: './directives-pipes.css',
})
export class DirectivesPipesComponent implements OnInit {
  private readonly logger = inject(LoggingService);

  // States for Built-in Directives
  public showSection = signal(true);
  public userRole = signal('moderator'); // used for ngSwitch
  public isStyledActive = signal(false); // used for ngClass
  public fontSizePx = signal(14); // used for ngStyle
  public textColorCode = signal('#ffffff'); // used for ngStyle

  // States for Custom Directives
  public customHighlightColor = signal('rgba(233, 30, 99, 0.25)');
  public hideUnlessCondition = signal(false); // used for unlessDirective

  // States for Pipes
  public testValue = 'Angular architecture templates are highly scalable.';
  public sortByProperty = signal<keyof Product>('price');
  public sortOrderDirection = signal<'asc' | 'desc'>('asc');

  public readonly products = signal<Product[]>([
    {
      id: 101,
      name: 'Advanced Angular Architecture Course',
      price: 249.99,
      discount: 0.2,
      releaseDate: new Date('2026-01-15'),
      description: 'Master dependency injection, change detection, and complex routing patterns.',
    },
    {
      id: 102,
      name: 'RxJS Reactive Design Guide',
      price: 89.5,
      discount: 0.1,
      releaseDate: new Date('2025-11-20'),
      description: 'Stream operations, multicasting Subjects, and flattening flows explained simply.',
    },
    {
      id: 103,
      name: 'Signals State Handbook',
      price: 45.0,
      discount: 0.0,
      releaseDate: new Date('2026-03-01'),
      description: 'Modern signal reactive workflows compared directly to classic RxJS design patterns.',
    },
  ]);

  // Observable for Async Pipe demonstration
  public asyncTimeStream$!: Observable<Date>;

  public ngOnInit(): void {
    this.logger.info('DirectivesPipes component initialized.', 'DirectivesPipes');
    // Setup observable that emits every second for async pipe showcase
    this.asyncTimeStream$ = interval(1000).pipe(map(() => new Date()));
  }

  public toggleUnlessCondition(): void {
    this.hideUnlessCondition.update(c => !c);
  }
}
