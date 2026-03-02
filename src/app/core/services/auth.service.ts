import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { LoginCredentials } from '../../pages/login/login';
import { API_ENDPOINTS } from '../constants/api.constants';
import { isPlatformBrowser } from '@angular/common';
import { PasswordCredentials } from '../../pages/admin/change-password/change-password';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${API_ENDPOINTS.auth}`;

  // MOCK - usuarios de prueba
  private mockUsers = [
    { email: 'admin@licodist.com',   password: '123456', role: 'ADMIN' },
    { email: 'usuario@licodist.com', password: '123456', role: 'USER'  },
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginCredentials): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    // TODO: cuando el monolito esté listo, eliminar el mock y descomentar:
    // return this.http.post(`${this.apiUrl}/login`, credentials);

    const found = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (found) {
      const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: found.email,
        role: found.role,
        exp: Math.floor(Date.now() / 1000) + 3600
      }));
      return of({ token: `${header}.${payload}.mock-signature` });
    }

    return throwError(() => ({
      status: 400,
      error: { message: 'Correo o contraseña incorrectos' }
    }));
  }

  changePassword(credentials: PasswordCredentials): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    // TODO: return this.http.put(`${this.apiUrl}/password`, credentials);
    return of({ message: 'Contraseña actualizada correctamente' });
  }
}