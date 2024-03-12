import { Component, Input, Output } from '@angular/core';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-my-select',
  standalone: true,
  imports: [
    MatSelectModule,
    MatFormField
  ],
  templateUrl: './my-select.component.html',
  styleUrl: './my-select.component.scss'
})
export class MySelectComponent {
  @Input() options: string[] = []
  @Input() placeHolder: string = ''
  @Input() initialValue: string = ''
  @Output() valueChange: EventEmitter<string> = new EventEmitter()

  constructor() {}

  changeHandler(event: string) {
    this.valueChange.emit(event)
  }
}
