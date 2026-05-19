import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '../core/services/session.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const session = inject(SessionService);

  const token = session.getToken();

  if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  if (session.isTokenExpired()) {
    session.clearSession();
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
