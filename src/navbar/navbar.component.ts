import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { LocalStorageService } from '../app/service/local-storage.service.js';
import { ApiUserService } from '../app/service/userApi.service.js';
import { AuthService } from '../app/service/auth.service.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  showMenu: boolean = false;           // Controla el menú de Perfil
  showGestionMenu: boolean = false;    // Controla el menú de Gestión (Nuevo)

  username: string | null = null;
  userId: number | null = null;
  errorMessages: string[] = [];
  cartCount: number = 0;
  searchTerm: string = '';

  constructor(
    private localStorageService: LocalStorageService,
    private service: ApiUserService,
    private router: Router,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.username = this.localStorageService.getItem('username');
    const userIdFromStorage = this.localStorageService.getItem('idUsuario');
    this.userId = userIdFromStorage ? parseInt(userIdFromStorage, 10) : null;
    this.updateCartCount();

    // Escuchar cambios en el carrito si se dispara un evento personalizado
    window.addEventListener('cart-updated', () => this.updateCartCount());
  }

  // --- LÓGICA DE MENÚS POR CLIC ---

  toggleMenu() {
    this.showMenu = !this.showMenu;
    if (this.showMenu) this.showGestionMenu = false; // Cerramos el otro si abrimos este
  }

  toggleGestionMenu() {
    this.showGestionMenu = !this.showGestionMenu;
    if (this.showGestionMenu) this.showMenu = false; // Cerramos el otro si abrimos este
  }

  closeAllMenus() {
    this.showMenu = false;
    this.showGestionMenu = false;
  }

  // --- ACCIONES ---

  logOut() {
    this.service.logOut().subscribe({
      next: (response) => {
        localStorage.clear();
        this.username = null;
        this.userId = null;
        this.closeAllMenus();
        this.router.navigate(['/home']);
      },
      error: (error: unknown) => {
        console.error('Error durante el logout:', error);
      }
    });
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartCount = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
  }

  onSearchChange() {
    this.router.navigate(['/products'], {
      queryParams: { search: this.searchTerm },
      queryParamsHandling: 'merge'
    });
  }

  isMenuOpen = false;

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}