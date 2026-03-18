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

  // MOCK - usuarios reales
  private mockUsers: UserA[] = [
    { id: '1',  firstName: 'Super',    lastName: 'Usuario',  email: 'super.usuario@licodist.com',   phone: '3000000001', position: 'Súper Administrador',    sede: 'Bogotá',    area: 'Sistemas',    status: 'ACTIVE' },
    { id: '2',  firstName: 'Jorge',    lastName: 'Barbosa',  email: 'jorge.barbosa@licodist.com',   phone: '3000000002', position: 'Administrador',           sede: 'Bogotá',    area: 'Sistemas',    status: 'ACTIVE' },
    { id: '3',  firstName: 'Dilson',   lastName: 'Otalvaro', email: 'dilson.otalvaro@licodist.com', phone: '3000000003', position: 'Colaborador',             sede: 'Bogotá',    area: 'Operaciones', status: 'ACTIVE' },
    { id: '4',  firstName: 'Marcela',  lastName: 'Arias',    email: 'marcela.arias@licodist.com',   phone: '3000000004', position: 'Colaboradora',            sede: 'Medellín',  area: 'RRHH',        status: 'ACTIVE' },
    { id: '5',  firstName: 'Julián',   lastName: 'Valencia', email: 'julian.valencia@licodist.com', phone: '3000000005', position: 'Colaborador',             sede: 'Cali',      area: 'Ventas',      status: 'ACTIVE' },
    { id: '6',  firstName: 'Juan',     lastName: 'Giraldo',  email: 'juan.giraldo@licodist.com',    phone: '3000000006', position: 'Colaborador',             sede: 'Bogotá',    area: 'Logística',   status: 'ACTIVE' },
    { id: '7',  firstName: 'Sara',     lastName: 'Botero',   email: 'sara.botero@licodist.com',     phone: '3000000007', position: 'Colaboradora',            sede: 'Medellín',  area: 'Ventas',      status: 'ACTIVE' },
    { id: '8',  firstName: 'Viviana',  lastName: 'Arias',    email: 'viviana.arias@licodist.com',   phone: '3000000008', position: 'Colaboradora',            sede: 'Bogotá',    area: 'Finanzas',    status: 'ACTIVE' },
    { id: '9',  firstName: 'Carlos',   lastName: 'Muriel',   email: 'carlos.muriel@licodist.com',   phone: '3000000009', position: 'Colaborador',             sede: 'Cali',      area: 'Operaciones', status: 'ACTIVE' },
    { id: '10', firstName: 'Yuliana',  lastName: 'Guzmán',   email: 'yuliana.guzman@licodist.com',  phone: '3000000010', position: 'Colaboradora',            sede: 'Bogotá',    area: 'RRHH',        status: 'ACTIVE' },
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
      id: '2',
      firstName: 'Jorge',
      lastName: 'Barbosa',
      email: 'jorge.barbosa@licodist.com',
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