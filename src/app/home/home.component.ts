import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { LocalStorageService } from '../service/local-storage.service.js';
import { FooterComponent } from '../footer/footer.component.js';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NavbarComponent, FooterComponent,CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  username: string | null = null
  constructor(private localStorageService: LocalStorageService) {
    this.username = this.localStorageService.getItem('username');
    console.log(this.username); 
  }

  carouselImages = [
    'assets/img1.webp',
    'assets/img2.webp',
    'assets/img3.webp'
  ];

}
