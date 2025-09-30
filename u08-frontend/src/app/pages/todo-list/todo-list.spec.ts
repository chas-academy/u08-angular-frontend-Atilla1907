import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TodoList } from './todo-list';
import { TodoService } from '../../services/todo';
import { of, throwError } from 'rxjs';
import { Todo } from '../../models/todo.model';

describe('TodoList', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;
  let todoService: jasmine.SpyObj<TodoService>;

  const mockTodos: Todo[] = [
    { _id: '1', title: 'Test Todo 1', description: 'Description 1', completed: false, dueDate: '2025-10-01' },
    { _id: '2', title: 'Test Todo 2', description: 'Description 2', completed: true, dueDate: '2025-10-02' }
  ];

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', ['getAllTodos', 'deleteTodo', 'updateTodo'], {
      todos$: of(mockTodos),
      loading$: of(false)
    });

    await TestBed.configureTestingModule({
      imports: [TodoList, HttpClientTestingModule],
      providers: [
        { provide: TodoService, useValue: todoServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', () => {
    todoService.getAllTodos.and.returnValue(of(mockTodos));
    
    component.ngOnInit();
    
    expect(todoService.getAllTodos).toHaveBeenCalled();
  });

  it('should display error message when loading fails', () => {
    const errorMessage = 'Failed to load todos';
    todoService.getAllTodos.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.loadTodos();
    
    expect(component.errorMessage).toBe('Failed to load todos. Please try again later.');
  });

  it('should delete a todo when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    todoService.deleteTodo.and.returnValue(of(void 0));
    
    component.deleteTodo('1');
    
    expect(todoService.deleteTodo).toHaveBeenCalledWith('1');
  });

  it('should not delete a todo when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteTodo('1');
    
    expect(todoService.deleteTodo).not.toHaveBeenCalled();
  });

  it('should toggle todo completion status', () => {
    const todo = mockTodos[0];
    todoService.updateTodo.and.returnValue(of({ ...todo, completed: true }));
    
    component.toggleComplete(todo);
    
    expect(todoService.updateTodo).toHaveBeenCalledWith('1', { completed: true });
  });
});
