import { Component, EventEmitter, Output, Signal, WritableSignal, signal } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MySelectComponent } from '../Interface/my-select/my-select.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorStateMatcher, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { DateParser } from '../../utils/DateParser';
import { FormControl, FormGroupDirective, NgForm, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TodosService } from '../../services/todos.service';
import { MatDialogRef } from '@angular/material/dialog';

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
  statusOptions: string[] = ['По плану', 'Под угрозой', 'Отстаёт']
  priorityOptions: string[] = ['Высокий', 'Средний', 'Низкий']
  todoTitle: WritableSignal<string> = signal('')
  executor: WritableSignal<string> = signal('')
  priority: string = ''
  status: string = '' 
  deadLine: string = ''

  titleFormControl = new FormControl('', [Validators.required])
  matcher = new MyErrorStateMatcher()

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    public dialogRef: MatDialogRef<CreateTodoFormComponent>,
    private dateParser: DateParser,
    private todo: TodosService
  ) {}

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

  deadLineChangesHandler(event: any) {
    const start: string = event.target._model.selection.start
    const end: string = event.target._model.selection.end
    
    
    const startDate = this.dateParser.parseDate(start)
    const endDate = this.dateParser.parseDate(end)
    
    this.deadLine = startDate + ' - ' + endDate
  }

  submitHandler(event: SubmitEvent) {
    event.preventDefault()
    if(this.titleFormControl.hasError('required')) {
      console.log('Ошибка')
      return
    }

    this.todo.createTodo({
      title: this.todoTitle(),
      deadline: this.deadLine,
      status: this.status,
      priority: this.priority,
      executors: this.executor()
    })

    this.dialogRef.close()
  }
}
