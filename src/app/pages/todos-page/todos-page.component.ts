import {Component, OnInit} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { ITile, TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MyModalComponent } from '../../components/Interface/my-modal/my-modal.component';
import { StorageService } from '../../services/storage.service';
import { ITodo } from '../../services/todos.service';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';


// const todos: ITodo[] = [
//   {title: 'Заголовок1', description: '', deadLine: '11', priority: 'max', status: 'По плану', executioneer: 'Gosha', id: Date.now()},
//   {title: 'Заголовок2', description: '', deadLine: '11', priority: 'max', status: 'Под угрозой', executioneer: 'Gosha', id: Date.now()},
//   {title: 'Заголовок3', description: '', deadLine: '11', priority: 'max', status: 'Отстаёт', executioneer: 'Gosha', id: Date.now()},
// ];

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
    MyModalComponent,
    MatCardModule,
    RouterLink
  ],
})
export class TodosPageComponent implements OnInit {
  todos: ITodo[] | undefined
  tiles: ITile[] = []
  sortProp: string | 'Срок' | 'Статус' | 'Исполнитель'= ''
  sortDirection: 1 | -1 = 1
  
  
  constructor(
    private storage: StorageService
    ) {}
    
    ngOnInit(): void {
      this.tiles = [
        {border: '1px solid black', text: 'Название задачи', cols: 8, rows: 1},
        {border: '1px solid black', text: 'Исполнитель', cols: 5, rows: 1},
        {border: '1px solid black', text: 'Срок', cols: 7, rows: 1},
        {border: '1px solid black', text: 'Приоритет', cols: 4, rows: 1},
        {border: '1px solid black', text: 'Статус', cols: 4, rows: 1}
      ]
      
    this.todos = this.storage.getTodos()
  }
  
  sort(prop: string) {
    this.sortProp = prop
    this.sortDirection = this.sortDirection === -1 ? 1 : -1
    
    this.todos = this.todos?.sort((a: ITodo, b: ITodo) => {
      switch(this.sortProp){
        case 'Срок':
          return this.compare(a.deadline.end.number, b.deadline.end.number)
          case 'Статус':
            return this.compare(a.status.weight, b.status.weight)
            case 'Исполнитель':
              return this.compare(a.executors, b.executors)
              default:
                return 1
              }
            })
          }
          
  compare(a: any, b: any) {
    return (a > b ? 1 : -1) * this.sortDirection
  }
  
  updateTodos() {
    this.todos = this.storage.getTodos()
    console.log(this.todos)
  }
}