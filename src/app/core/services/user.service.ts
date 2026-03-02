import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { API_ENDPOINTS } from '../constants/api.constants';
import { LoginInfo } from '../models/login-info.models';
import { User } from '../models/user.model';
import { UserA } from '../models/user-admin.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${API_ENDPOINTS.users}`;

  // MOCK - usuarios de prueba
  private mockUsers: UserA[] = [
    { id: '1', firstName: 'Carlos',    lastName: 'Ramírez',  email: 'c.ramirez@licodist.com',   phone: '3001234567', position: 'Coordinador Comercial', sede: 'Bogotá',       area: 'Ventas',     status: 'ACTIVE' },
    { id: '2', firstName: 'Valentina', lastName: 'Torres',   email: 'v.torres@licodist.com',    phone: '3107654321', position: 'Analista de Logística', sede: 'Medellín',     area: 'Logística',  status: 'ACTIVE' },
    { id: '3', firstName: 'Andrés',    lastName: 'Gómez',    email: 'a.gomez@licodist.com',     phone: '3209876543', position: 'Jefe de Bodega',        sede: 'Cali',         area: 'Operaciones',status: 'ACTIVE' },
    { id: '4', firstName: 'Laura',     lastName: 'Martínez', email: 'l.martinez@licodist.com',  phone: '3151122334', position: 'Directora de RRHH',     sede: 'Bogotá',       area: 'RRHH',       status: 'ACTIVE' },
    { id: '5', firstName: 'Miguel',    lastName: 'Herrera',  email: 'm.herrera@licodist.com',   phone: '3004455667', position: 'Vendedor Senior',       sede: 'Barranquilla', area: 'Ventas',     status: 'ACTIVE' },
    { id: '6', firstName: 'Sofía',     lastName: 'Castro',   email: 's.castro@licodist.com',    phone: '3118899001', position: 'Contadora',             sede: 'Bogotá',       area: 'Finanzas',   status: 'ACTIVE' },
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getCurrentUser(): Observable<User> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as User);

    // TODO: return this.http.get<LoginInfo>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() })
    //   .pipe(map((info): User => ({ ...info, loginTime: info.loginTime instanceof Date ? info.loginTime.toISOString() : info.loginTime })));

    const mock: User = {
      id: '1',
      firstName: 'Carlos',
      lastName: 'Ramírez',
      email: 'admin@licodist.com',
      loginTime: new Date().toISOString()
    } as User;
    return of(mock);
  }

  getUserById(id: string): Observable<User> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as User);

    // TODO: return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });

    const found = this.mockUsers.find(u => u.id === id);
    return of(found as unknown as User ?? null as unknown as User);
  }

  updateUserProfile(id: string, data: Partial<User>): Observable<User> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as User);

    // TODO: return this.http.put<User>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });

    return of({ ...data, id } as User);
  }

  getAllAdminUsers(): Observable<UserA[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);

    // TODO: return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() })
    //   .pipe(map(users => users.map(u => this.mapToAdminUser(u))));

    return of(this.mockUsers);
  }

  createAdminUser(data: any): Observable<UserA> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as UserA);

    // TODO: return this.http.post<any>(this.apiUrl, data, { headers: this.getAuthHeaders() })
    //   .pipe(map(u => this.mapToAdminUser(u)));

    const newUser: UserA = { ...data, id: crypto.randomUUID() };
    this.mockUsers.push(newUser);
    return of(newUser);
  }

  updateAdminUser(id: string, data: any): Observable<UserA> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as UserA);

    // TODO: return this.http.put<any>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() })
    //   .pipe(map(u => this.mapToAdminUser(u)));

    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) this.mockUsers[index] = { ...this.mockUsers[index], ...data };
    return of(this.mockUsers[index]);
  }

  deleteAdminUser(id: string): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) return of(void 0);

    // TODO: return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });

    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) this.mockUsers.splice(index, 1);
    return of(void 0);
  }

  updateAdminEmail(id: string, email: string): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) return of(void 0);

    // TODO: return this.http.put<void>(`${this.apiUrl}/${id}/email`, { email }, { headers: this.getAuthHeaders() });

    const user = this.mockUsers.find(u => u.id === id);
    if (user) user.email = email;
    return of(void 0);
  }

  private mapToAdminUser(u: any): UserA {
    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      position: u.position,
      sede: u.sede,
      area: u.area,
      status: u.status
    };
  }

  private getAuthHeaders(isJson = true): HttpHeaders {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (isJson) headers = headers.set('Content-Type', 'application/json');
    return headers;
  }
}