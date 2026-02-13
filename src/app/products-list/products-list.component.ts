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
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component.js';

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
  imports: [NavbarComponent, CommonModule, RouterModule, ReactiveFormsModule, FormsModule, FilterPipe, FooterComponent, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {
  currentPrice: Price | undefined;
  filterProduct: string = '';
  isLoading: boolean = false;
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
  this.isLoading = true
  this.filterProduct = params['search'] || ''
  this.service.getProductsData().subscribe({
    next: (response) => {
      let data = response.data;
      
      // Lógica de filtrado por Rol
      if (this.authService.getRole() !== 'Empleado') {
        data = data.filter((p: any) => p.isContinued === true);
      }

      // Lógica de filtrado por Género
      if (params['gender']) {
        const genderTarget = String(params['gender']).toLowerCase();
        data = data.filter((p: any) => String(p.gender).toLowerCase() === genderTarget);
      }

      // Lógica de filtrado por Oferta
      if (params['offer'] === 'true') {
        data = data.filter((p: any) => p.isOffer === true);
      }

      this.products = data;
      this.filterProducts();

      // 2. Apagamos el spinner con un pequeño delay opcional
      // para que la transición no sea brusca (UX)
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    error: (err) => {
      console.error('Error al cargar productos:', err);
      this.isLoading = false; // 3. También lo apagamos si hay error
    }
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

  resetFilters(): void {
    this.filterProduct = ''; // Limpia el buscador de texto
    this.selectedCategory = 0; // Vuelve el select a "Todas"

    // Si estás usando parámetros de ruta ( gender/offer ), los limpiamos navegando a la ruta base
    this.router.navigate(['/products'], { queryParams: {} });

    // Opcional: Si el filtro de categoría no se dispara solo con la navegación, forzalo:
    this.filterProducts();
  }

  goToProductDetails(product: any): void {
    this.router.navigate(['/product-details', product.id]);
  }
}
