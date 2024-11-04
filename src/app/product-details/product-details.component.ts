import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiProductService } from '../service/productApi.service.js';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiService } from '../service/api.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component.js';
import { LocalStorageService } from '../service/local-storage.service.js';

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
  imports: [NavbarComponent, FormsModule, CommonModule, FooterComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit{
  

  
  product: any
  currentPrice: Price | undefined
  quantity: number = 1
  stock:number = 0

  constructor(
    private route: ActivatedRoute, 
    private service: ApiProductService, 
    private brandService: ApiService, 
    private localStorageService: LocalStorageService) {}

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
        this.currentPrice = this.getCurrentPrice(this.product.prices)
        this.stock = this.product.stock
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

  incrementQuantity(): void {
    if (this.quantity < this.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) { 
      this.quantity--;
    }
  }
  
  addToCart(): void {
    const cartItem = {
      productId: this.product.id,
      quantity: this.quantity,
      item_price: (this.currentPrice ? this.currentPrice.cost : 0) * this.quantity,
    };


    let cart = JSON.parse(this.localStorageService.getItem('cart') || '[]')
    let cartToshow = JSON.parse(this.localStorageService.getItem('cartToshow') || '[]')

    const existingItemIndex = cart.findIndex((item: any) => item.productId === cartItem.productId)

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += this.quantity;
    } else {
      cart.push(cartItem)
    }

    const productDetails = {
      productId: this.product.id,
      name: this.product.name,
      imagen: this.product.imagen, 
      quantity: this.quantity,
      item_price: (this.currentPrice ? this.currentPrice.cost : 0) * this.quantity,
    };
  

    const existingShowIndex = cartToshow.findIndex((item: any) => item.productId === productDetails.productId)
  
    if (existingShowIndex > -1) {

      cartToshow[existingShowIndex].quantity += this.quantity
      cartToshow[existingShowIndex].item_price += productDetails.item_price
    } else {
      cartToshow.push(productDetails)
    }

 
    this.localStorageService.setItem('cart', JSON.stringify(cart))
    this.localStorageService.setItem('cartToshow', JSON.stringify(cartToshow))

    console.log('Producto agregado al carrito:', cartItem)
    console.log('Carrito actualizado:', cart)
    console.log('Carrito a mostrar actualizado:', cartToshow);
  }

  

}
