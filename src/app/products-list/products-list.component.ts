import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiProductService } from '../service/productApi.service.js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {

  
  products: any[] = []
  constructor(private service: ApiProductService, private router: Router){
    this.service.getProductsData().subscribe(response =>{
      this.products = response.data;
    })
  }


  goToProductDetails(product: any): void {
    this.router.navigate(['/product-details', product.id]);
  }

}
