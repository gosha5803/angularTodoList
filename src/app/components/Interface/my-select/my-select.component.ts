import { Component, Input } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-my-select',
  standalone: true,
  imports: [
    MatSelectModule
  ],
  templateUrl: './my-select.component.html',
  styleUrl: './my-select.component.scss'
})
export class MySelectComponent {
  @Input() options: string[] = []
}
