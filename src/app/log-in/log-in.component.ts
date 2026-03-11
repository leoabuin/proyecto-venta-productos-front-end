import { Component, inject } from '@angular/core'; // Usamos inject para un código más limpio
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiUserService } from '../service/userApi.service.js';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../service/local-storage.service.js';
import { AuthService } from '../service/auth.service.js'; // Asegurate de importar tu AuthService

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  userData = {
    userName: '',
    password: ''
  };

  errorMessages: string[] = [];

  // Inyectamos los servicios
  constructor(
    private service: ApiUserService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService // Lo necesitamos para setear el rol
  ) {}

  submitForm() {
    this.errorMessages = [];
    
    this.service.logInUser(this.userData).subscribe({
      next: (response) => {
        console.log('Inicio de sesion con exito:', response);
        console.log('¿Qué trae la data del back?:', response.data); // 👈 MIRÁ ESTO EN LA CONSOLA
        this.localStorageService.setItem('user_role', response.data.rol);

        // 1. Guardamos los datos básicos en LocalStorage
        this.localStorageService.setItem('idUsuario', response.data.id);
        this.localStorageService.setItem('username', response.data.userName);
        this.localStorageService.setItem('name', response.data.name);
        this.localStorageService.setItem('userEmail', response.data.mail);
        
        // 2. IMPORTANTE: Guardamos el ROL para que el Navbar cambie
        this.localStorageService.setItem('user_role', response.data.rol);

        // 3. Redirección inteligente según el rol
        if (response.data.rol === 'Empleado') {
          console.log('Bienvenido empleado:', response.data.name);
          this.router.navigate(['/home']); // O a la ruta de admin si tenés una
        } else {
          this.router.navigate(['/home']);
        }

        // Nota: Ya no buscamos la cookie aquí porque al ser httpOnly 
        // el navegador no dejará que la leamos por código, pero SÍ la enviará al back.
      },
      error: (error) => {
        console.error('Error al inicio de sesión:', error);
        const errors = error.error?.error || [];

        if (error.status === 401 || error.status === 404) {
          this.errorMessages.push(error.error.message || 'Credenciales incorrectas');
        } else if (error.status === 400 && Array.isArray(errors)) {
          this.errorMessages = errors.map((err: any) => 
            err.path ? `Error en ${err.path[0]}: ${err.message}` : `Error: ${err.message}`
          );
        } else {
          this.errorMessages.push('Error al intentar iniciar sesión. Revise los datos.');
        }
      }
    });
  }
}
