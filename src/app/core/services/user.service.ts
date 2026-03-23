import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { API_ENDPOINTS } from '../constants/api.constants';
import { LoginInfo } from '../models/login-info.models';
import { User } from '../models/user.model';
import { UserA } from '../models/user-admin.model';

// Mapa de cargos según param_cargos inferido del sistema
const CARGOS: Record<string, string> = {
  '1':  'Gerente / Sistemas',
  '2':  'Key Account Manager',
  '5':  'Coordinador Talento Humano',
  '8':  'Recepcionista / Aux. Administrativa',
  '11': 'Conductor',
  '12': 'Auxiliar de Bodega / Distribución',
  '13': 'Auxiliar de Punto de Venta',
  '14': 'Cajera',
  '15': 'Aux. Contable',
  '16': 'Aux. Cartera',
  '17': 'Gerente Regional',
  '18': 'Director Comercial',
};

// Mapa de sedes según centro_op
const SEDES: Record<string, string> = {
  '1': 'Armenia',
  '2': 'Boyacá',
  '3': 'Eje Cafetero',
  '4': 'Costa Atlántica',
};

// Mapa de áreas según cargo
const AREA_POR_CARGO: Record<string, string> = {
  '1':  'Sistemas',
  '2':  'Comercial',
  '5':  'Talento Humano',
  '8':  'Administrativa',
  '11': 'Logística',
  '12': 'Logística',
  '13': 'Ventas',
  '14': 'Ventas',
  '15': 'Contabilidad',
  '16': 'Cartera',
  '17': 'Gerencia',
  '18': 'Comercial',
};

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${API_ENDPOINTS.users}`;

  // MOCK — datos reales de param_empleados (licodi_intranet)
  private mockUsers: UserA[] = [
    {
      id: '1',
      firstName: 'Soporte',
      lastName: 'TIC',
      email: '',
      phone: '',
      position: CARGOS['1'],
      sede: SEDES['1'],
      area: AREA_POR_CARGO['1'],
      status: 'ACTIVE',
    },
    {
      id: '2',
      firstName: 'Jorge',
      lastName: 'Barbosa Vargas',
      email: 'sistemas@licodistribuciones.com',
      phone: '3223392856',
      position: CARGOS['1'],
      sede: SEDES['1'],
      area: AREA_POR_CARGO['1'],
      status: 'ACTIVE',
    },
    {
      id: '125',
      firstName: 'Oscar',
      lastName: 'Pérez Acosta',
      email: 'kam@licodistribuciones.com',
      phone: '3102295152',
      position: CARGOS['2'],
      sede: SEDES['1'],
      area: AREA_POR_CARGO['2'],
      status: 'ACTIVE',
    },
    {
      id: '126',
      firstName: 'Harold',
      lastName: 'Roldán',
      email: 'consumo@licodistribuciones.com',
      phone: '3168320496',
      position: CARGOS['18'],
      sede: SEDES['1'],
      area: AREA_POR_CARGO['18'],
      status: 'ACTIVE',
    },
    {
      id: '127',
      firstName: 'Jackeline',
      lastName: 'Cuta Bernal',
      email: 'recepcion@licodistribuciones.com',
      phone: '3206777736',
      position: CARGOS['8'],
      sede: SEDES['1'],
      area: AREA_POR_CARGO['8'],
      status: 'ACTIVE',
    },
    {
      id: '128',
      firstName: 'Dilson',
      lastName: 'Otalvaro Ortiz',
      email: 'talentohumano@licodistribuciones.com',
      phone: '3206682609',
      position: CARGOS['5'],
      sede: SEDES['1'],
      area: AREA_POR_CARGO['5'],
      status: 'ACTIVE',
    },
    {
      id: '129',
      firstName: 'Martin',
      lastName: 'Pineda Álvarez',
      email: '',
      phone: '3223974626',
      position: CARGOS['11'],
      sede: SEDES['1'],
      area: AREA_POR_CARGO['11'],
      status: 'ACTIVE',
    },
    {
      id: '130',
      firstName: 'Jair',
      lastName: 'Guardo Palacios',
      email: '',
      phone: '3183230542',
      position: CARGOS['12'],
      sede: SEDES['4'],
      area: AREA_POR_CARGO['12'],
      status: 'ACTIVE',
    },
    {
      id: '131',
      firstName: 'Jim',
      lastName: 'Oneill Henry',
      email: '',
      phone: '3108140166',
      position: CARGOS['11'],
      sede: SEDES['4'],
      area: AREA_POR_CARGO['11'],
      status: 'ACTIVE',
    },
    {
      id: '132',
      firstName: 'Jhon',
      lastName: 'Orellano Altamirano',
      email: '',
      phone: '3152043508',
      position: CARGOS['12'],
      sede: SEDES['4'],
      area: AREA_POR_CARGO['12'],
      status: 'ACTIVE',
    },
    {
      id: '133',
      firstName: 'Welinton',
      lastName: 'Cardales Hernández',
      email: '',
      phone: '3187654070',
      position: CARGOS['12'],
      sede: SEDES['4'],
      area: AREA_POR_CARGO['12'],
      status: 'ACTIVE',
    },
    {
      id: '134',
      firstName: 'Doris',
      lastName: 'Blanco de la Asunción',
      email: '',
      phone: '3127750925',
      position: CARGOS['8'],
      sede: SEDES['4'],
      area: AREA_POR_CARGO['8'],
      status: 'ACTIVE',
    },
    {
      id: '135',
      firstName: 'Yeison',
      lastName: 'Cruz Pineda',
      email: '',
      phone: '3123508432',
      position: CARGOS['12'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['12'],
      status: 'ACTIVE',
    },
    {
      id: '136',
      firstName: 'Dayana',
      lastName: 'Molina Diagama',
      email: '',
      phone: '3209793140',
      position: CARGOS['13'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['13'],
      status: 'ACTIVE',
    },
    {
      id: '137',
      firstName: 'Angie',
      lastName: 'Vargas Montenegro',
      email: 'supermercadosboyaca@licodistribuciones.com',
      phone: '3102782630',
      position: CARGOS['13'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['13'],
      status: 'ACTIVE',
    },
    {
      id: '138',
      firstName: 'Andrés',
      lastName: 'Guevara Castiblanco',
      email: '',
      phone: '3177146690',
      position: CARGOS['16'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['16'],
      status: 'ACTIVE',
    },
    {
      id: '139',
      firstName: 'Lady',
      lastName: 'Alfonso Pinzón',
      email: '',
      phone: '3138181604',
      position: CARGOS['15'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['15'],
      status: 'ACTIVE',
    },
    {
      id: '140',
      firstName: 'Darlin',
      lastName: 'Aguilar Rojas',
      email: '',
      phone: '3228859078',
      position: CARGOS['14'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['14'],
      status: 'ACTIVE',
    },
    {
      id: '141',
      firstName: 'Maria Alejandra',
      lastName: 'Nontoa Rincón',
      email: '',
      phone: '3107964311',
      position: CARGOS['15'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['15'],
      status: 'ACTIVE',
    },
    {
      id: '142',
      firstName: 'Yenny',
      lastName: 'Rojas Peña',
      email: '',
      phone: '3112233283',
      position: CARGOS['14'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['14'],
      status: 'ACTIVE',
    },
    {
      id: '143',
      firstName: 'Jorge',
      lastName: 'Sanabria Gallo',
      email: '',
      phone: '3108803757',
      position: CARGOS['12'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['12'],
      status: 'ACTIVE',
    },
    {
      id: '144',
      firstName: 'Jenry',
      lastName: 'Ferrucho García',
      email: '',
      phone: '3138917163',
      position: CARGOS['12'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['12'],
      status: 'ACTIVE',
    },
    {
      id: '145',
      firstName: 'John',
      lastName: 'Torres Siza',
      email: '',
      phone: '3103336853',
      position: CARGOS['12'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['12'],
      status: 'ACTIVE',
    },
    {
      id: '146',
      firstName: 'Abdenago',
      lastName: 'Hernández Quemba',
      email: '',
      phone: '3115487541',
      position: CARGOS['12'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['12'],
      status: 'ACTIVE',
    },
    {
      id: '147',
      firstName: 'Luis',
      lastName: 'Russi Garzón',
      email: 'gerenciaboyaca@licodistribuciones.com',
      phone: '3003178380',
      position: CARGOS['17'],
      sede: SEDES['2'],
      area: AREA_POR_CARGO['17'],
      status: 'ACTIVE',
    },
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getCurrentUser(): Observable<User> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as User);
    const mock: User = {
      id: '2',
      firstName: 'Jorge',
      lastName: 'Barbosa',
      email: 'sistemas@licodistribuciones.com',
      loginTime: new Date().toISOString()
    } as User;
    return of(mock);
  }

  getUserById(id: string): Observable<User> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as User);
    const found = this.mockUsers.find(u => u.id === id);
    return of(found as unknown as User ?? null as unknown as User);
  }

  updateUserProfile(id: string, data: Partial<User>): Observable<User> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as User);
    return of({ ...data, id } as User);
  }

  getAllAdminUsers(): Observable<UserA[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);
    return of(this.mockUsers);
  }

  createAdminUser(data: any): Observable<UserA> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as UserA);
    const newUser: UserA = { ...data, id: crypto.randomUUID() };
    this.mockUsers.push(newUser);
    return of(newUser);
  }

  updateAdminUser(id: string, data: any): Observable<UserA> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as UserA);
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) this.mockUsers[index] = { ...this.mockUsers[index], ...data };
    return of(this.mockUsers[index]);
  }

  deleteAdminUser(id: string): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) return of(void 0);
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) this.mockUsers.splice(index, 1);
    return of(void 0);
  }

  updateAdminEmail(id: string, email: string): Observable<void> {
    if (!isPlatformBrowser(this.platformId)) return of(void 0);
    const user = this.mockUsers.find(u => u.id === id);
    if (user) user.email = email;
    return of(void 0);
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
