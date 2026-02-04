import { Injectable, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private cookieService = inject(CookieService);

  getRole(): string {
    const token = this.cookieService.get('token');
    if (!token) return 'Invitado';

    try {
      const decoded: any = jwtDecode(token);
      return decoded.rol || 'Invitado';
    } catch (error) {
      return 'Invitado';
    }
  }

  isEmpleado(): boolean {
    return this.getRole() === 'Empleado';
  }

  isCliente(): boolean {
    return this.getRole() === 'Cliente';
  }
}