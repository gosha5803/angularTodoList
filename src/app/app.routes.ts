import { Routes } from '@angular/router';
import { TodosPageComponent } from './pages/todos-page/todos-page.component';
import { TodoPageComponent } from './pages/todo-page/todo-page.component';

export const routes: Routes = [
    {path: '', component: TodosPageComponent},
    {path: 'todos/:id', component: TodoPageComponent},
    // {path: '**', component: TodosPageComponent}
];
