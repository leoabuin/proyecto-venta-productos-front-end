import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addbrands',
  standalone: true,
  imports: [FormsModule],
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

  constructor(private service: ApiService){}

  submitForm() {
    this.service.createBrand(this.brandData).subscribe({
      next: (response) => {
        console.log('Marca agregada:', response);
        // Aquí puedes agregar lógica adicional, como limpiar el formulario
      },
      error: (error) => {
        console.error('Error al agregar la marca:', error);
      }
    });
  }

}
