import { Component, Input, OnInit, Signal, WritableSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list'
import { ITodo } from '../../services/todos.service';
import { MatSelectModule } from '@angular/material/select';
import { MySelectComponent } from '../Interface/my-select/my-select.component';
import { MatInputModule } from '@angular/material/input'
import { MyInputComponent } from '../Interface/my-input/my-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';

export interface ITile {
  cols: number;
  rows: number;
  text: string;
  border: string
}

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
    MyInputComponent,
    MatIconModule
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent implements OnInit {
  @Input() todo: ITodo = {} as ITodo
  tiles: ITile[] = []
  statusOptions = ['По плану', 'Под угрозой', 'Отстаёт']
  isInputVisible: boolean = false
  private executioneer: WritableSignal<string> = signal('')
  
  ngOnInit(): void {
    this.tiles = [
      {border: '1px solid black', text: this.todo.title, cols: 3, rows: 1},
      {border: '1px solid black', text: this.todo.executors, cols: 2, rows: 1},
      {border: '1px solid black', text: this.todo.deadline, cols: 1, rows: 1},
      {border: '1px solid black', text: this.todo.priority, cols: 1, rows: 1},
      {border: '1px solid black', text: this.todo.status, cols: 1, rows: 1}
    ]
  }

  statusChangeHandler(value: 'По плану' | 'Под угрозой' | 'Отстаёт'){
    // this.todo.status = value
    console.log(value, this.todo)
  }

  swithcInputVisible() {
    this.isInputVisible = !this.isInputVisible
  }

  inputChangeHandler(event: any) {
    console.log(event.target.value)
    this.executioneer.set(event.target.value)
  }

}
