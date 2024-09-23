import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Marca {
  name: string;
  description: string;
}

@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent {

  marca: Marca = { name: '', description:'' };

  onSubmit() {
    // Aquí realizarás la lógica para enviar los datos al servidor
    // o guardarlos en una base de datos local
    console.log('Marca a guardar:', this.marca);
  }

}
