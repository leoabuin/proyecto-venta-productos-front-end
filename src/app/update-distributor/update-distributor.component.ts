import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiDistributorService } from '../service/distributorApi.service.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { CommonModule } from '@angular/common';

export interface Distributor{
  id: number,
  name: string,
  Cuil: string,
  surname: string,
  email: string,
  phoneNumber: string,
  adress: string
}

@Component({
  selector: 'app-update-distributor',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NavbarComponent, CommonModule],
  templateUrl: './update-distributor.component.html',
  styleUrl: './update-distributor.component.scss'
})

export class UpdateDistributorComponent implements OnInit {
  distributor: Distributor = {
    id: 0,
    name: '',
    Cuil: '',
    surname: '',
    email: '',
    phoneNumber: '',
    adress: ''
  };
  errorMessages: string[] = [];
  isSuccessModalOpen = false;

  constructor(
    private distributorService: ApiDistributorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.errorMessages = [];
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      const id = +idString; // Convierte a número
      this.loadDistributor(id); // Carga la categoría si el ID es válido
    } else {
      console.error('ID de distribuidor no encontrado en la ruta.');
    }
  }

  loadDistributor(id: number): void {
    this.distributorService.getDistributorById(id).subscribe({
      next: (response: any) => {
        this.distributor = response.data; // Accede a la propiedad data
        console.log('Distribuidor cargado:', this.distributor);
        console.log('ID de distribuidor cargado:', this.distributor.id); // Log adicional
      },
      error: (error) => {
        console.error('Error al actualizar el distribuidor:', error);
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
  onSubmit(): void {
    console.log('ID de distribuidor antes de enviar:', this.distributor.id); // Verifica el ID aquí
    if (this.distributor.id) { // Asegúrate de que el ID es válido
      this.distributorService.updateDistributor(this.distributor.id, this.distributor).subscribe({
        next: (updatedDistributor) => {
          console.log('Distribuidor actualizado:', updatedDistributor);
          this.router.navigate(['/distributors-list']);
        },
        error: (error) => {
          console.error('Error al actualzar el distribuidor:', error);
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
      console.error('No se puede actualizar el distribuidor, ID es inválido.');
    }
  }

  openSuccessModal() {
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }
}
