import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

export interface ICreateTodo {
  title: string
  deadline?: string
  priority?: string
  status?: string
  executors?: string
}

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(
    private storage: StorageService
  ) { }

  createTodo(todoData: ICreateTodo) {
    const newTodo = todoData

    this.storage.saveTodo(newTodo)
    console.log(this.storage.getTodos())
    console.log(newTodo)
  }
}
