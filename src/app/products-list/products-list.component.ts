import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiProductService } from '../service/productApi.service.js';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // Añadido ActivatedRoute
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

  constructor(
    private service: ApiProductService,
    private router: Router,
    private categoryService: ApiCategoryService,
    public authService: AuthService,
    private route: ActivatedRoute // Inyectado para detectar clics en la Navbar
  ) {
    // 1. Cargar categorías
    this.categoryService.getCategoriesData().subscribe(response => {
      this.categories = response.data;
    });

    // 2. Suscribirse a los parámetros de la URL (Género, SALE, etc.)
    this.route.queryParams.subscribe(params => {
      this.cargarYFiltrar(params);
    });
  }

  private cargarYFiltrar(params: any): void {
    this.service.getProductsData().subscribe(response => {
      let data = response.data;
      console.log('DATOS QUE VIENEN DE LA API:', data); // <--- MIRA ESTO EN LA CONSOLA
      console.log('FILTRO QUE RECIBO DE NAVBAR:', params); // <--- Y ESTO

      if (this.authService.getRole() !== 'Empleado') {
        data = data.filter((p: any) => p.isContinued === true);
      }

      if (params['gender']) {
        const genderFilter = params['gender'].toLowerCase();
        data = data.filter((p: any) => {
          // Probamos con p.gender directamente
          const val = String(p.gender).toLowerCase();
          console.log(`Comparando producto: ${p.name} | Género: ${val} | Buscando: ${genderFilter}`);
          return val === genderFilter;
        });
      }

      if (params['offer'] === 'true') {
        data = data.filter((p: any) => p.isOffer === true);
      }

      this.products = data;
      this.filterProducts();
    });
  }

  getCurrentPrice(prices: Price[]): Price | undefined {
    if (!prices || prices.length === 0) return undefined;
    const sortedPrices = [...prices].sort((a, b) => b.id - a.id);
    return sortedPrices[0];
  }

  filterProducts(): void {
    // Usamos 'products' como base porque ya viene filtrado por Género/Oferta/Rol
    if (Number(this.selectedCategory) !== 0) {
      this.filteredProducts = this.products.filter(product => {
        return Number(product.category) === Number(this.selectedCategory);
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  goToProductDetails(product: any): void {
    this.router.navigate(['/product-details', product.id]);
  }
}
