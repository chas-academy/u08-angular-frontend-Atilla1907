export interface Todo {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
  completed: boolean;
  dueDate: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}
