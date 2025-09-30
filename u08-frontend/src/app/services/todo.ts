import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://u05restfulapi.onrender.com/api/v1/todos';
  
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllTodos(): Observable<Todo[]> {
    this.loadingSubject.next(true);
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      tap(todos => {
        this.todosSubject.next(todos);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  getTodoById(id: string): Observable<Todo> {
    this.loadingSubject.next(true);
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  createTodo(todo: CreateTodoDto): Observable<Todo> {
    this.loadingSubject.next(true);
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      tap(newTodo => {
        const currentTodos = this.todosSubject.value;
        this.todosSubject.next([...currentTodos, newTodo]);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  updateTodo(id: string, updates: UpdateTodoDto): Observable<Todo> {
    this.loadingSubject.next(true);
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updatedTodo => {
        const currentTodos = this.todosSubject.value;
        const index = currentTodos.findIndex(t => t._id === id);
        if (index !== -1) {
          currentTodos[index] = updatedTodo;
          this.todosSubject.next([...currentTodos]);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  deleteTodo(id: string): Observable<void> {
    this.loadingSubject.next(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTodos = this.todosSubject.value;
        this.todosSubject.next(currentTodos.filter(t => t._id !== id));
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Try to get the actual error message from the API
      const apiError = error.error?.error || error.error?.message || error.message;
      errorMessage = `Server Error (${error.status}): ${apiError}`;
      console.error('Full error details:', error.error);
      console.error('Error status:', error.status);
      console.error('Error message:', apiError);
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
