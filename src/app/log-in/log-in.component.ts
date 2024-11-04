import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiUserService } from '../service/userApi.service.js';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../service/local-storage.service.js';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
 
  userData = {
    userName: '',
    password:''
  }

  errorMessages: string[] = [];
  constructor(private service: ApiUserService, 
  private router:Router,
  private localStorageService: LocalStorageService
  ){}

  submitForm(){
    this.errorMessages = [];
    this.service.logInUser(this.userData).subscribe({
      next: (response) => {
        console.log('Inicio de sesion con exito:', response);
        this.localStorageService.setItem('username', response.data.userName)
        this.localStorageService.setItem('idUsuario', response.data.id )
        console.log(this.localStorageService.getItem('username'))
        console.log(this.localStorageService.getItem('userId'))
        this.router.navigate(['/home'])

      },
      error: (error) => {
        console.error('Error al inicio de sesion:', error);
        if (error.status === 400 && error.error && Array.isArray(error.error.error)) {
          this.errorMessages = error.error.error.map((err: any) => {
            if (err.path) {
              return `Error en ${err.path[0]}: ${err.message}`;
            } else {
              return `Error: ${err.message}`;
            }
          });
        } else {
          this.errorMessages.push('Error desconocido. Intente nuevamente.');
        }
      }
    })
    
  }



}
