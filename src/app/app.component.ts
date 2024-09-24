import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component.js";
import { LogInComponent } from './log-in/log-in.component.js';
<<<<<<< HEAD
import { BrandComponent } from './brand/brand.component.js';
=======
import { NosotrosComponent } from "./nosotros/nosotros.component";
// import { GamingComponent } from "./gaming/gaming.component";
import { AddcategoriesComponent } from "./addcategories/addcategories.component";

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet, HomeComponent,LogInComponent,BrandComponent ],
=======
  imports: [RouterOutlet, HomeComponent, LogInComponent, NosotrosComponent, GamingComponent, AddcategoriesComponent],
>>>>>>> origin/master
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyecto-venta-productos-front-end';
}
