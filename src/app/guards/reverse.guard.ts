import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '../core/services/session.service';

export const reverseAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const session = inject(SessionService);

  const token = session.getToken();

  if (token && !session.isTokenExpired()) {
    return router.createUrlTree(['/home']);
  }

  return true;
};
