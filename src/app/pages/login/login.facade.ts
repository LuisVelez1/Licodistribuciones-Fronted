import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginCredentials } from './login';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginFacade {
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  errorMessage$ = new BehaviorSubject<string | null>(null);

  login(credentials: LoginCredentials) {
    this.errorMessage$.next(null); 

    this.authService.login(credentials).subscribe({
      next: (res) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/home']);
      },
      error: (err) => {
      console.log('ERROR:', err);

      if (err.status === 400) {
        const message = typeof err.error === 'string' 
          ? err.error 
          : err.error?.message;

        this.errorMessage$.next(message || 'Correo o contraseña incorrectos');
      } else {
        this.errorMessage$.next('Error al iniciar sesión, intenta nuevamente');
      }
    }
    });
  }

  clearError() {
    this.errorMessage$.next(null);
  }
}

