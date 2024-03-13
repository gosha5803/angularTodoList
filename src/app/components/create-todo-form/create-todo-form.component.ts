import { Component, EventEmitter, Output, Signal, WritableSignal, signal } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MySelectComponent } from '../Interface/my-select/my-select.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorStateMatcher, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { DateParser } from '../../utils/DateParser';
import { FormControl, FormGroupDirective, NgForm, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IDeadline, TodosService } from '../../services/todos.service';
import { MatDialogRef } from '@angular/material/dialog';

//Класс для валидации формы, на запрлнение необходимых полей, из примера на AngularMaterial
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-create-todo-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MySelectComponent,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule, 
    FormsModule
  ],
  providers: [
    provideNativeDateAdapter(),
    DateParser
  ],
  templateUrl: './create-todo-form.component.html',
  styleUrl: './create-todo-form.component.scss'
})
export class CreateTodoFormComponent {
  //Опции статуса задачи и приоритета, для передачи их в переиспользуемый MySelect компонент, который отрисует их, как опции тега select
  statusOptions: string[] = ['По плану', 'Под угрозой', 'Отстаёт']
  priorityOptions: string[] = ['Высокий', 'Средний', 'Низкий']
  //Промежуточные состояния всех полей задачи для связывания их в форме. 
  todoTitle: WritableSignal<string> = signal('')
  executor: WritableSignal<string> = signal('')
  priority: string = ''
  status: string = ''
  deadLine: IDeadline = {start: '', end: {string: '', number: 0}} as IDeadline

  //Валидация полей
  titleFormControl = new FormControl('', [Validators.required])
  matcher = new MyErrorStateMatcher()

  constructor(
    // Импорт референса модального окна, чтобы закрывать его из формы для создания задачи.
    public dialogRef: MatDialogRef<CreateTodoFormComponent>,
    
    private dateParser: DateParser,
    private todo: TodosService
  ) {}

  //Значения всех полей, сохраняются в промежуточные значения свойств класса, и по одном и тому же принципу и только при Submit'e формы вызывается метод createTodo у сервиса, работающего с Todo.
  titleChangeHandler(event: Event) {
    if((event.target as HTMLInputElement).value){
      this.todoTitle.set((event.target as HTMLInputElement).value)
    }
  }

  priorityChangesHandler(value: string) {
    this.priority = value
  }
  
  statusChangesHandler(value: string) {
    this.status = value
  }

  executorChangeHandler(event: Event) {
    if((event.target as HTMLInputElement).value){
      this.executor.set((event.target as HTMLInputElement).value)
    }
  }

  //У дедлайна, чуть более сложная лгика присвоения, так как поле end дедлайна содержит в том числе числовое значение даты, для того, чтобы сделать возможной сортировку по дедлайну.
  deadLineChangesHandler(event: any) {
    //Извлечение по документации AngularMaterial
    const start: string = event.target._model.selection.start
    const end: string = event.target._model.selection.end
    
    //Парсим дату к необходимому формату через собственную утилиту из папки utils.
    const startDate = this.dateParser.parseDate(start)
    const endDate = this.dateParser.parseDate(end)
    
    //Задаём значение дедлайна.
    this.deadLine = {
      start: startDate.stringDate,
      end: {
        string: endDate.stringDate,
        number: endDate.numberDate
      }
    }
  }

  //При сабмите формы останавлитваем дефолтное поведение, проверяем поле Название задачи на содержание и, если ошибок нет, то передаём объект для создания задачи в метод сервиса и завкрываем модальное окно.
  submitHandler(event: SubmitEvent) {
    event.preventDefault()
    if(this.titleFormControl.hasError('required')) {
      return
    }

      this.todo.createTodo({
      title: this.todoTitle(),
      deadline: this.deadLine,
      status: this.status,
      priority: this.priority,
      executors: this.executor(),
      description: ''
    })

    this.dialogRef.close()
  }
}
