import { Injectable } from '@angular/core';
import { ITodo } from './todos.service';

// Сервис для работы с локальным хранилищем.
@Injectable({
  providedIn: 'root'
})
export class StorageService {
// Свйоство текущих задач.
  private todos: ITodo[] = []

  constructor() { 
    // В конструкторе запрашиваются текущие задачи в localStorage, если там нет такого поля, то знаечнию задач присваивается пустой массив и они сохр-ся в localStorage иначе текущие задачи парсятся и присваиваются todos
    const currentTodos = localStorage.getItem('todos')
    if(!currentTodos){
      this.todos = []
      localStorage.setItem('todos', JSON.stringify(this.todos))
    } else {
      this.todos = JSON.parse(currentTodos)
    }
  }

  // метод созранения задачи ищет существующую задачу по айди, если находит то присваивает её индексу в массиве обновленную задачу, иначе, добавляет в массив новым элементом. И сохраняет todos в localStorage.
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
  
  // Получени записей - возвращает массив ITodo
  getTodos(): ITodo[] {
    return this.todos
  }

  // Удаление задачи, фильтрует массив todos  и сохраняет отфильтрованным в lS.
  deleteTodo(id: number) {
    this.todos = this.todos.filter(todoItem => todoItem.id !== id)
    localStorage.setItem('todos', JSON.stringify(this.todos))
  }
  
  // Получение задачи по айди
  getTodoById(id: number) {
    return this.todos.find(todo => todo.id === id)
  }
}
