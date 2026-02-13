import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { LocalStorageService } from '../app/service/local-storage.service.js';
import { ApiUserService } from '../app/service/userApi.service.js';
import { AuthService } from '../app/service/auth.service.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showMenu: boolean = false
  username: string | null = null
  userId: number | null = null
  errorMessages: string[] = []
  cartCount: number = 0
  searchTerm: string = ''

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false; // Cerrar el menú
  }


  constructor(private localStorageService: LocalStorageService,
    private service: ApiUserService,
    private router: Router,
    public authService: AuthService) {

  }

  ngOnInit() {
    this.username = this.localStorageService.getItem('username');
    const userIdFromStorage = this.localStorageService.getItem('idUsuario');
    this.userId = userIdFromStorage ? parseInt(userIdFromStorage, 10) : null;
    this.updateCartCount();
    console.log(this.username)
  }




  logOut() {
    this.service.logOut().subscribe({
      next: (response) => {
        localStorage.clear()
        console.log(response.message)
        this.username = null
        //this.localStorageService.removeItem('username'); 
        console.log(this.username);
        console.log(this.username)
        this.router.navigate(['/home'])
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




}
