import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCategoryService } from '../service/categoryApi.service.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { CommonModule } from '@angular/common';


export interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NavbarComponent, CommonModule],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss'
})


export class UpdateCategoryComponent implements OnInit {
  category: Category = {
    id: 0,
    name: '',
    description: ''
  };
  errorMessages: string[] = [];
  isSuccessModalOpen = false;

  constructor(
    private categoryService: ApiCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.errorMessages = [];
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      const id = +idString; // Convierte a número
      this.loadCategory(id); // Carga la categoría si el ID es válido
    } else {
      console.error('ID de categoría no encontrado en la ruta.');
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (response: any) => {
        this.category = response.data; // Accede a la propiedad data
        console.log('Categoría cargada:', this.category);
        console.log('ID de categoría cargada:', this.category.id); // Log adicional
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
  onSubmit(): void {
    console.log('ID de categoría antes de enviar:', this.category.id); // Verifica el ID aquí
    if (this.category.id) { // Asegúrate de que el ID es válido
      this.categoryService.updateCategory(this.category.id, this.category).subscribe({
        next: (updatedCategory) => {
          console.log('Categoría actualizada:', updatedCategory);
          this.router.navigate(['/categories-list']);
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
    } else {
      console.error('No se puede actualizar la categoría, ID es inválido.');
    }
  }

  openSuccessModal() {
    this.isSuccessModalOpen = true;
  }

  closeSuccessModal() {
    this.isSuccessModalOpen = false;
  }
}