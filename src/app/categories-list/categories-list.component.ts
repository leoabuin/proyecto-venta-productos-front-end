import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiCategoryService } from '../service/categoryApi.service.js';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, RouterModule, FormsModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent {
  filterCategory: string = '';
  categories: any[] = []
  constructor(private service: ApiCategoryService) {
    this.service.getCategoriesData().subscribe(response => {
      this.categories = response.data;
    })
  }

  // Variables de control de modales
  isModalOpenDelete: boolean = false;
  showConflictError: boolean = false;
  idCategoryToDelete: number | null = null;

  // Abrir confirmación
  openModalDelete(id: number) {
    this.idCategoryToDelete = id;
    this.isModalOpenDelete = true;
  }

  closeModalDelete() {
    this.isModalOpenDelete = false;
    this.idCategoryToDelete = null;
  }

  closeConflictErrorMessage() {
    this.showConflictError = false;
  }

  confirmDelete() {
    if (this.idCategoryToDelete) {
      this.service.deleteCategory(this.idCategoryToDelete).subscribe({
        next: () => {
          // Refrescar la lista localmente
          this.categories = this.categories.filter(c => c.id !== this.idCategoryToDelete);
          this.closeModalDelete();
          console.log('Categoría eliminada');
        },
        error: (error) => {
          if (error.status === 409 || error.status === 500) {
            // Si hay conflicto (productos asociados), cerramos el de borrado y abrimos el de error
            this.closeModalDelete();
            this.showConflictError = true;
          } else {
            console.error('Error al eliminar:', error);
          }
        }
      });
    }
  }

}
