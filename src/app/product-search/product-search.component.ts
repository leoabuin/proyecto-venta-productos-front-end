import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css'],
})
export class ProductSearchComponent {
  @Input() products: { name: string }[] = []; // Lista de productos que se recibe como input
  searchTerm: string = '';
  filteredProducts: { name: string }[] = [];

  ngOnInit() {
    this.filteredProducts = this.products; // Inicialmente muestra todos los productos
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
