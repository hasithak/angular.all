import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggingService } from '../../core/services/logging';

// --- 1. IMMUTABLE STATE MODELS ---
interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

interface AppState {
  todos: TodoItem[];
  filter: 'all' | 'active' | 'completed';
}

const initialAppState: AppState = {
  todos: [
    { id: 1, text: 'Study Angular Dependency Injection', done: true },
    { id: 2, text: 'Build a reactive state store', done: false },
  ],
  filter: 'all',
};

// --- 2. SIMPLE STORE PATTERN CLASS ---
class SimpleStore {
  private readonly stateSubject = new BehaviorSubject<AppState>(initialAppState);
  public readonly state$ = this.stateSubject.asObservable();

  // History stacks for time travel (Undo/Redo)
  private undoStack: AppState[] = [];
  private redoStack: AppState[] = [];

  constructor() {}

  // Selector helper
  public select<K>(mapFn: (state: AppState) => K): Observable<K> {
    return this.state$.pipe(map(mapFn));
  }

  // Immutable State Mutation
  public setState(reducer: (state: AppState) => AppState): void {
    const currentState = this.stateSubject.getValue();
    const nextState = reducer(currentState);

    // Save previous state to history
    this.undoStack.push(currentState);
    this.redoStack = []; // clear redo on new action

    this.stateSubject.next(nextState);
  }

  // Time Travel: Undo
  public undo(): boolean {
    if (this.undoStack.length === 0) return false;

    const previousState = this.undoStack.pop()!;
    const currentState = this.stateSubject.getValue();
    this.redoStack.push(currentState);

    this.stateSubject.next(previousState);
    return true;
  }

  // Time Travel: Redo
  public redo(): boolean {
    if (this.redoStack.length === 0) return false;

    const nextState = this.redoStack.pop()!;
    const currentState = this.stateSubject.getValue();
    this.undoStack.push(currentState);

    this.stateSubject.next(nextState);
    return true;
  }

  public getHistoryLength(): { undo: number; redo: number } {
    return { undo: this.undoStack.length, redo: this.redoStack.length };
  }
}

// --- 3. MOCK NGRX CONCEPTS TYPES ---
interface NgRxActionLog {
  timestamp: Date;
  actionType: string;
  payload?: any;
  previousState: string;
  nextState: string;
}

@Component({
  selector: 'app-state-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './state-demo.html',
  styleUrl: './state-demo.css',
  // Local store provider
  providers: [SimpleStore],
})
export class StateDemoComponent implements OnInit {
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);
  public readonly store = inject(SimpleStore);

  // Todo input text
  public todoInput = '';

  // Reactive view lists bound to SimpleStore
  public filteredTodos$!: Observable<TodoItem[]>;
  public activeFilter$!: Observable<string>;
  
  // History tracking state
  public undoCount = signal(0);
  public redoCount = signal(0);

  // NgRx actions visual logs
  public readonly ngrxLogs = signal<NgRxActionLog[]>([]);

  constructor() {
    this.logger.info('StateDemo component initialized.', 'StateLab');
  }

  public ngOnInit(): void {
    // Select dynamic list of filtered items from Store
    this.filteredTodos$ = this.store.state$.pipe(
      map((state) => {
        if (state.filter === 'active') return state.todos.filter((t) => !t.done);
        if (state.filter === 'completed') return state.todos.filter((t) => t.done);
        return state.todos;
      })
    );

    this.activeFilter$ = this.store.select((s) => s.filter);

    // Sync history lengths to trigger button disable states
    this.store.state$.subscribe(() => {
      const history = this.store.getHistoryLength();
      this.undoCount.set(history.undo);
      this.redoCount.set(history.redo);
    });
  }

  // --- ACTIONS (Mutators) ---
  public addTodoItem(): void {
    if (!this.todoInput.trim()) return;

    const taskText = this.todoInput;
    this.todoInput = '';

    // Log old state for mock NgRx visualizer
    const prevStateStr = JSON.stringify(this.getCurrentStoreValue(), null, 2);

    this.store.setState((state) => ({
      ...state,
      todos: [...state.todos, { id: Date.now(), text: taskText, done: false }],
    }));

    this.logNgRxAction('[Todo List] Add Todo', { text: taskText }, prevStateStr);
    this.snackBar.open('Task added to reactive store!', 'Dismiss', { duration: 1500 });
  }

  public toggleTodoItem(id: number): void {
    const prevStateStr = JSON.stringify(this.getCurrentStoreValue(), null, 2);

    this.store.setState((state) => ({
      ...state,
      todos: state.todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    }));

    this.logNgRxAction('[Todo List] Toggle Todo Status', { id }, prevStateStr);
  }

  public deleteTodoItem(id: number): void {
    const prevStateStr = JSON.stringify(this.getCurrentStoreValue(), null, 2);

    this.store.setState((state) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
    }));

    this.logNgRxAction('[Todo List] Delete Todo Item', { id }, prevStateStr);
  }

  public changeFilter(filter: 'all' | 'active' | 'completed'): void {
    const prevStateStr = JSON.stringify(this.getCurrentStoreValue(), null, 2);

    this.store.setState((state) => ({
      ...state,
      filter,
    }));

    this.logNgRxAction('[Todo Filter] Set Filter Profile', { filter }, prevStateStr);
  }

  // Time Travel actions
  public triggerUndo(): void {
    const prev = JSON.stringify(this.getCurrentStoreValue(), null, 2);
    const success = this.store.undo();
    if (success) {
      this.logNgRxAction('[Store History] Undo Action mutation', {}, prev);
      this.snackBar.open('Time Travel: Undo performed!', 'Dismiss', { duration: 1500 });
    }
  }

  public triggerRedo(): void {
    const prev = JSON.stringify(this.getCurrentStoreValue(), null, 2);
    const success = this.store.redo();
    if (success) {
      this.logNgRxAction('[Store History] Redo Action mutation', {}, prev);
      this.snackBar.open('Time Travel: Redo performed!', 'Dismiss', { duration: 1500 });
    }
  }

  // Helper to retrieve current snapshot
  private getCurrentStoreValue(): AppState {
    let val!: AppState;
    this.store.state$.subscribe((v) => (val = v)).unsubscribe();
    return val;
  }

  // --- 4. MOCK NGRX LOGGING ACTIONS ---
  private logNgRxAction(actionType: string, payload: any, previousStateStr: string): void {
    const nextStateStr = JSON.stringify(this.getCurrentStoreValue(), null, 2);
    const logEntry: NgRxActionLog = {
      timestamp: new Date(),
      actionType,
      payload,
      previousState: previousStateStr,
      nextState: nextStateStr,
    };
    
    this.ngrxLogs.update((current) => [logEntry, ...current].slice(0, 10)); // save last 10 actions
    this.logger.info(`NgRx Dispatched Action: ${actionType}`, 'StoreLab');
  }

  public triggerMockNgRxEffect(): void {
    this.snackBar.open('Simulated NgRx Effect: Loaded settings from API!', 'Dismiss', { duration: 2000 });
    const prev = JSON.stringify(this.getCurrentStoreValue(), null, 2);
    this.logNgRxAction('[Settings API] Fetch Config Success (Effect fired)', { loaded: true }, prev);
  }

  public clearStoreLogs(): void {
    this.ngrxLogs.set([]);
  }
}
