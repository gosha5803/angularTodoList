import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface ICreateTodo {
  title: string,
  deadline: string
  priority: string
  status: string
  executors: string
}

export interface ITodo extends ICreateTodo {
  id: number
}

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(
    private storage: StorageService
  ) { }

  createTodo(todoData: ICreateTodo) {
    const newTodo: ITodo = {...todoData, id: Date.now()}

    this.storage.saveTodo(newTodo)
    console.log(this.storage.getTodos())
    console.log(newTodo)
  }
}
