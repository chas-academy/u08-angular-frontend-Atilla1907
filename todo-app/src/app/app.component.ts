import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  todos: Todo[] = [];
  newTodo: Partial<Todo> = {};

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.todos$.subscribe(todos => this.todos = todos);
  }

  addTodo() {
    if (!this.newTodo.title) return;
    this.todoService.create(this.newTodo as Todo).subscribe(() => this.newTodo = {});
  }

  updateTodo(todo: Todo) {
    this.todoService.update(todo._id!, todo).subscribe();
  }

  deleteTodo(id: string) {
    this.todoService.delete(id).subscribe();
  }

  toggleComplete(todo: Todo) {
    todo.completed = !todo.completed;
    this.updateTodo(todo);
  }
}