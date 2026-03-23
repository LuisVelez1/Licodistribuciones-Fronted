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

  // MOCK - usuarios reales. Usuario: primernombre.primerapellido | Contraseña: número de cédula
  private mockUsers = [
    { username: 'super.usuario',   email: 'super.usuario@licodist.com',   password: '1000000001', role: 'SUPER_ADMIN', cedula: '1000000001' },
    { username: 'jorge.barbosa',   email: 'jorge.barbosa@licodist.com',   password: '1000000002', role: 'ADMIN',       cedula: '1000000002' },
    { username: 'dilson.otalvaro', email: 'dilson.otalvaro@licodist.com', password: '1000000003', role: 'USER',        cedula: '1000000003' },
    { username: 'marcela.arias',   email: 'marcela.arias@licodist.com',   password: '1000000004', role: 'USER',        cedula: '1000000004' },
    { username: 'julian.valencia', email: 'julian.valencia@licodist.com', password: '1000000005', role: 'USER',        cedula: '1000000005' },
    { username: 'juan.giraldo',    email: 'juan.giraldo@licodist.com',    password: '1000000006', role: 'USER',        cedula: '1000000006' },
    { username: 'sara.botero',     email: 'sara.botero@licodist.com',     password: '1000000007', role: 'USER',        cedula: '1000000007' },
    { username: 'viviana.arias',   email: 'viviana.arias@licodist.com',   password: '1000000008', role: 'USER',        cedula: '1000000008' },
    { username: 'carlos.muriel',   email: 'carlos.muriel@licodist.com',   password: '1000000009', role: 'USER',        cedula: '1000000009' },
    { username: 'yuliana.guzman',  email: 'yuliana.guzman@licodist.com',  password: '1000000010', role: 'USER',        cedula: '1000000010' },
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
      u =>
        (u.email === credentials.email || u.username === credentials.email.toLowerCase()) &&
        u.password === credentials.password
    );

    if (found) {
      const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: found.email,
        username: found.username,
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