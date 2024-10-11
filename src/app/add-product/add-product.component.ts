import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { CommonModule } from '@angular/common';
import { ApiProductService } from '../service/productApi.service.js';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service.js';
import { ApiDistributorService } from '../service/distributorApi.service.js';
import { ApiCategoryService } from '../service/categoryApi.service.js';
import { response } from 'express';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  productData = {
    name: '',
    description: '',
    waist: '',
    stock: '',
    imagen:'',
    brand:'',
    distributor:'',
    category: '',
  }

  brands:any[] = [];
  distributors: any[] = [];
  categories: any[] = [];

  constructor
  (private service: ApiProductService,
   private brandService: ApiService,
   private distributorService: ApiDistributorService,
   private categoryService: ApiCategoryService
  ){}

  ngOnInit(): void {
    this.brandService.getData().subscribe(response =>{
      this.brands = response.data;
    })
    this.distributorService.getDistributorsData().subscribe(response =>{
      this.distributors = response.data
    })
    this.categoryService.getCategoriesData().subscribe(response =>{
      this.categories = response.data
    })
  }


  submitForm() {
    this.service.createProduct(this.productData).subscribe({
      next: (response) => {
        console.log('Producto agregada:', response);
      },
      
    });
  }

}
