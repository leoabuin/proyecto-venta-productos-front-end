import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiProductService } from '../service/productApi.service.js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiCategoryService } from '../service/categoryApi.service.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../pipes/productFilter.pipe.js';
import { FooterComponent } from "../footer/footer.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../service/auth.service.js';

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
  imports: [NavbarComponent, CommonModule, RouterModule, ReactiveFormsModule, FormsModule, FilterPipe, FooterComponent, NgxPaginationModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  currentPrice: Price | undefined;
  filterProduct: string = '';


  products: any[] = []
  filteredProducts: any[] = []
  categories: any[] = []
  selectedCategory: number = 0
  public page: number = 0

  constructor(private service: ApiProductService, private router: Router, private categoryService: ApiCategoryService, public authService: AuthService) {
    this.service.getProductsData().subscribe(response => {
      this.products = response.data
      this.filteredProducts = this.products
    })


    this.categoryService.getCategoriesData().subscribe(response => {
      this.categories = response.data;
    });

  }


  getCurrentPrice(prices: Price[]): Price | undefined {
    if (!prices || prices.length === 0) return undefined;
    const sortedPrices = [...prices].sort((a, b) => b.id - a.id);
    const newestPrice = sortedPrices[0];
    console.log('El precio más nuevo (por ID) es:', newestPrice);
    return newestPrice;
  }


  filterProducts(): void {
    console.log('Filtrando productos con categoría seleccionada:', this.selectedCategory);
    if (Number(this.selectedCategory) !== 0) {
      this.filteredProducts = this.products.filter(product => {
        return Number(product.category) === Number(this.selectedCategory)
      })
    } else {
      this.filteredProducts = this.products
    }
  }
  goToProductDetails(product: any): void {
    this.router.navigate(['/product-details', product.id]);
  }

}
