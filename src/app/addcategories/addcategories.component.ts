import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiCategoryService } from '../service/categoryApi.service.js';

@Component({
  selector: 'app-addcategories',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './addcategories.component.html',
  styleUrl: './addcategories.component.scss'
})
export class AddcategoriesComponent {

  categoryData = {
    name: '',
    description: ''
  };

  errorMessages: string[] = [];
  constructor(private service: ApiCategoryService){}


  submitForm() {
    this.errorMessages = [];
    this.service.createCategory(this.categoryData).subscribe({
      next: (response) => {
        console.log('categoria agregada:', response);

      },
      error: (error) => {
        console.error('Error al agregar la categoria:', error);
      
        // Reiniciar los mensajes de error en cada intento
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

}
