import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TodoService } from '../../services/todo';
import { Todo } from '../../models/todo.model';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-todo-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './todo-detail.html',
  styleUrl: './todo-detail.scss'
})
export class TodoDetail implements OnInit {
  todo$!: Observable<Todo>;
  loading$: Observable<boolean>;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {
    this.loading$ = this.todoService.loading$;
  }

  ngOnInit(): void {
    this.todo$ = this.route.params.pipe(
      switchMap(params => this.todoService.getTodoById(params['id']))
    );
  }

  deleteTodo(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.router.navigate(['/todos']);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete todo.';
          console.error(err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/todos']);
  }
}
