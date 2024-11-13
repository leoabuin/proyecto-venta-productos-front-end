import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../service/api.service.js';
import { FilterPipe } from '../pipes/filter.pipe.js';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FilterPipe, FormsModule, NavbarComponent,RouterLink],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent {
  filterBrand: string = ''
  brands: any[] = []
  selectedBrand: any = {}
  tempBrand: any = {} 
  constructor(private service: ApiService, private router: Router){
    this.service.getData().subscribe(response =>{
      this.brands = response.data;
    })
  }

  brandToDelete: number | null = null
  showConflictError: boolean = false


  openModalDelete(brandId: number) {
    this.brandToDelete = brandId;
    this.isModalOpenDelete = true
  }

  closeModalDelete() {
    this.isModalOpenDelete = false;
    this.brandToDelete = null;
  }


  confirmDelete() {
    if (this.brandToDelete) {
      // Lógica para eliminar la marca
      this.deleteBrand(this.brandToDelete);
      this.closeModalDelete();
    }
  }

  deleteBrand(brandId: number) {
    if (isNaN(brandId) || brandId <= 0) {
      console.error('ID de la marca no válido:', brandId);
      return;
    }
  
    this.service.deleteBrand(brandId).subscribe({
      next: response => {
        console.log('Marca eliminada:', response.message);
        this.brands = this.brands.filter(brand => brand.id !== brandId);
      },
      error: error => {
        if(error.status === 500){
          console.log('No se puede elimnar porque existen productos con esta marca')
          this.showConflictError = true

        }
      }
    });
  }

  errorMessages: string[] = [];
  updateBrand() {
    // Aquí llamas al backend para actualizar la marca
    this.service.updateBrand(this.selectedBrand.id, this.tempBrand).subscribe({
      next: response => {
        this.selectedBrand = { ...this.tempBrand };
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al agregar la categoria:', error);
      
        this.errorMessages = [];
      
        // Verificar si el error tiene el formato esperado
        if (error.status === 400 && error.error && error.error.error) {
          // Si existe el campo 'error.error' y tiene detalles de validación
          const backendErrors = error.error.error;
          this.errorMessages = backendErrors.map((err: any) => {
            return `Error en ${err.path ? err.path[0] : 'desconocido'}: ${err.message}`;
          });
        } else {
          // Manejo de otros errores o respuestas inesperadas
          this.errorMessages.push('Error desconocido. Intente nuevamente.');
        }
      }
    });
  }

  isModalOpen: boolean = false;
  isModalOpenDelete: boolean = false;
  openModal(brand: any) {
    this.selectedBrand = brand;
    this.tempBrand = { ...brand }; // Crea una copia del objeto para editar
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedBrand = null;
  }

  closeConflictErrorMessage(){
    this.showConflictError = false
  }

}
