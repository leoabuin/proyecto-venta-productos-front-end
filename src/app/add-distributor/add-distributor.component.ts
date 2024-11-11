import { Component, OnInit } from '@angular/core';
import { ApiDistributorService } from '../service/distributorApi.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component.js';


@Component({
  selector: 'app-add-distributor',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './add-distributor.component.html',
  styleUrl: './add-distributor.component.scss'
})
export class AddDistributorComponent {
  distributorData = {
    id: 0,
    name: '',
    CUIL: 0,
    surname: '',
    email: '',
    phoneNumber: '',
    address: ''
    
  };

  isSuccessModalOpen = false;
  errorMessages: string[] = [];
  
  constructor(private service: ApiDistributorService){}

  submitForm() {
    this.errorMessages = [];
    this.service.createDistributor(this.distributorData).subscribe({
      next: (response) => {
        console.log('Distribuidor agregado:', response);
        this.openSuccessModal();

      },
      error: (error) => {
        console.error('Error al agregar el distribuidor:', error);
        this.errorMessages = []
        if (error.status === 400 && error.error && Array.isArray(error.error.error)) {
          this.errorMessages = error.error.error.map((err: any) => {
            return `Error en ${err.path[0]}: ${err.message}`;
          })
        } else {
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
