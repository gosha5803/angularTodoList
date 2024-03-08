import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  logger() {
    alert('pokop')
  }
}
