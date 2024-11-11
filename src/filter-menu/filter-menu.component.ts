import { Component, OnInit, NgModule } from '@angular/core';
import { FilterService } from '../app/service/filter.service';
import { CommonModule } from '@angular/common';


interface FilterOption {
  name: string;
  selected: boolean;
}

interface Filter {
  name: string;
  isOpen: boolean;
  options: FilterOption[];
}



@Component({
  selector: 'app-filter-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-menu.component.html',
})
export class FilterMenuComponent implements OnInit {
  filters: Filter[] = [
    {
      name: 'Marca',
      isOpen: false,
      options: []
    },
    {
      name: 'Categoría',
      isOpen: false,
      options: []
    }
  ];

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    this.loadFilters();
  }

  loadFilters() {
    this.filterService.getBrands().subscribe(
      (brands) => {
        this.filters[0].options = brands.map((brand) => ({ name: brand, selected: false }));
      },
      (error) => {
        console.error('Error al cargar las marcas:', error);
      }
    );

    this.filterService.getCategories().subscribe(
      (categories) => {
        this.filters[1].options = categories.map((category) => ({ name: category, selected: false }));
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  toggleFilter(filter: Filter) {
    filter.isOpen = !filter.isOpen;
  }

  onOptionSelect(filter: Filter, option: FilterOption) {
    option.selected = !option.selected;
  }

  applyFilter() {
    const selectedFilters = this.filters.map((filter) => ({
      name: filter.name,
      selectedOptions: filter.options
        .filter((option) => option.selected)
        .map((option) => option.name)
    }));

    console.log('Filtros aplicados:', selectedFilters);
    // Aquí puedes manejar la lógica para enviar los filtros seleccionados al backend o actualizar los resultados en la página.
  }

}
