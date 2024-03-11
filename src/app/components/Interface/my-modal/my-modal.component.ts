import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { CreateTodoFormComponent } from '../../create-todo-form/create-todo-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './my-modal.component.html',
  styleUrl: './my-modal.component.scss'
})
export class MyModalComponent {
 

  constructor(
    public modal: MatDialog
  ) {}

  openModal() {
    this.modal.open(CreateTodoFormComponent)
  }

}
