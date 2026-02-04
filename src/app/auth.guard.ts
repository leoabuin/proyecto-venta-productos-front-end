import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Para leer cookies
import { jwtDecode } from 'jwt-decode'; // Para decodificar el token JWT

export const roleGuard = (allowedRoles: string[]) => {
  return () => {
    const router = inject(Router);
    const cookieService = inject(CookieService);
    const token = cookieService.get('token');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userRole = decoded.rol; // El campo que confirmamos que viene del Back

        if (allowedRoles.includes(userRole)) {
          return true; // El rol está permitido para esta ruta
        } else {
          console.warn('Acceso denegado: Rol no autorizado');
          router.navigate(['/home']); // Lo mandamos al home si no tiene permiso
          return false;
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        router.navigate(['/login']);
        return false;
      }
    }

    router.navigate(['/login']);
    return false;
  };
};