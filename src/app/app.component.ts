import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { TodosPageComponent } from './pages/todos-page/todos-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TodoItemComponent,
    TodosPageComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angularTodoList';
}
