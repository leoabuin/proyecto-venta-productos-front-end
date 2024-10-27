import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiProductService } from '../service/productApi.service.js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

interface Price {
  id: number;
  dateFrom: Date;
  dateUntil: Date;
  cost: number;
  productId: number;
}

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  currentPrice: Price | undefined;

  
  products: any[] = []
  constructor(private service: ApiProductService, private router: Router){
    this.service.getProductsData().subscribe(response =>{
      this.products = response.data;
    })
  }


  goToProductDetails(product: any): void {
    this.router.navigate(['/product-details', product.id]);
  }

  getCurrentPrice(prices: Price[]): Price | undefined {
    const today = new Date();
    return prices.find(price => {
      const priceStart = new Date(price.dateFrom);
      const priceEnd = new Date(price.dateUntil);
      return priceStart <= today && priceEnd >= today; 
    });
  }

}
