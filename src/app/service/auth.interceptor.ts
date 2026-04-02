import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Clonar la request y agregar withCredentials: true
    // Esto permite que se envíen las cookies httpOnly automáticamente
    const authRequest = request.clone({
      withCredentials: true
    });

    return next.handle(authRequest);
  }
}
