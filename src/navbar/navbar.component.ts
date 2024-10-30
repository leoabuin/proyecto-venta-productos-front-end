import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { LocalStorageService } from '../app/service/local-storage.service.js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showMenu: boolean = false;
  username: string | null = null; // Añadir propiedad para el nombre de usuario


  toggleMenu() {
    this.showMenu = !this.showMenu; 
  }

  closeMenu() {
    this.showMenu = false; // Cerrar el menú
  }

  
  
  constructor(private localStorageService: LocalStorageService) {
    this.username = this.localStorageService.getItem('username'); // Cargar el nombre del usuario desde localStorage
    console.log(this.username); // Verifica que esto muestre el nombre de usuario
  }

  logOut() {
    this.username = null;
    this.localStorageService.removeItem('username');
   // this.router.navigate(['/']); // Redirige a la página de inicio
  }

  
}
