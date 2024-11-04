import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { LocalStorageService } from '../app/service/local-storage.service.js';
import { ApiUserService } from '../app/service/userApi.service.js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showMenu: boolean = false
  username: string | null = null // Añadir propiedad para el nombre de usuario
  errorMessages: string[] = []

  toggleMenu() {
    this.showMenu = !this.showMenu; 
  }

  closeMenu() {
    this.showMenu = false; // Cerrar el menú
  }

  
  constructor(private localStorageService: LocalStorageService, private service: ApiUserService, private router: Router) {
    this.username = this.localStorageService.getItem('username');
    console.log(this.username); 
  }


  
  logOut() {
    console.log('PROBANDO'); 
    this.service.logOut().subscribe({
      next: () => {
        localStorage.clear()
        //this.localStorageService.removeItem('username'); 
        this.username = null;
        console.log(this.username); 
        console.log('estamos dentro');  
        console.log(this.username)
      },
      error: (error: unknown) => { // Cambia aquí
        console.error('Error durante el logout:', error);
      }
    });
  }
   
  

  
}
