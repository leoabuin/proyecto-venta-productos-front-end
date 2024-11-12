import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { LocalStorageService } from '../app/service/local-storage.service.js';
import { ApiUserService } from '../app/service/userApi.service.js';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  showMenu: boolean = false
  username: string | null = null
  userId: number | null = null
  errorMessages: string[] = []

  toggleMenu() {
    this.showMenu = !this.showMenu; 
  }

  closeMenu() {
    this.showMenu = false; // Cerrar el menú
  }

  
  constructor(private localStorageService: LocalStorageService, private service: ApiUserService, private router: Router) {

  }

  ngOnInit() {
    this.username = this.localStorageService.getItem('username');
    const userIdFromStorage = this.localStorageService.getItem('idUsuario');
    this.userId = userIdFromStorage ? parseInt(userIdFromStorage, 10) : null;
    console.log(this.username)
  }


  
  
  logOut() {
    console.log('PROBANDO'); 
    this.service.logOut().subscribe({
      next: (response) => {
        localStorage.clear()
        console.log(response.message);
        this.username = null;
        //this.localStorageService.removeItem('username'); 
        console.log(this.username);  
        console.log(this.username)
      },
      error: (error: unknown) => { // Cambia aquí
        console.error('Error durante el logout:', error);
      }
    });
  }

    

  
}
