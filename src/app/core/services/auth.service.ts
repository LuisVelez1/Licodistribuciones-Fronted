import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { LoginCredentials } from '../../pages/login/login';
import { API_ENDPOINTS } from '../constants/api.constants';
import { isPlatformBrowser } from '@angular/common';
import { PasswordCredentials } from '../../pages/admin/change-password/change-password';

export interface AuthResponse {
  token: string;
  user: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    if (!isPlatformBrowser(this.platformId)) return of(null as any);

    const body = {
      usuario: credentials.username.toUpperCase().trim(),
      password: credentials.password.trim()
    };

    return this.http.post<AuthResponse>(`${API_ENDPOINTS.auth}/login`, body).pipe(
      tap(response => this.saveSession(response))
    );
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', response.user);
    localStorage.setItem('firstName', response.firstName);
    localStorage.setItem('lastName', response.lastName);
    localStorage.setItem('roles', JSON.stringify(response.roles));
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem('token')
      : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRoles(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  changePassword(credentials: PasswordCredentials): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of(null);
    return of({ message: 'Contraseña actualizada correctamente' });
  }
}
