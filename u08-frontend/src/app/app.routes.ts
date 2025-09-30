import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/todos', pathMatch: 'full' },
  { 
    path: 'todos', 
    loadComponent: () => import('./pages/todo-list/todo-list').then(m => m.TodoList)
  },
  { 
    path: 'todos/new', 
    loadComponent: () => import('./pages/todo-form/todo-form').then(m => m.TodoForm)
  },
  { 
    path: 'todos/:id', 
    loadComponent: () => import('./pages/todo-detail/todo-detail').then(m => m.TodoDetail)
  },
  { 
    path: 'todos/:id/edit', 
    loadComponent: () => import('./pages/todo-form/todo-form').then(m => m.TodoForm)
  },
  { path: '**', redirectTo: '/todos' }
];
