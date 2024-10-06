import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../service/api.service.js';
import { FilterPipe } from '../pipes/filter.pipe.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FilterPipe, FormsModule],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent {
  filterBrand: string = '';
  brands: any[] = []
  constructor(private service: ApiService){
    this.service.getData().subscribe(response =>{
      this.brands = response.data;
     // console.log(brands.results);
    })
  }

}
