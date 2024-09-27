import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiBrandListService } from '../service/api.brandListService.js';
import { ApiService } from '../service/api.service.js';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent {

  brands: any[] = []
  constructor(private service: ApiService){
    this.service.getData().subscribe(response =>{
      this.brands = response.data;
     // console.log(brands.results);
    })
  }

}
