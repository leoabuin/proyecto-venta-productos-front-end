import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiCategoryService } from '../service/categoryApi.service.js';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addcategories',
  standalone: true,
  imports: [FormsModule,CommonModule, NavbarComponent],
  templateUrl: './addcategories.component.html',
  styleUrl: './addcategories.component.scss'
})
export class AddcategoriesComponent {

  categoryData = {
    name: '',
    description: ''
  };

  errorMessages: string[] = []
  showNewCategory: boolean = false 
  constructor(private service: ApiCategoryService, private router:Router){}


  submitForm() {
    this.errorMessages = [];
    this.service.createCategory(this.categoryData).subscribe({
      next: (response) => {
        console.log('categoria agregada:', response);
        this.showNewCategory = true
      },
      error: (error) => {
        console.error('Error al agregar la categoria:', error);
        this.errorMessages = [];
        if (error.status === 400 && error.error && error.error.error) {
          const backendErrors = error.error.error;
          this.errorMessages = backendErrors.map((err: any) => {
            return `Error en ${err.path ? err.path[0] : 'desconocido'}: ${err.message}`
          })
        } else {
          this.errorMessages.push('Error desconocido. Intente nuevamente.')
        }
      }
      
    });
  }

  closeNewCategorySuccessMessage(){
    this.showNewCategory = false
    this.router.navigate(['/categories-list'])
  }

}
