import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Todo {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'https://u05restfulapi.onrender.com/api/v1/todos';

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
      .pipe(catchError(this.handleError<Todo[]>('getAll', [])));
  }

  getOne(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError<Todo>('getOne')));
  }

  getFiltered(completed: boolean): Observable<Todo[]> {
    const params = new HttpParams().set('completed', completed.toString());
    return this.http.get<Todo[]>(`${this.baseUrl}/filter`, { params })
      .pipe(catchError(this.handleError<Todo[]>('getFiltered', [])));
  }

  create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, todo)
      .pipe(
        tap(() => this.refresh()),
        catchError(this.handleError<Todo>('create'))
      );
  }

  update(id: string, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/${id}`, todo)
      .pipe(
        tap(() => this.refresh()),
        catchError(this.handleError<Todo>('update'))
      );
  }

  delete(id: string): Observable<void> {
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