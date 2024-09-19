import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component.js';
import { LogInComponent } from './log-in/log-in.component.js';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },  // Página principal
    {path: 'login', component: LogInComponent}
];
