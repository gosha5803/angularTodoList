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
  todo: ITodo = {} as ITodo
  tiles: string[] = ['Исполнитель', 'Срок выполнения', 'Приоритет', 'Статус']
  todoDescription: WritableSignal<string> = signal('')

  constructor(
    private storage: StorageService,
    private router: ActivatedRoute,
    private todosService: TodosService
  ) {}

    ngOnInit(): void {
        const id = this.router.snapshot.paramMap.get('id')
        if(id) {
          const todo = this.storage.getTodoById(+id)
          if(todo) {
            this.todo = todo 
          }
        } 

        if(this.todo.description) {
          this.todoDescription.set(this.todo.description)
        }

    }

    descriptionChangesHandler(event: Event) {
      if((event.target as HTMLInputElement).value){
        this.todoDescription.set((event.target as HTMLInputElement).value)
        console.log(this.todoDescription())
      }
    }

    changeTodoDescription() {
      this.todosService.changeDescription(this.todoDescription(), this.todo)
      
    }

}
