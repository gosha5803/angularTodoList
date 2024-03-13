import { Component, EventEmitter, Input, OnInit, Output, WritableSignal, signal } from '@angular/core';
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
export class TodoItemComponent implements OnInit {
  // Задача передаётся извне, на основе её полей отрисовывается mat-grid-list.
  @Input() todo: ITodo = {} as ITodo
  // Ключ родительского компонента, пердаётся из родителя, так как на разных компонентах задачу необходимо отрисовывать по-разному.
  @Input() parent: 'todosPage' | 'todoPage' = 'todosPage'
  //Массив для рендера плиток таблицы, который представляют собой плитки содержащие значения разных ключей объекта todo. (Присваивается при инициализации)
  tiles: ITile[] = []
  //Опции селекта статуса, как в компоненте создания задачи (CreateTodoComponent).
  statusOptions: string[] = ['По плану', 'Под угрозой', 'Отстаёт']
  // Флаг видимости инпута для изменения поля задачи - Исполнительб прямо со страницы со всеми задачами. 
  isInputVisible: boolean = false
  // Сигнал исполнителя задачи, для работы с инпутом, через который он меняется. 
  executor: WritableSignal<string> = signal('')
  //Цвета фона селекта приоритета и статуса задачи, для того, чтобы подчёркивать статус цветом.
  statusColor: 'red' | '#1bc31b' | '#ffba3b' | '' = ''
  priorityColor: '#71b7b0' | '#ffba3b' | 'rgb(207 31 251)' | '' = ''
  // Эмиттер, чтобы тригерить обновление задач на странцие с задачами, при удалении задачи. Некое подобие реактивности, неуверен, что это самый оптимальный способ.
  @Output() emitTodosUpdate: EventEmitter<void> = new EventEmitter()
  
  constructor(
    // Два сервиса для работы с хранилизщем и с задачами.
    private todosService: TodosService,
    private storage: StorageService
    ) {}

    // При инициализации на основе todo задаются плитки для рендера их в карточку задачи с помощью <mat-grid>. На странице детального просмотра название задачи отрисовывается вне сетки, а как отдельный заголовок карточки. 
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

    //Сигналу исполнителя присваивается значение исполнителя задачи.   
    this.executor.set(this.todo.executors)

    // Запускаются две функции, которые на основе switch case задают цвет заднего фона статуса задачи и приоритета.
    this.switchStatusColor()
    this.switchPriorityColor()
  }

  // Хендлер изменений инпута, через который меняется исполнитель задачи.
  executorChangeHandler(event: Event) {
    if((event.target as HTMLInputElement).value){
      this.executor.set((event.target as HTMLInputElement).value)
    }
  }

  // Метод непосредственно меняющий исполнителя задачи через сервис и делает input невидимым. 
  changeExecutor() {
    this.todosService.changeExecutor(this.executor(), this.todo)
    this.swithcInputVisible()
  }

  // Методы, отвечающие за смену статуса и приоритета задачи через сервис. После смены значения, запускают проверку фонового цвета селекта.
  statusChangeHandler(value: string) {
    this.todosService.changeStatus(value, this.todo)
    this.switchStatusColor()
  }
  
  priorityChangeHandler(value: string) {
    this.todosService.changePriority(value, this.todo)
    this.switchPriorityColor()
  }

  // Функции, которые н основе значения статуса и приоритета задают им соотетствующий цвет фона.
  switchStatusColor() {
    switch(this.todo.status.value) {
      case 'Под угрозой':
        this.statusColor = '#ffba3b'
        break
      case 'По плану':
        this.statusColor = '#1bc31b'
        break
      case 'Отстаёт':
        this.statusColor = 'red'
        break
    }
  }
  // 
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

  // Переключатель флага видимости инпута.
  swithcInputVisible() {
    this.isInputVisible = !this.isInputVisible
  }

  // Метод, который удаляет задачу, через сервис хранилища и запрашивает в родительский компонент обновление значения массива текущих задач.
  deleteTodo() {
    this.storage.deleteTodo(this.todo.id)
    this.emitTodosUpdate.emit()
  }

}
