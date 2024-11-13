import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @Input() images: string[] = []; // Array de URLs de imágenes
  currentSlide: number = 0; // Índice de la imagen actual

  // Método para ir a la siguiente imagen
  nextSlide(): void {
    if (this.images.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.images.length;
    }
  }

  // Método para ir a la imagen anterior
  prevSlide(): void {
    if (this.images.length > 0) {
      this.currentSlide =
        (this.currentSlide - 1 + this.images.length) % this.images.length;
    }
  }

  // Método para ir a una imagen específica
  goToSlide(slideIndex: number): void {
    if (slideIndex >= 0 && slideIndex < this.images.length) {
      this.currentSlide = slideIndex;
    }
  }
}
