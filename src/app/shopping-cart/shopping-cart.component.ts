import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {

}
