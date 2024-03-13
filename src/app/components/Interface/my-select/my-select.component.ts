import { Component, Input, Output } from '@angular/core';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { EventEmitter } from '@angular/core';

// Переиспользуемый select компонент, основан на select из Angular Material, главное, что он рендерить опции самостоятельно.
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
  // Массив опции, которые выпадают при клике на селект
  @Input() options: any[] = []
  // Плейсхолдер селекта и начальное значене, для отображения его выбранным.
  @Input() placeHolder: string = ''
  @Input() initialValue: string = ''
  //Эмиттер события, чтобы передавать изменение значения наверх, в родительский компонент.
  @Output() valueChange: EventEmitter<string> = new EventEmitter()

  constructor() {}

  // Функция обработки изменения текущего значения селекта пердаёт его наверх.
  changeHandler(event: string) {
    this.valueChange.emit(event)
  }
}
