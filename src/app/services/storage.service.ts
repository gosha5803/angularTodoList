import { Injectable } from '@angular/core';
import { ITodo } from '../pages/todos-page/todos-page.component';
import { ICreateTodo } from './todos.service';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private todos: ICreateTodo[] = []

  constructor() { 
    const currentTodos = localStorage.getItem('todos')
    if(!currentTodos){
      localStorage.setItem('todos', JSON.stringify([]))

      const newTodos = localStorage.getItem('todos')
      if(newTodos) {
        this.todos = JSON.parse(newTodos)
      }
      
    } else {
      this.todos = JSON.parse(currentTodos)
    }
  }

  saveTodo(todo: ICreateTodo) {
    this.todos.push(todo)

    localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  getTodos() {
    return this.todos
  }

}
