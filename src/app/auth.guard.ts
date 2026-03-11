import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const roleGuard = (allowedRoles: string[]) => {
  return () => {
    const router = inject(Router);
    
    // 1. Obtenemos el rol desde LocalStorage (el que seteaste en LogInComponent)
    const userRole = localStorage.getItem('user_role');

    // 2. Verificamos si existe un rol guardado
    if (userRole) {
      // 3. Comprobamos si el rol del usuario está dentro de los permitidos para esta ruta
      if (allowedRoles.includes(userRole)) {
        return true; // Acceso concedido
      } else {
        // El usuario está logueado pero su rol no tiene permiso (ej: Cliente intentando entrar a Dashboard)
        console.warn('Acceso denegado: Rol no autorizado para esta sección');
        router.navigate(['/home']); 
        return false;
      }
    }

    // 4. Si no hay nada en localStorage, el usuario no está logueado
    console.warn('Acceso denegado: No se encontró sesión activa');
    router.navigate(['/login']);
    return false;
  };
};