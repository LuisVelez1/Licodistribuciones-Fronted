import { HttpInterceptorFn } from '@angular/common/http';
import { MESSAGES } from '../constants/messages.constants';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      let msg = MESSAGES.ERROR_GENERIC;

      if (error.status === 401) {
        msg = 'Sesión expirada';
        localStorage.clear();
      }
      
      return throwError(() => ({ ...error, customMessage: msg }));
    })
  );
};
