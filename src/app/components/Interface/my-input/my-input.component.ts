import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-input',
  standalone: true,
  imports: [],
  templateUrl: './my-input.component.html',
  styleUrl: './my-input.component.scss'
})
export class MyInputComponent implements OnInit {
  @Input() placeholder: string = '' 
  
  ngOnInit(): void {
    const myInput = document.querySelector('.my-input')  
    console.log(myInput)
    if(myInput){
    }
  }
}
