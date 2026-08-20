import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoggingService } from '../../core/services/logging';

// Dynamic Form Field Schema Interface
interface DynamicFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[];
  value?: any;
  required?: boolean;
}

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.css',
})
export class FormsDemoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly logger = inject(LoggingService);
  private readonly snackBar = inject(MatSnackBar);

  // 1. Reactive Form Instance
  public profileForm!: FormGroup;

  // 2. Template-Driven Form Mock Data Model
  public feedbackModel = {
    fullName: '',
    email: '',
    category: 'bug',
    message: '',
    subscribe: false,
  };

  // 3. Dynamic Form configuration details
  public dynamicForm!: FormGroup;
  public readonly dynamicFields: DynamicFieldConfig[] = [
    { key: 'company', label: 'Company Name', type: 'text', required: true, value: 'Google' },
    { key: 'industry', label: 'Industry Sector', type: 'select', options: ['Tech', 'Finance', 'Health', 'Education'], required: true, value: 'Tech' },
    { key: 'newsletter', label: 'Subscribe to technical digest', type: 'checkbox', value: true },
  ];

  // Helper getters for Reactive FormArray
  public get skillsArray(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  public ngOnInit(): void {
    this.initReactiveForm();
    this.initDynamicForm();
    this.logger.info('FormsDemo component initialized.', 'FormsLab');
  }

  // --- REACTIVE FORM INITIALIZATION & FLOWS ---
  private initReactiveForm(): void {
    this.profileForm = this.fb.group(
      {
        // Async validator appended to username
        username: [
          '',
          {
            validators: [Validators.required, Validators.minLength(4)],
            asyncValidators: [this.usernameAvailabilityValidator.bind(this)],
            updateOn: 'blur', // trigger async validation only when focus is lost (performance best-practice!)
          },
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), this.passwordComplexityValidator]],
        confirmPassword: ['', [Validators.required]],
        // Nested FormGroup
        address: this.fb.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        }),
        // FormArray for dynamic skills
        skills: this.fb.array([this.fb.control('', Validators.required)]),
      },
      {
        // Custom synchronous validator registered on group level
        validators: [this.passwordsMatchValidator],
      }
    );
  }

  // Custom Sync Validator: Check password complexity
  private passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasNumber = /[0-9]/.test(value);
    const hasCapital = /[A-Z]/.test(value);
    if (value && (!hasNumber || !hasCapital)) {
      return { passwordComplexity: 'Password must contain at least one capital letter and one number.' };
    }
    return null;
  }

  // Custom Sync Group Validator: Verifies Password & Confirm Password match
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordsMismatch: true };
  }

  // Custom Async Validator: Simulates database checks for username uniqueness
  private usernameAvailabilityValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    const username = control.value;
    this.logger.debug(`Async validation started for username: ${username}`, 'FormsLab');
    
    // Simulate HTTP delay
    return of(username).pipe(
      delay(1000), // 1 second lag
      map((val) => {
        const takenUsernames = ['admin', 'root', 'angular', 'developer'];
        if (takenUsernames.includes(val.toLowerCase())) {
          this.logger.warn(`Async Validation: username '${val}' is already taken.`, 'FormsLab');
          return { usernameTaken: true };
        }
        this.logger.debug(`Async Validation: username '${val}' is available.`, 'FormsLab');
        return null;
      }),
      catchError(() => of(null))
    );
  }

  // FormArray Operations
  public addSkillInput(): void {
    this.skillsArray.push(this.fb.control('', Validators.required));
    this.logger.info(`Added item to skills FormArray. New length: ${this.skillsArray.length}`, 'FormsLab');
  }

  public removeSkillInput(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
      this.logger.info(`Removed item from skills FormArray at index: ${index}`, 'FormsLab');
    } else {
      this.snackBar.open('At least one skill field is required.', 'Dismiss', { duration: 2000 });
    }
  }

  public submitReactiveForm(): void {
    if (this.profileForm.valid) {
      this.logger.info('Reactive Form submitted successfully:', 'FormsLab');
      console.log(this.profileForm.value);
      this.snackBar.open('Reactive Profile Form Submitted successfully!', 'Dismiss', { duration: 3000 });
    }
  }

  // --- TEMPLATE-DRIVEN FORM FLOWS ---
  public submitTemplateForm(form: any): void {
    if (form.valid) {
      this.logger.info('Template-Driven Form submitted successfully:', 'FormsLab');
      console.log(this.feedbackModel);
      this.snackBar.open('Template Contact Feedback Submitted successfully!', 'Dismiss', { duration: 3000 });
    }
  }

  // --- DYNAMIC FORM FLOWS ---
  private initDynamicForm(): void {
    const group: any = {};
    this.dynamicFields.forEach((field) => {
      group[field.key] = this.fb.control(
        field.value || '',
        field.required ? Validators.required : null
      );
    });
    this.dynamicForm = new FormGroup(group);
  }

  public submitDynamicForm(): void {
    if (this.dynamicForm.valid) {
      this.logger.info('Dynamic Form compiled and submitted successfully:', 'FormsLab');
      console.log(this.dynamicForm.value);
      this.snackBar.open('Dynamic Form Schema Submitted successfully!', 'Dismiss', { duration: 3000 });
    }
  }
}
