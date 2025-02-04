import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Para leer cookies

export const authGuard = () => {
  const router = inject(Router);
  const cookieService = inject(CookieService);

  const token = cookieService.get('token');
  console.log('Token en guard:', token);

  if (token) {
    return true;  
  } else {
    router.navigate(['/login']);  
    return false;  
  }
};