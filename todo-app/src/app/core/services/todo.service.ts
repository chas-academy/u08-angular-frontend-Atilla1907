import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'https://u05restfulapi.onrender.com';

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refresh();
  }

  refresh() {
    this.getAll().subscribe(todos => this.todosSubject.next(todos));
  }

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl)
      .pipe(
        tap(() => console.log('Fetched todos')),
        catchError(this.handleError<Todo[]>('getAll', []))
      );
  }

  getOne(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError<Todo>('getOne')));
  }

  create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, todo)
      .pipe(
        tap(() => this.refresh()),
        catchError(this.handleError<Todo>('create'))
      );
  }

  update(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/${id}`, todo)
      .pipe(
        tap(() => this.refresh()),
        catchError(this.handleError<Todo>('update'))
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => this.refresh()),
        catchError(this.handleError<void>('delete'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}