import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiProductService } from '../service/productApi.service.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {

  
  products: any[] = []
  constructor(private service: ApiProductService){
    this.service.getProductsData().subscribe(response =>{
      this.products = response.data;
    })
  }



}
