import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'filterProduct',
    standalone: true
  })
  export class FilterPipe implements PipeTransform {
    transform(products: any[], searchTerm: any): any[] {
      if (!products || !searchTerm || searchTerm.trim() === '') {
        return products;
      }

      const term = searchTerm.toLowerCase().trim();

      return products.filter(product => {
        const name        = (product.name || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const brandName   = (product.brand?.name || '').toLowerCase();
        const categoryName = (product.category?.name || '').toLowerCase();

        return name.includes(term)
          || description.includes(term)
          || brandName.includes(term)
          || categoryName.includes(term);
      });
    }
  }