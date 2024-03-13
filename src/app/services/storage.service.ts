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
    let existingTodo = false
    this.todos.forEach((todoItem, index) => {
      if(todoItem.id === todo.id) {
        this.todos[index] = todoItem
        existingTodo = true
        return
      }
    })

    if(!existingTodo) {
      this.todos.push(todo)
    }

    localStorage.setItem('todos', JSON.stringify(this.todos))
  }
  
  getTodos(): ITodo[] {
    return this.todos
  }

  getTodo(id: number): ITodo | undefined {
    return this.todos.find(todo => todo.id === id)
  }
  
  deleteTodo(id: number) {
    this.todos = this.todos.filter(todoItem => todoItem.id !== id)
    localStorage.setItem('todos', JSON.stringify(this.todos))
  }

  getTodoById(id: number) {
    return this.todos.find(todo => todo.id === id)
  }

  

}
