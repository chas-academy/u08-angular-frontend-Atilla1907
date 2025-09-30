import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '../../services/todo';
import { Todo } from '../../models/todo.model';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-todo-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.scss'
})
export class TodoForm implements OnInit {
  todoForm!: FormGroup;
  isEditMode = false;
  todoId: string | null = null;
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.pipe(
      switchMap(params => {
        this.todoId = params['id'];
        if (this.todoId) {
          this.isEditMode = true;
          return this.todoService.getTodoById(this.todoId);
        }
        return of(null);
      })
    ).subscribe({
      next: (todo) => {
        if (todo) {
          this.populateForm(todo);
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load todo.';
        console.error(err);
      }
    });
  }

  initForm(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.minLength(5), Validators.maxLength(500)]],
      completed: [false],
      dueDate: [defaultDate, Validators.required]
    });
  }

  populateForm(todo: Todo): void {
    const dateOnly = todo.dueDate.split('T')[0];
    
    this.todoForm.patchValue({
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      dueDate: dateOnly
    });
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = { ...this.todoForm.value };
    
    // Remove empty description to avoid API validation errors
    if (!formValue.description || formValue.description.trim() === '') {
      delete formValue.description;
    }
    
    // Convert date string to ISO format for the API
    if (formValue.dueDate) {
      formValue.dueDate = new Date(formValue.dueDate).toISOString();
    }
    
    console.log('Form value before submission:', formValue);
    console.log('Form value type check:', {
      title: typeof formValue.title,
      description: typeof formValue.description,
      completed: typeof formValue.completed,
      dueDate: typeof formValue.dueDate
    });

    if (this.isEditMode && this.todoId) {
      this.todoService.updateTodo(this.todoId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/todos', this.todoId]);
        },
        error: (err) => {
          this.errorMessage = 'Failed to update todo. Please try again.';
          this.isSubmitting = false;
          console.error(err);
        }
      });
    } else {
      this.todoService.createTodo(formValue).subscribe({
        next: (newTodo) => {
          this.router.navigate(['/todos', newTodo._id]);
        },
        error: (err) => {
          this.errorMessage = 'Failed to create todo. Please try again.';
          this.isSubmitting = false;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.todoId) {
      this.router.navigate(['/todos', this.todoId]);
    } else {
      this.router.navigate(['/todos']);
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.todoForm.get(field);
    return !!(control && control.hasError(error) && (control.dirty || control.touched));
  }

  isFieldInvalid(field: string): boolean {
    const control = this.todoForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
