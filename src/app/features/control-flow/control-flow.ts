import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { LoggingService } from '../../core/services/logging';

interface Task {
  id: number;
  title: string;
  status: 'Pending' | 'Completed';
}

@Component({
  selector: 'app-control-flow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatListModule
  ],
  templateUrl: './control-flow.html',
  styleUrl: './control-flow.css',
})
export class ControlFlowComponent {
  private readonly logger = inject(LoggingService);

  // @if demo states
  public isPanelVisible = signal(true);

  // @for / @empty demo states
  public tasks = signal<Task[]>([
    { id: 1, title: 'Learn Angular Standalone Architecture', status: 'Completed' },
    { id: 2, title: 'Master Angular Signals reactive tree', status: 'Pending' },
    { id: 3, title: 'Explore modern @if/@for Control Flow', status: 'Pending' },
  ]);
  private nextTaskId = 4;

  // @switch demo states
  public currentTheme = signal('neon-pink');

  constructor() {
    this.logger.info('Control Flow component initialized.', 'ControlFlow');
  }

  public togglePanel(): void {
    this.isPanelVisible.update(v => !v);
    this.logger.info(`Toggled panel visibility to: ${this.isPanelVisible()}`, 'ControlFlow');
  }

  public addTask(): void {
    const newTask: Task = {
      id: this.nextTaskId++,
      title: `Feature Showcase Task #${this.nextTaskId - 1}`,
      status: 'Pending'
    };
    this.tasks.update(t => [...t, newTask]);
    this.logger.info(`Added task. Count: ${this.tasks().length}`, 'ControlFlow');
  }

  public removeTask(id: number): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
    this.logger.info(`Removed task with ID: ${id}. Count: ${this.tasks().length}`, 'ControlFlow');
  }

  public clearTasks(): void {
    this.tasks.set([]);
    this.logger.info('Cleared all tasks to trigger @empty control block.', 'ControlFlow');
  }

  public resetTasks(): void {
    this.tasks.set([
      { id: 1, title: 'Learn Angular Standalone Architecture', status: 'Completed' },
      { id: 2, title: 'Master Angular Signals reactive tree', status: 'Pending' },
      { id: 3, title: 'Explore modern @if/@for Control Flow', status: 'Pending' },
    ]);
    this.logger.info('Reset tasks list.', 'ControlFlow');
  }
}
