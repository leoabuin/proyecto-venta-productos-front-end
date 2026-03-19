import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiUserService } from '../service/userApi.service';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    this.userApiService.getFavorites().subscribe({
      next: (response) => {
        if (response && response.status === 'success') {
          this.favorites = response.data;
        } else {
          this.favorites = response || []; // Fallback depending on exact response structure
        }
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
        // Filtrar el producto de la lista local en lugar de volver a cargar todo
        this.favorites = this.favorites.filter(fav => fav.idProduct !== productId);
      },
      error: (error) => {
        console.error('Error removing favorite', error);
        alert('Hubo un error al eliminar el producto de tus favoritos.');
      }
    });
  }
}
