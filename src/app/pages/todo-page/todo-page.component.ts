import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ITodo, TodosService } from '../../services/todos.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//Страница детального просмотра задачи.
@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatGridListModule,
    TodoItemComponent,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './todo-page.component.html',
  styleUrl: './todo-page.component.scss'
})
export class TodoPageComponent implements OnInit{
  // Задача присваивается при инициализации.
  todo: ITodo = {} as ITodo
  // Плитки для отрисовки таблици с названиями полей задачи.
  tiles: string[] = ['Исполнитель', 'Срок выполнения', 'Приоритет', 'Статус']
  // Сигнал описания задачи, чтобы добавить описание как в asana в странице детального просмотра.
  todoDescription: WritableSignal<string> = signal('')

  constructor(
    // сервисы хранилища, задач, а также роутер для получения id текущей задачи из URL.
    private storage: StorageService,
    private router: ActivatedRoute,
    private todosService: TodosService
  ) {}

    ngOnInit(): void {
      // При инициализации достаём параметр id из URL по нему через сервис хранилища ищем задачу и присваиваем полю todo класса.
        const id = this.router.snapshot.paramMap.get('id')
        if(id) {
          const todo = this.storage.getTodoById(+id)
          if(todo) {
            this.todo = todo 
          }
        } 

        // Если у задачи есть какое-то описание, то его значение устанавливается как значение сигнала. В компоненте сравнивается значение сигнала и поля description у задачи, если они совпадают, значит описание не изменилось и кнопка подтверждения изменений неактивна.
        if(this.todo.description) {
          this.todoDescription.set(this.todo.description)
        }

    }

    // Хендлер изменения сигнала description
    descriptionChangesHandler(event: Event) {
      if((event.target as HTMLInputElement).value){
        this.todoDescription.set((event.target as HTMLInputElement).value)
      }
    }

    // Хендлер, который сохраняет изменения описания в задачу через сервис.
    changeTodoDescription() {
      this.todosService.changeDescription(this.todoDescription(), this.todo)
    }

}
