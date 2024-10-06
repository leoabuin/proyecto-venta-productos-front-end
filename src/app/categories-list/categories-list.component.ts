import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiCategoryService } from '../service/categoryApi.service.js';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent {

  categories: any[] = []
  constructor(private service: ApiCategoryService){
    this.service.getCategoriesData().subscribe(response =>{
      this.categories = response.data;
    })
  }

}
