import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table'

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.scss'
})
export class TodosPageComponent {

}
