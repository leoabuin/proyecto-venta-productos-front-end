import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component.js';

@Component({
  selector: 'app-addbrands',
  standalone: true,
  imports: [FormsModule,CommonModule, NavbarComponent],
  templateUrl: './addbrands.component.html',
  styleUrl: './addbrands.component.scss'
})
export class AddbrandsComponent {
  
  brandData = {
    name: '',
    description: '',
    website:'',
    countryOfOrigin:'',
    logo:''
  };

  isSuccessModalOpen = false;
  errorMessages: string[] = [];
  constructor(private service: ApiService){}

  submitForm() {
    this.errorMessages = [];
    this.service.createBrand(this.brandData).subscribe({
      next: (response) => {
        console.log('Marca agregada:', response);
        this.openSuccessModal();

      },
      error: (error) => {
        console.error('Error al agregar la marca:', error);
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

  openSuccessModal() {
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }


}
