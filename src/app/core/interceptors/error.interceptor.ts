import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MESSAGES } from '../constants/messages.constants';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      let msg = MESSAGES.ERROR_GENERIC;

      if (error.status === 401) {
        msg = 'Sesión expirada';
        localStorage.clear();
        // 👇 Fuerza la redirección al login
        router.navigate(['/auth/login']); 
      }
      
      return throwError(() => ({ ...error, customMessage: msg }));
    })
  );
};