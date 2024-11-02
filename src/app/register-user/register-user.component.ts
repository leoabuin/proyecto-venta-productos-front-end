import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiUserService } from '../service/userApi.service.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.scss'
})
export class RegisterUserComponent {

  userData = {
    dni: '',
    name:'',
    surname:'',
    mail:'',
    phoneNumber:'',
    adress:'',
    rol:'',
    userName:'',
    password:''
  }

  isAccountCreated: boolean = false;
  errorMessages: string[] = [];
  constructor(private service: ApiUserService, private router:Router){}

  submitForm(){
    this.errorMessages = [];
    this.service.createUser(this.userData).subscribe({
      next: (response) => {
        console.log('Usuario registrado con exito:', response);
        this.isAccountCreated = true;
      },
      error: (error) => {
        console.error('Error al registrar el usuario:', error);
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
    });
    
  }

  closeModal() {
    this.isAccountCreated = false;
    this.router.navigate(['/login']);
  }


  
}
