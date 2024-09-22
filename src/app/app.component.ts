import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component.js";
import { LogInComponent } from './log-in/log-in.component.js';
import { BrandComponent } from './brand/brand.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent,LogInComponent,BrandComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyecto-venta-productos-front-end';
}
