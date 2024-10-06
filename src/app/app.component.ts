import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component.js";
import { LogInComponent } from './log-in/log-in.component.js';
import { AddbrandsComponent } from './addbrands/addbrands.component.js';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { NosotrosComponent } from "./nosotros/nosotros.component";

import { AddcategoriesComponent } from "./addcategories/addcategories.component";
import { BrandListComponent } from './brand-list/brand-list.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, LogInComponent, NosotrosComponent,AddbrandsComponent ,AddcategoriesComponent,BrandListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proyecto-venta-productos-front-end';
}
