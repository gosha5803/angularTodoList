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

// Компонент страницы со всеми задачами.
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
  // Массив задач дл отрисовки
  todos: ITodo[] | undefined
  // Массив плиток с названиями полей таблицы/задачи
  tiles: ITile[] = []
  // Свойство сортироки и направление сортировки
  sortProp: string | 'Срок' | 'Статус' | 'Исполнитель'= ''
  sortDirection: 1 | -1 = 1
  
  
  constructor(
    // Исользуем сервис хранилища
    private storage: StorageService
    ) {}
    
    // При инициализации присваиваем плиткам массив с объектами - конфиг сетки таблицы.
    ngOnInit(): void {
      this.tiles = [
        {border: '1px solid black', text: 'Название задачи', cols: 8, rows: 1},
        {border: '1px solid black', text: 'Исполнитель', cols: 5, rows: 1},
        {border: '1px solid black', text: 'Срок', cols: 7, rows: 1},
        {border: '1px solid black', text: 'Приоритет', cols: 4, rows: 1},
        {border: '1px solid black', text: 'Статус', cols: 4, rows: 1}
      ]
      
    // Присваиваем задачи запрашивая их методом getTodo из сервиса.
    this.todos = this.storage.getTodos()
  }
  
  // Метод сортировки принимает строку свойства сортировки и присваивает её свойству sortProp и меняет текущее направление сортировки. Далее switch case перебирает каждое свойства и для каждого передаёт в функцию compare соответствующие значения ключей обхекта Задачи.
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

      // Функция принимает любые значения и сравнивает их, а затем умножает на направление сортировки.
  compare(a: any, b: any) {
    return (a > b ? 1 : -1) * this.sortDirection
  }
  
  // Функция для обновления состояния задчач, вызывается, когда дочерние элементы удаляют задачу, и запрашивают обновление данных. emmit()
  updateTodos() {
    this.todos = this.storage.getTodos()
  }
}