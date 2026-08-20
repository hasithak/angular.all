import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { retry, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { LoggingService } from '../../core/services/logging';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

@Component({
  selector: 'app-http-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './http-demo.html',
  styleUrl: './http-demo.css',
})
export class HttpDemoComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly apiBaseUrl = 'https://jsonplaceholder.typicode.com/todos';

  // State management signals
  public readonly todos = signal<Todo[]>([]);
  public readonly isLoading = signal(false);
  public readonly errorLog = signal<string | null>(null);

  // Todo input form state
  public newTodoTitle = '';

  constructor() {
    this.logger.info('HttpDemo component initialized.', 'HttpClientLab');
  }

  public ngOnInit(): void {
    this.fetchTodos();
  }

  // 1. GET Operation (Load list)
  public fetchTodos(): void {
    this.isLoading.set(true);
    this.errorLog.set(null);
    this.logger.info('HTTP GET: Fetching todos list...', 'HttpClientLab');

    this.http
      .get<Todo[]>(`${this.apiBaseUrl}?_limit=5`)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.todos.set(data);
          this.logger.info(`HTTP GET: Successfully loaded ${data.length} todos.`, 'HttpClientLab');
        },
        error: (err) => {
          this.errorLog.set(err.message);
          this.snackBar.open('Failed to load todos from API.', 'Dismiss');
        },
      });
  }

  // 2. POST Operation (Create item)
  public createTodo(): void {
    if (!this.newTodoTitle.trim()) {
      return;
    }

    this.isLoading.set(true);
    const mockNewTodo = {
      title: this.newTodoTitle,
      completed: false,
      userId: 1,
    };

    this.logger.info(`HTTP POST: Creating todo with title '${this.newTodoTitle}'`, 'HttpClientLab');

    this.http
      .post<Todo>(this.apiBaseUrl, mockNewTodo)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (createdItem) => {
          // JSONPlaceholder returns id=201 for additions. We map it and append to local array
          const localizedItem = { ...createdItem, id: Date.now() }; // avoid duplicate IDs in view loop
          this.todos.update((current) => [localizedItem, ...current]);
          this.newTodoTitle = '';
          this.snackBar.open('Todo item created successfully!', 'Dismiss', { duration: 2000 });
          this.logger.info(`HTTP POST Success: Created todo ID ${createdItem.id}`, 'HttpClientLab');
        },
        error: () => {
          this.snackBar.open('Create operation failed.', 'Dismiss');
        },
      });
  }

  // 3. PUT Operation (Toggle completeness status)
  public toggleTodoComplete(todo: Todo): void {
    this.isLoading.set(true);
    const updatedPayload = { ...todo, completed: !todo.completed };
    
    this.logger.info(`HTTP PUT: Updating todo ID ${todo.id}`, 'HttpClientLab');

    this.http
      .put<Todo>(`${this.apiBaseUrl}/${todo.id}`, updatedPayload)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (result) => {
          this.todos.update((current) =>
            current.map((item) => (item.id === todo.id ? { ...item, completed: result.completed } : item))
          );
          this.snackBar.open(`Todo marked as ${result.completed ? 'completed' : 'active'}!`, 'Dismiss', {
            duration: 2000,
          });
          this.logger.info(`HTTP PUT Success: Updated todo ID ${todo.id}`, 'HttpClientLab');
        },
        error: (err) => {
          // If server fails (like jsonplaceholder put for custom local items), update locally anyway for demo continuity
          this.todos.update((current) =>
            current.map((item) => (item.id === todo.id ? { ...item, completed: !item.completed } : item))
          );
          this.snackBar.open(`Todo updated locally (Mock server bypass).`, 'Dismiss', { duration: 2000 });
        },
      });
  }

  // 4. DELETE Operation
  public deleteTodo(id: number): void {
    this.isLoading.set(true);
    this.logger.info(`HTTP DELETE: Deleting todo ID ${id}`, 'HttpClientLab');

    this.http
      .delete(`${this.apiBaseUrl}/${id}`)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.todos.update((current) => current.filter((item) => item.id !== id));
          this.snackBar.open('Todo deleted successfully!', 'Dismiss', { duration: 2000 });
          this.logger.info(`HTTP DELETE Success: Removed todo ID ${id}`, 'HttpClientLab');
        },
        error: () => {
          // Remove locally anyway for smoothness
          this.todos.update((current) => current.filter((item) => item.id !== id));
          this.snackBar.open('Removed locally (Mock server bypass).', 'Dismiss', { duration: 2000 });
        },
      });
  }

  // 5. Demonstrate HTTP Error & Auto Retry
  public triggerHttpErrorWithRetry(): void {
    this.isLoading.set(true);
    this.errorLog.set(null);
    this.logger.warn('HTTP GET: Requesting broken endpoint. Initiating retry pipeline...', 'HttpClientLab');

    // Use a dead domain or broken address to force connection failure
    const deadUrl = 'https://non-existent-api-dns-error.dev/data';

    this.http
      .get(deadUrl)
      .pipe(
        // Retry twice (total 3 attempts) before failing
        retry(2),
        catchError((err) => {
          this.logger.error('HTTP Pipeline caught error after 3 attempts. Transmitting downstream.', 'HttpClientLab');
          return throwError(() => new Error('Connection failed after 2 retry attempts. API Server is offline.'));
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => {
          this.logger.info('Unexpected success!?', 'HttpClientLab');
        },
        error: (err: Error) => {
          this.errorLog.set(err.message);
          this.snackBar.open(`HTTP Request Failed: ${err.message}`, 'Dismiss', { duration: 5000 });
        },
      });
  }
}
