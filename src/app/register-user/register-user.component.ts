import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiUserService } from '../service/userApi.service.js';

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

  errorMessages: string[] = [];
  constructor(private service: ApiUserService){}

  submitForm(){
    this.errorMessages = [];
    this.service.createUser(this.userData).subscribe({
      next: (response) => {
        console.log('Usuario registrado con exito:', response);

      },
      error: (error) => {
        console.error('Error al registrar el usuario:', error);
        if (error.status === 400 && error.error.errors) {
          this.errorMessages = error.error.errors.map((err: any) => {
            return `Error en ${err.path[0]}: ${err.message}`;
          });
        }else {
          // Manejo de otros errores, si es necesario
          this.errorMessages.push('Error desconocido. Intente nuevamente.');
        }
      }
    });

  }

}
