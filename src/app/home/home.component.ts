import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { LocalStorageService } from '../service/local-storage.service.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule, NavbarComponent,NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  username: string | null = null




  constructor(private localStorageService: LocalStorageService) {
    this.username = this.localStorageService.getItem('username');
    console.log(this.username); 
  }

}
