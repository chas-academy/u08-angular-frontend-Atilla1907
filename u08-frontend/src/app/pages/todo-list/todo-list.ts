import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService } from '../../services/todo';
import { Todo } from '../../models/todo.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoList implements OnInit {
  todos$: Observable<Todo[]>;
  loading$: Observable<boolean>;
  errorMessage: string = '';

  constructor(private todoService: TodoService) {
    this.todos$ = this.todoService.todos$;
    this.loading$ = this.todoService.loading$;
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.todoService.getAllTodos().subscribe({
      error: (err) => {
        this.errorMessage = 'Failed to load todos. Please try again later.';
        console.error(err);
      }
    });
  }

  deleteTodo(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(id).subscribe({
        error: (err) => {
          this.errorMessage = 'Failed to delete todo.';
          console.error(err);
        }
      });
    }
  }

  toggleComplete(todo: Todo): void {
    if (!todo._id) return;
    
    this.todoService.updateTodo(todo._id, { completed: !todo.completed }).subscribe({
      error: (err) => {
        this.errorMessage = 'Failed to update todo.';
        console.error(err);
      }
    });
  }

  getCurrentDate(): string {
    return new Date().toISOString();
  }
}
