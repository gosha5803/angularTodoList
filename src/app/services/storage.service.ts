import { Injectable } from '@angular/core';
import { ITodo } from './todos.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private todos: ITodo[] = []

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

  saveTodo(todo: ITodo) {
    this.todos.push(todo)

    localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  getTodos(): ITodo[] {
    return this.todos
  }

}
