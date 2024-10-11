import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { ApiDistributorService } from '../service/distributorApi.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Distributor {
  CUIL: string;
  name: string;
  surname: string;
  address: string;
  category: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-distributor-list',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './distributor-list.component.html',
  styleUrl: './distributor-list.component.scss'
})
export class DistributorListComponent {

  distributors: any[] = []
  constructor(private service: ApiDistributorService){
    this.service.getDistributorsData().subscribe(response =>{
      this.distributors = response.data;
    })
  }

  selectedDistributor: Distributor | null = null

  openModal(distributor: Distributor) {
    console.log('Opening modal for:', distributor);
    this.selectedDistributor = distributor;
    const modal = document.getElementById('hs-scale-animation-modal');
    if (modal) {
      modal.classList.remove('hidden');
    } else {
      console.error('Modal element not found');
    }
  }

  closeModal() {
    console.log('Closing modal');
    this.selectedDistributor = null;
    const modal = document.getElementById('hs-scale-animation-modal');
    if (modal) {
      modal.classList.add('hidden');
    } else {
      console.error('Modal element not found');
    }
  }

}
