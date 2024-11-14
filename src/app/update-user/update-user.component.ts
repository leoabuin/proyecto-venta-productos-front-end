import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiUserService } from '../service/userApi.service.js';
import { LocalStorageService } from '../service/local-storage.service.js';

export interface User {
  id:number
  mail: string;
  userName: string;
  phoneNumber:string,
  adress:string

}

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent implements OnInit {

  user: User = {
    id:0,
    mail: '',
    userName: '',
    phoneNumber:'',
    adress:''
  }

  errorMessages: string[] = [];
  isSuccessModalOpen = false;
  showUpdateUser:boolean = false;


  constructor(
    private userService: ApiUserService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}


  ngOnInit(): void {
    this.errorMessages = [];
    const idString = this.route.snapshot.paramMap.get('idUser');
    console.log('ID de la ruta:', idString); // Verifica qué valor tiene idString
    if (idString) {
      const id = +idString; // Convierte a número
      if (isNaN(id)) {
        console.error('El ID obtenido es NaN.');
      } else {
        this.loadUser(id); // Carga el usuario si el ID es válido
      }
    } else {
      console.error('ID de categoría no encontrado en la ruta.');
    }
  }

  loadUser(id: number): void {
    console.log('ID a cargar:', id); // Verifica que el ID sea correcto
    this.userService.getUserbyId(id).subscribe({
      next: (response: any) => {
        const userData = response.data;
        console.log(userData)
        this.user = {
          id: userData.id || '',
          mail: userData.mail || '',
          userName: userData.userName || '',
          phoneNumber: userData.phoneNumber || '',
          adress: userData.adress || ''
        };
        console.log('Usuario cargado:', this.user);
      },
      error: (error) => {
        console.error('Error al actualizar Usuario:', error);
        if (error.status === 400 && error.error.errors) {
          this.errorMessages = error.error.errors.map((err: any) => {
            return `Error en ${err.path[0]}: ${err.message}`;
          });
        } else {
          this.errorMessages.push('Error desconocido. Intente nuevamente.');
        }
      }
    });
  }

  onSubmit(): void {
    console.log('ID de categoría antes de enviar:', this.user.id); // Verifica el ID aquí
    if (this.user.id) { // Asegúrate de que el ID es válido
      this.userService.update(this.user.id, this.user).subscribe({
        next: (updatedUser) => {
          console.log('usuario actualizado:', updatedUser);
          this.showUpdateUser = true
          this.localStorageService.setItem('username', this.user.userName)
        },
        error: (error) => {
          console.error('Error al actualzar usuario:', error);
          if (error.status === 400 && error.error.errors) {
            this.errorMessages = error.error.errors.map((err: any) => {
              return `Error en ${err.path[0]}: ${err.message}`;
            });
          }else {
            this.errorMessages.push('Error desconocido. Intente nuevamente.');
          }
        }
      });
    } else {
      console.error('No se puede actualizar el usuario, ID es inválido.');
    }
  }

  openSuccessModal() {
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }


  closeUpdateUserSuccesfulMessage(){
    this.showUpdateUser = false
    this.router.navigate(['/home'])
  }
}
