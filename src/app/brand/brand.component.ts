import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service.js';
import { HttpClient } from '@angular/common/http';

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


  brands: any = {}
  constructor(private service: ApiService){
    this.service.getData().subscribe(brands =>{
      this.brands = brands.results;
      console.log(brands);})
  }
  
  marca: Marca = { name: '', description:'' };

  onSubmit() {
    this.service.getData().subscribe(brands =>{
      this.brands = brands.results;
      console.log(this.brands);
    })
  }

}
