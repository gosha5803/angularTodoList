import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface ICreateTodo {
  title: string,
  deadline: IDeadline
  priority: string
  status: string 
  executors: string
  description?: string
}

export interface IDeadline {
  start: string
  end: {
    string: string
    number: number
  }
}

export interface IStatus {
  value: 'По плану' | 'Отстаёт' | 'Под угрозой'
  weight: 1 | 2 | 3
}

export interface ITodo extends Omit<ICreateTodo, 'status'>  {
  id: number
  status: IStatus
}

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(
    private storage: StorageService
  ) { }

  createTodo(todoData: ICreateTodo) {
    const todo: ITodo = {...todoData, status: {} as IStatus, id: Date.now()}
    switch(todoData.status) {
      case 'Под угрозой':
        todo.status = {value: todoData.status, weight: 2}
        break
      case 'По плану': 
        todo.status = {value: todoData.status, weight: 1}
        break
      case 'Отстаёт': 
        todo.status = {value: todoData.status, weight: 3}
        break
      }

    // const newTodo: ITodo = {...todoData, id: Date.now()}

    this.storage.saveTodo(todo)
  }

  changeStatus(status: string, todo: ITodo) {
    
    switch(status) {
      case 'Под угрозой':
        todo.status = {value: status, weight: 2}
        break
      case 'По плану': 
        todo.status = {value: status, weight: 1}
        break
      case 'Отстаёт': 
        todo.status = {value: status, weight: 3}
        break
    }

    this.storage.saveTodo(todo)
  }

  changePriority(value: string, todo: ITodo) {
    todo.priority = value
    this.storage.saveTodo(todo)
  }

  changeExecutor(value: string, todo: ITodo) {
    todo.executors = value
    this.storage.saveTodo(todo)
  }

  changeDescription(value: string, todo: ITodo) {
    todo.description = value
    this.storage.saveTodo(todo)
  }
}
