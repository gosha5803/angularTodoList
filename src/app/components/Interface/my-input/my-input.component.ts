import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-my-input',
  standalone: true,
  imports: [],
  templateUrl: './my-input.component.html',
  styleUrl: './my-input.component.scss'
})
export class MyInputComponent {
  @Input() placeholder: string = '' 
}
