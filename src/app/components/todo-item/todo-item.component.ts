import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, WritableSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list'
import { ITodo, TodosService } from '../../services/todos.service';
import { MatSelectModule } from '@angular/material/select';
import { MySelectComponent } from '../Interface/my-select/my-select.component';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { StorageService } from '../../services/storage.service';
import { RouterLink } from '@angular/router';

//Интерфейс плитки, для отрисоки её в элементе mat-grid-list
export interface ITile {
  cols: number;
  rows: number;
  text: string;
  border: string
}

//Компонент задачи. Предназначен дл яотрисовки полей задачи на странице со всеми задачами и на странице с детальным просмоотром задачи.
@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatSelectModule,
    MySelectComponent,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    RouterLink
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent implements OnInit, OnChanges {
  // Задача передаётся извне, на основе её полей отрисовывается mat-grid-list.
  @Input() todo: ITodo = {} as ITodo
  // Ключ родительского компонента, пердаётся из родителя, так как на разных компонентах задачу необходимо отрисовывать по-разному.
  @Input() parent: 'todosPage' | 'todoPage' = 'todosPage'
  tiles: ITile[] = []
  statusOptions: string[] = ['По плану', 'Под угрозой', 'Отстаёт']
  isInputVisible: boolean = false
  selectColor: 'red' | '#1bc31b' | '#ffba3b' | '' = ''
  priorityColor: '#71b7b0' | '#ffba3b' | 'rgb(207 31 251)' | '' = ''
  executor: WritableSignal<string> = signal('')
  @Output() emitTodosUpdate: EventEmitter<void> = new EventEmitter()
  
  constructor(
    private todosService: TodosService,
    private storage: StorageService
    ) {}

  ngOnInit(): void {
    this.tiles = this.parent === 'todosPage' ? [
      {border: '1px solid', text: this.todo.title, cols: 8, rows: 1},
      {border: '1px solid', text: this.todo.executors, cols: 5, rows: 1},
      {border: '1px solid', text: this.todo.deadline.start + ' - ' + this.todo.deadline.end.string, cols: 7, rows: 1},
      {border: '1px solid', text: this.todo.priority, cols: 4, rows: 1},
      {border: '1px solid', text: this.todo.status.value, cols: 4, rows: 1}
    ] : [
      // {border: '1px solid', text: this.todo.title, cols: 1, rows: 1},
      {border: '1px solid', text: this.todo.executors, cols: 1, rows: 1},
      {border: '1px solid', text: this.todo.deadline.start + ' - ' + this.todo.deadline.end.string, cols: 1, rows: 1},
      {border: '1px solid', text: this.todo.priority, cols: 1, rows: 1},
      {border: '1px solid', text: this.todo.status.value, cols: 1, rows: 1}
    ]

    this.executor.set(this.todo.executors)
    this.switchStatusColor()
    this.switchPriorityColor()
  }

  ngOnChanges(changes: SimpleChanges): void {
      // console.log(changes)
  }

  executorChangeHandler(event: Event) {
    if((event.target as HTMLInputElement).value){
      this.executor.set((event.target as HTMLInputElement).value)
    }
  }

  changeExecutor() {
    this.todosService.changeExecutor(this.executor(), this.todo)
    this.swithcInputVisible()
    // this.emitTodosUpdate.emit()    
  }

  statusChangeHandler(value: string) {
    this.todosService.changeStatus(value, this.todo)
    this.switchStatusColor()
  }
  
  priorityChangeHandler(value: string) {
    this.todosService.changePriority(value, this.todo)
    this.switchPriorityColor()
  }

  switchStatusColor() {
    switch(this.todo.status.value) {
      case 'Под угрозой':
        this.selectColor = '#ffba3b'
        break
      case 'По плану':
        this.selectColor = '#1bc31b'
        break
      case 'Отстаёт':
        this.selectColor = 'red'
        break
    }
  }

  switchPriorityColor() {
    switch(this.todo.priority) {
      case 'Высокий':
        this.priorityColor = 'rgb(207 31 251)'
        break
      case 'Средний':
        this.priorityColor = '#ffba3b'
        break
      case 'Низкий':
        this.priorityColor = '#71b7b0'
        break
    }
  }

  swithcInputVisible() {
    this.isInputVisible = !this.isInputVisible
  }

  // inputChangeHandler(event: any) {
  //   this.executioneer.set(event.target.value)
  // }

  deleteTodo() {
    this.storage.deleteTodo(this.todo.id)
    this.emitTodosUpdate.emit()
  }

  refreshTodo() {
    const newTodo = this.storage.getTodo(this.todo.id)
    if(newTodo) {
      this.todo = newTodo
    }
  }

  openTodo(id: number) {

  }
}
