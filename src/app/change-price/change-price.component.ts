import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ApiPriceService } from '../service/priceApi.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component.js';

@Component({
  selector: 'app-change-price',
  standalone: true,
  imports: [FormsModule,CommonModule,NavbarComponent],
  templateUrl: './change-price.component.html',
  styleUrl: './change-price.component.scss'
})
export class ChangePriceComponent{
  productId: number = 0;
  dateFrom: Date | null = null;
  dateUntil: Date | null = null;
  cost: number = 0;


  constructor(
    private route: ActivatedRoute,
    private priceService: ApiPriceService, // Inyectar el servicio de precios
    private router: Router
  ) {
    //this.productId = Number(this.route.snapshot.paramMap.get('idProduct')); // Obtener el ID del producto de la ruta
  }

  async submitForm() {
    // Crear un objeto con los datos del formulario
    const priceData = {
      dateFrom: this.dateFrom,
      dateUntil: this.dateUntil,
      cost: this.cost,
    };

    try {
      // Envía la solicitud para agregar el precio al producto
      await this.priceService.addPriceToProduct(this.productId, priceData).toPromise();
      
      alert('Precio añadido exitosamente');
      this.router.navigate(['/products']); // Redirigir a la lista de productos
    } catch (error) {
      console.error(error);
      alert('Error al añadir el precio');
    }
  }
}
