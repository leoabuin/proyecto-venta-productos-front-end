import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
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
