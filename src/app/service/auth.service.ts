import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from '../service/local-storage.service.js'; // Ajustá la ruta según tu carpeta

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyectamos tu LocalStorageService en lugar del CookieService
  private localStorageService = inject(LocalStorageService);

  /**
   * Obtiene el rol del usuario desde el almacenamiento local.
   * Al usar cookies httpOnly, el rol se persiste aquí para que el Front 
   * pueda decidir qué mostrar en el Navbar.
   */
  getRole(): string {
    const role = this.localStorageService.getItem('user_role');
    return role ? role : 'Invitado';
  }

  /**
   * Verifica si el usuario logueado es un Empleado (como Verón).
   */
  isEmpleado(): boolean {
    const role = this.getRole();
    return role === 'Empleado';
  }

  /**
   * Verifica si el usuario logueado es un Cliente.
   */
  isCliente(): boolean {
    const role = this.getRole();
    return role === 'Cliente';
  }

  /**
   * Método útil para saber si hay alguien logueado (sea cliente o empleado)
   */
  isLoggedIn(): boolean {
    return this.getRole() !== 'Invitado';
  }

  /**
   * Limpia el rol al cerrar sesión
   */
  clearSession(): void {
    this.localStorageService.removeItem('user_role');
  }
}