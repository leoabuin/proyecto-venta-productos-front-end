import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component.js";
import { LogInComponent } from './log-in/log-in.component.js';
import { NosotrosComponent } from "./nosotros/nosotros.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, LogInComponent, NosotrosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyecto-venta-productos-front-end';
}
