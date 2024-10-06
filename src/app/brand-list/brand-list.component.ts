import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../service/api.service.js';
import { FilterPipe } from '../pipes/filter.pipe.js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, FilterPipe, FormsModule],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss'
})
export class BrandListComponent {
  filterBrand: string = '';
  brands: any[] = []
  constructor(private service: ApiService){
    this.service.getData().subscribe(response =>{
      this.brands = response.data;
     // console.log(brands.results);
    })
  }

  deleteBrand(brandId: number) {
    if (isNaN(brandId) || brandId <= 0) {
      console.error('ID de la marca no válido:', brandId);
      return;
    }
  
    this.service.deleteBrand(brandId).subscribe({
      next: response => {
        console.log('Marca eliminada:', response.message);
        // Actualiza la lista de marcas eliminando la marca eliminada
        this.brands = this.brands.filter(brand => brand.id !== brandId);
      },
      error: error => {
        console.error('Error al eliminar la marca:', error);
      }
    });
  }

}
