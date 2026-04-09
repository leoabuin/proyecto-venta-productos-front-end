import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiUserService } from '../service/userApi.service.js';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer.component.js';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss']
})
export class FavoritesListComponent implements OnInit {
  favorites: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private userApiService: ApiUserService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    this.errorMessage = '';
    this.userApiService.getFavorites().subscribe({
      next: (response) => {
        // La API devuelve { message: '...', data: [...] }
        this.favorites = response.data || response || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching favorites', error);
        this.errorMessage = 'No se pudieron cargar tus favoritos. Intenta nuevamente más tarde.';
        this.isLoading = false;
      }
    });
  }

  removeFavorite(productId: number) {
    this.userApiService.removeFavorite(productId).subscribe({
      next: () => {
        // Filtrar por .id que es el campo correcto de la entidad Product
        this.favorites = this.favorites.filter(fav => fav.id !== productId);
      },
      error: (error) => {
        console.error('Error removing favorite', error);
        alert('Hubo un error al eliminar el producto de tus favoritos.');
      }
    });
  }

  getCurrentPrice(prices: any[]): number | null {
    if (!prices || prices.length === 0) return null;
    const sorted = [...prices].sort((a, b) => b.id - a.id);
    return sorted[0].cost;
  }
}
