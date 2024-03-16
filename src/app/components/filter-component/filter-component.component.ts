import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MySelectComponent } from '../Interface/my-select/my-select.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-filter-component',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,  
    FormsModule, 
    ReactiveFormsModule,
    MatCardModule,
    MySelectComponent,
    MatInputModule, 
    MatButtonModule,
    MatIconModule
  ],  
  templateUrl: './filter-component.component.html',
  styleUrl: './filter-component.component.scss'
})
export class FilterComponentComponent {
  // Три эмиттера событий, передают наверх демонтаж компонента, смену видимости компонента и изменение объекта фильтров.
  @Output() clearFiltersEmitter: EventEmitter<void> = new EventEmitter()
  @Output() closeEmitter: EventEmitter<void> = new EventEmitter()
  @Output() changesEmitter: EventEmitter<{
    status: string[], 
    executors: string[], 
    date: {
      day?: number[], 
      thisWeek?: number, 
      // nextWeek: number
    }}> = new EventEmitter()

    // Объект фильтров. Фильтрация происходит по статусу, исполнителю и дате дедлайна.
  filterProps = {
    status: [''],
    executors: [''], 
    date: {
      // day: [], 
      // thisWeek: 1, 
      // nextWeek: 1
    }} 

    // Снаруди компонент принимает флаг видимости и массив исполнителей текущих задач.
  @Input() visibility: boolean = false
  @Input() executors: string[] = []

  // Функция эмитирует наверх демонтаж панели фильтров.
  closeCardHandler() {
    this.closeEmitter.emit()
  }

  // Функция принимает изменения статуса, сохраняет их в поле статус объекта фильтра, и эммитит объект изменений наверх.
  statusFilterChangesHandler(event: string) {
    this.filterProps.status = [...event]
    this.changesEmitter.emit(this.filterProps)
  }
  
  // Функция принимает изменения исполнителя, сохраняет их в поле инсполнители объекта фильтра, и эммитит объект изменений наверх.
  executorChangesHandler(event: string) {
    const copyExecutors = [...event]
    this.filterProps.executors = copyExecutors
    this.changesEmitter.emit(this.filterProps)
  }
  
  // Функция принимает изменения даты дедлайна, сохраняет их в поле day поля date объекта фильтра, и эммитит объект изменений наверх.
  dateFilterChangesHandler(event: string) {
    // Массив для копированя массива выбранных дат, так как TS воспринимает его за строку, и не пускает к методам масива
    const datesArray: string[] = []
    // Текущий объект даты,  имеет массив дней, а также поля этой и следующей недели, но функционал для них пока не настроен.
    const result: {day: number[], thisWeek: number, nextWeek: number} = {day: [], thisWeek: 0, nextWeek: 0}

    // Цикл для клонирования массива event в массив datesArray
    for(let i = 0; i < event.length; i++) {
      datesArray.push(event[i])
    }

    // Далее проходимся по массиву и через конструкцию switch case, решаем, какому полю, какое значение присвоить
    datesArray.forEach(date => {
      switch(date){
        // Если выбранная опция Сегодня, то в массив day добавляем текущий день месяца через getDate()
        case 'Сегодня':
          result.day.push(new Date().getDate())
          break
          // Если выбранная опция Завтра, то в массив day добавляем текущий день месяца + 1, через getDate()
          case 'Завтра':
            result.day.push(new Date().getDate() + 1)
            break
            // Если выбранная опция Завтра, 
        // case 'На этой неделе':
          // result.thisWeek = new Date().getDay()
          // break
        // case 'На следующей неделе':
        //   result.nextWeek= new Date().getDay()
        //   break
    }
    })

    // Далее полю дата объекта фильтров присваивается объект result
    // Затем эмитируется изменение свойств фильтра. 
    this.filterProps.date = result
    this.changesEmitter.emit(this.filterProps)
    // this.changesEmitter.emit({...this.filterProps, date: {day: result.day, thisWeek: result.thisWeek}})
  }

  // Метод инициирующий демонтаж компонента наверх.
  clearFilters() {
    this.clearFiltersEmitter.emit()
  }  
}
