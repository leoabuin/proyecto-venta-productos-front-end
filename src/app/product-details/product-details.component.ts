import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiProductService } from '../service/productApi.service.js';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiService } from '../service/api.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Price {
  id: number;
  dateFrom: Date;
  dateUntil: Date;
  cost: number;
  productId: number;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  

  
  product: any;
  currentPrice: Price | undefined;

  constructor(private route: ActivatedRoute, private service: ApiProductService, private brandService: ApiService) {}
  productId: string | null = null;
  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id')
    if (productId) {
      this.loadProductDetails(productId);
    }
    
  }

  loadProductDetails(id: string): void {
    this.service.getProductbyId(id).subscribe({
      next: (response) => {
        this.product = response.data;
        this.currentPrice = this.getCurrentPrice(this.product.prices);
        console.log('Detalles del producto cargados con éxito:', this.product);

        this.loadBrandName(this.product.brand);
      },
      error: (err) => {
        console.error('Error al cargar los detalles del producto:', err);
      }
    });
  }

  loadBrandName(brandId: string): void {
    this.brandService.getBrandbyId(brandId).subscribe({
      next: (response) => {
        // Verifica si la respuesta contiene el objeto 'data'
        if (response && response.data && response.data.name) {
          this.product.brandName = response.data.name; // Accede al nombre de la marca
          console.log('Nombre de la marca cargado con éxito:', this.product.brandName);
        } else {
          console.warn('Respuesta de marca inesperada:', response);
        }
      },
      error: (err) => {
        console.error('Error al cargar el nombre de la marca:', err);
      }
    });
  }

  getCurrentPrice(prices: Price[]): Price | undefined {
    const today = new Date();
    console.log('Fecha actual:', today);
  
    
    console.log('Precios disponibles:', prices);
  
    const currentPrice = prices.find(price => {
      const priceStart = new Date(price.dateFrom);
      const priceEnd = new Date(price.dateUntil);
      
      console.log(`Comprobando precio: ${price.cost} desde ${priceStart} hasta ${priceEnd}`);
      
      return priceStart <= today && priceEnd >= today; 
    });
  
    console.log('Precio actual encontrado:', currentPrice);
    return currentPrice;
  }

}
