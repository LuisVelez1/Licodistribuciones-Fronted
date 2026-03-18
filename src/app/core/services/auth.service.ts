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

  // MOCK - usuarios reales con contraseña temporal 123456
  private mockUsers = [
    { username: 'SUPER.USUARIO',    email: 'super.usuario@licodist.com',    password: '123456', role: 'SUPER_ADMIN' },
    { username: 'JORGE.BARBOSA',    email: 'jorge.barbosa@licodist.com',    password: '123456', role: 'ADMIN'       },
    { username: 'DILSON.OTALVARO',  email: 'dilson.otalvaro@licodist.com',  password: '123456', role: 'USER'        },
    { username: 'MARCELA.ARIAS',    email: 'marcela.arias@licodist.com',    password: '123456', role: 'USER'        },
    { username: 'JULIAN.VALENCIA',  email: 'julian.valencia@licodist.com',  password: '123456', role: 'USER'        },
    { username: 'JUAN.GIRALDO',     email: 'juan.giraldo@licodist.com',     password: '123456', role: 'USER'        },
    { username: 'SARA.BOTERO',      email: 'sara.botero@licodist.com',      password: '123456', role: 'USER'        },
    { username: 'VIVIANA.ARIAS',    email: 'viviana.arias@licodist.com',    password: '123456', role: 'USER'        },
    { username: 'CARLOS.MURIEL',    email: 'carlos.muriel@licodist.com',    password: '123456', role: 'USER'        },
    { username: 'YULIANA.GUZMAN',   email: 'yuliana.guzman@licodist.com',   password: '123456', role: 'USER'        },
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
        (u.email === credentials.email || u.username === credentials.email) &&
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