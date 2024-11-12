import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Para leer cookies

export const authGuard = () => {
  const router = inject(Router);
  const cookieService = inject(CookieService);

  // Verifica si la cookie 'token' existe
  const token = cookieService.get('token');
  console.log('Token en guard:', token);

  if (token) {
    return true;  // Si el token existe, permite la navegación
  } else {
    router.navigate(['/login']);  // Si no hay token, redirige a login
    return false;  // Bloquea la navegación
  }
};