import {Component, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { ITile, TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MyModalComponent } from '../../components/Interface/my-modal/my-modal.component';
import { StorageService } from '../../services/storage.service';



export interface IStatus {
  value: 'По плану' | 'Под угрозой' | 'Отстаёт'
}

export interface ITodo {
  id: number;
  title: string;
  description: string;
  deadLine: string;
  priority: string;
  status: 'По плану' | 'Под угрозой' | 'Отстаёт';
  executioneer: string;
}

const todos: ITodo[] = [
  {title: 'Заголовок1', description: '', deadLine: '11', priority: 'max', status: 'По плану', executioneer: 'Gosha', id: Date.now()},
  {title: 'Заголовок2', description: '', deadLine: '11', priority: 'max', status: 'Под угрозой', executioneer: 'Gosha', id: Date.now()},
  {title: 'Заголовок3', description: '', deadLine: '11', priority: 'max', status: 'Отстаёт', executioneer: 'Gosha', id: Date.now()},
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-todos-page',
  styleUrl: './todos-page.component.scss',
  templateUrl: './todos-page.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    TodoItemComponent,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MyModalComponent
  ],
})
export class TodosPageComponent implements OnInit {
  displayedColumns: string[] = ['title', 'name', 'weight', 'symbol'];
  todos = todos
  tiles: ITile[] = []

  constructor(
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.tiles = [
      {border: '1px solid black', text: 'Название задачи', cols: 3, rows: 1, color: 'white'},
      {border: '1px solid black', text: 'Исполнитель', cols: 2, rows: 1, color: 'white'},
      {border: '1px solid black', text: 'Срок', cols: 1, rows: 1, color: 'white'},
      {border: '1px solid black', text: 'Приоритет', cols: 1, rows: 1, color: 'white'},
      {border: '1px solid black', text: 'Статус', cols: 1, rows: 1, color: 'white'}
    ]

    console.log(this.storage.getTodos())
  }

  logger(e: any){
    console.log(e)
  }
}