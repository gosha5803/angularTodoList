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
import { FilterComponentComponent } from '../../components/filter-component/filter-component.component';

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
    RouterLink,
    FilterComponentComponent
  ],
})
export class TodosPageComponent implements OnInit {
  // Массив задач дл отрисовки
  todos!: ITodo[];
  // Массив плиток с названиями полей таблицы/задачи
  tiles: ITile[] = []
  // Свойство сортироки и направление сортировки
  sortProp: string | 'Срок' | 'Статус' | 'Исполнитель'= ''
  sortDirection: 1 | -1 = 1
  // Флаг отвечающий за отображение панели с фильтром, чтобы она запоминала своё состояние по флагу она скрывается с помощью свойства display: none;
  showFilterPanel: boolean = false
  //  Массив существующих лиц ответственных за задачи передаётся в селектор для фильтрации по имполнителям
  existingExecutors: string[] = []
  // Флаг активности фильтра, по которому, кнопка фильтра меняет свои стили.
  filterIsActive: boolean = false
  // Флаг по которому монтируется панель фильтров, для того, чтобы очистить все фильтры, я решил просто демонтировать данную панель.
  mountFilterPanel: boolean = true
  
  
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
    console.log(this.todos)
    // Обновляем состояние массива исполнителей, через специальный метод.
    this.updateExecutors()
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

  // Функция для обновления списка исполнителей, итерируется по текущим задачам и добавляет исполнителя задачи, если он существует в массив исполнителей.
  updateExecutors() {
    if(this.todos)
    this.todos.forEach(todo => {
      if(todo.executors)
      this.existingExecutors.push(todo.executors)
    })
  }

  // Фцнкция фильтрации принимает в себя событие - объект с полями массив статусов, массив исполнителей и объект даты  с ключами день и неделя.
  filterHandler(event: {status: string[], executors: string[], date: {
    day?: number[], 
    thisWeek?: number, 
    // nextWeek: number
  }}) {
    // Во первых, при любом изменении фильтров, функция заново запрашивает все задачи и прогоняет их через фильтры, также переводит флаг активности фильтров в ноль. Так, если ни одно из условий фильтрации не сработает, у нас останутся неотфильтрованные задачи и флаг активности фильтра false
    this.updateTodos()
    this.switchFilterIsActive(false)
    
    // Из-за проблем c TS, пришлось вложить в массив со статусами под 0 индексом вложить непосредственно сами статусы. Поэтому, если под 0 индесом массива, который сам нах-ся под 0 индексом, что-то есть, срабатывает фильтрация, которая проверяет, включает ли в себя массив статусов значение статуса каждой задачи, если да, то она возвращается в массив задач иначе нет. 
    if(event.status[0]){
      this.todos = this.todos?.filter(todo => event.status.includes(todo.status.value))
      // Флаг активности фильтра переводится в значение true.
      this.switchFilterIsActive(true)
    }
    // Если в массиве исполнителей под первым индексом истинное значение, то срабатывает фильтрация по исполнителю. 
    if(event.executors[0]) {
      this.todos = this.todos?.filter(todo => event.executors.includes(todo.executors))
      this.switchFilterIsActive(true)
    }
    
    // Если у ключа день объекта даты под 0 индексом истинное значение, то проверяется содержит ли массив дня(ткда кладутся значения сегодняшнего числа и завтрашнего), значения даты дедлайна задачи приведенной к getDate()
    if(event.date.day?.at(0)) {
      this.todos = this.todos?.filter(todo => event.date.day?.includes(new Date(todo.deadline.end.number).getDate()))
      this.switchFilterIsActive(true)
    } 
    
    // Функционал не доработан!!
    // Елси ключ текущая неделя объекта дата истнинное значение, то осуществляется проверка.
    // Сначала получаем день предыдущий от даты дедлайна, передавай числовое знаечние даты в конструктор и уменьшая его на один день, так как недели в России считаются с понедельника. То есть вместо воскресенья мы получим субботу, а метод getDay() вернёт нам не 0, а 6. Но чтобы сравнение было правильным, мы и значение должны уменьшить на 1. Так как метод getDay() возвращает день недели, то дни следующей недели, будут меньше, чем 
    // if(event.date.thisWeek) {
    //   console.log(event.date.thisWeek)
    //   this.todos = this.todos?.filter(todo => {
    //     if(event.date.thisWeek && event.date.thisWeek - 1 <= new Date(todo.deadline.end.number - 1000 * 60 * 60 * 24).getDay()) {
    //       return todo
    //     }
    //     return null
    //   })
    //   this.switchFilterIsActive(true)
    // }
  }

  // Метод меняет видимость панели филтров на противоположную, а также если панель фильтров не вмонтирована в разметку и её стиль display: none, метод переводит флаг монтирования в true и делает switch флага видимости на true.
  switchFilterVisibility() {
    if(!this.showFilterPanel && !this.mountFilterPanel) {
      this.mountFilterPanel = true
    }
    this.showFilterPanel = !this.showFilterPanel
  }

  // Метод меяет флаг активности фильтров по аргументу.
  switchFilterIsActive(value: boolean) {
    this.filterIsActive = value
  }

  // Метод демонтажа панели фильтров меняет видимость панели фильтров, флаг монтажа панели ставит в false, флаг активности фильтров в false, 
  // И вызывает метод обновления задач, так как фильтры снимаются. 
  demountFilterPanel() {
    this.switchFilterVisibility()
    this.mountFilterPanel = false
    this.switchFilterIsActive(false)
    this.updateTodos()
  }
}