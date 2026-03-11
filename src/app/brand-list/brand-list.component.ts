import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // 👈 Importamos OnInit
import { ApiService } from '../service/api.service.js';
import { FilterPipe } from '../pipes/filter.pipe.js';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FilterPipe, FormsModule, NavbarComponent, RouterLink],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent implements OnInit { // 👈 Implementamos la interfaz
  filterBrand: string = ''
  brands: any[] = []
  selectedBrand: any = {}
  tempBrand: any = {} 
  brandToDelete: number | null = null
  showConflictError: boolean = false
  isModalOpen: boolean = false;
  isModalOpenDelete: boolean = false;
  errorMessages: string[] = [];

  constructor(private service: ApiService, private router: Router) {
    // El constructor queda limpio solo para inyectar servicios
  }

  // 🚀 ngOnInit se ejecuta automáticamente al cargar el componente
  ngOnInit(): void {
    this.getBrands();
  }

  getBrands(): void {
    console.log('Llamando al servicio de marcas...');
    this.service.getData().subscribe({
      next: (response) => {
        this.brands = response.data;
        console.log('Marcas cargadas exitosamente');
      },
      error: (error) => {
        console.error('Error al obtener marcas:', error);
        // Aquí podrías redirigir al login si el error es 401
      }
    });
  }

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
          console.log('No se puede eliminar porque existen productos con esta marca')
          this.showConflictError = true
        }
      }
    });
  }

  updateBrand() {
    const { products, ...brandData } = this.tempBrand;
    this.service.updateBrand(this.selectedBrand.id, brandData).subscribe({
      next: response => {
        const index = this.brands.findIndex(b => b.id === this.selectedBrand.id);
        if (index !== -1) {
          this.brands[index] = { ...this.tempBrand };
        }
        this.closeModal()
        console.log('Marca actualizada correctamente')
      },
      error: (error) => {
        console.error('Error al actualizar la marca:', error);
        this.errorMessages = []
        if (error.status === 400 && error.error && error.error.error) {
          const backendErrors = error.error.error
          this.errorMessages = backendErrors.map((err: any) => {
            return `Error en ${err.path ? err.path[0] : 'campo'}: ${err.message}`
          })
        } else {
          this.errorMessages.push('Error al procesar la actualización. Verifique los datos.')
        }
      }
    });
  }

  openModal(brand: any) {
    this.selectedBrand = brand;
    this.tempBrand = { ...brand }; 
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
