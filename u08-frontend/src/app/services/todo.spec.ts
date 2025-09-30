import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo';
import { Todo } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://u05restfulapi.onrender.com/api/v1/todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all todos via GET', () => {
    const mockTodos: Todo[] = [
      { _id: '1', title: 'Test Todo', description: 'Test Description', completed: false, dueDate: '2025-10-01' },
      { _id: '2', title: 'Another Todo', description: 'Another Description', completed: true, dueDate: '2025-10-02' }
    ];

    service.getAllTodos().subscribe(todos => {
      expect(todos.length).toBe(2);
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should fetch a single todo by ID via GET', () => {
    const mockTodo: Todo = { 
      _id: '1', 
      title: 'Test Todo', 
      description: 'Test Description', 
      completed: false, 
      dueDate: '2025-10-01' 
    };

    service.getTodoById('1').subscribe(todo => {
      expect(todo).toEqual(mockTodo);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodo);
  });

  it('should create a new todo via POST', () => {
    const newTodo = { 
      title: 'New Todo', 
      description: 'New Description', 
      completed: false, 
      dueDate: '2025-10-01' 
    };
    const mockResponse: Todo = { ...newTodo, _id: '3' };

    service.createTodo(newTodo).subscribe(todo => {
      expect(todo).toEqual(mockResponse);
      expect(todo._id).toBe('3');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTodo);
    req.flush(mockResponse);
  });

  it('should update a todo via PUT', () => {
    const updates = { completed: true };
    const mockResponse: Todo = { 
      _id: '1', 
      title: 'Test Todo', 
      description: 'Test Description', 
      completed: true, 
      dueDate: '2025-10-01' 
    };

    service.updateTodo('1', updates).subscribe(todo => {
      expect(todo.completed).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updates);
    req.flush(mockResponse);
  });

  it('should delete a todo via DELETE', () => {
    service.deleteTodo('1').subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle errors gracefully', () => {
    const errorMessage = 'Server Error (500): Http failure response';

    service.getAllTodos().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.message).toContain('Server Error');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
