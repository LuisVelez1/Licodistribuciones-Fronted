import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { API_ENDPOINTS } from '../constants/api.constants';
import { User } from '../models/user.model';
import { UserA } from '../models/user-admin.model';

const CARGOS: Record<string, string> = {
  '1': 'Coordinador / Sistemas', '2': 'Key Account Manager',
  '5': 'Coordinador Talento Humano', '8': 'Recepcionista / Aux. Administrativa',
  '11': 'Conductor', '12': 'Auxiliar de Bodega / Distribución',
  '13': 'Auxiliar Punto de Venta', '14': 'Cajera',
  '15': 'Aux. Contable', '16': 'Aux. Cartera',
  '17': 'Gerente Regional', '18': 'Director Comercial',
};

const SEDES: Record<string, string> = {
  '1': 'Quindío', '2': 'Boyacá', '3': 'Eje Cafetero', '4': 'San Andrés',
};

const AREA_POR_CARGO: Record<string, string> = {
  '1': 'Sistemas', '2': 'Comercial', '5': 'Talento Humano',
  '8': 'Administrativa', '11': 'Logística', '12': 'Logística',
  '13': 'Ventas', '14': 'Ventas', '15': 'Contabilidad',
  '16': 'Cartera', '17': 'Gerencia', '18': 'Comercial',
};

function toName(first: string, last: string): { firstName: string; lastName: string } {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return {
    firstName: first.split(' ').map(cap).join(' '),
    lastName: last.split(' ').filter(Boolean).map(cap).join(' '),
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${API_ENDPOINTS.users}`;

  private mockUsers: UserA[] = [
    // — Todos los empleados de param_empleados —
    ...([
      { id:'1',   ced:'900150462',  fn:'SOPORTE',        ln:'TIC',                   cargo:'1',  co:'1' },
      { id:'2',   ced:'17341621',   fn:'JORGE',          ln:'BARBOSA VARGAS',         cargo:'1',  co:'1', email:'sistemas@licodistribuciones.com',          phone:'3223392856' },
      { id:'125', ced:'13745876',   fn:'OSCAR',          ln:'PEREZ ACOSTA',           cargo:'2',  co:'1', email:'kam@licodistribuciones.com',               phone:'3102295152' },
      { id:'126', ced:'14566777',   fn:'HAROLD',         ln:'ROLDAN',                 cargo:'18', co:'1', email:'consumo@licodistribuciones.com',           phone:'3168320496' },
      { id:'127', ced:'1097400835', fn:'JACKELINE',      ln:'CUTA BERNAL',            cargo:'8',  co:'1', email:'recepcion@licodistribuciones.com',         phone:'3206777736' },
      { id:'128', ced:'1094910114', fn:'DILSON',         ln:'OTALVARO ORTIZ',         cargo:'5',  co:'1', email:'talentohumano@licodistribuciones.com',     phone:'3206682609' },
      { id:'129', ced:'1121706393', fn:'MARTIN',         ln:'PINEDA ALVAREZ',         cargo:'11', co:'1', phone:'3223974626' },
      { id:'130', ced:'1123627688', fn:'JAIR',           ln:'GUARDO PALACIOS',        cargo:'12', co:'4', phone:'3183230542' },
      { id:'131', ced:'18004466',   fn:'JIM',            ln:'ONEILL HENRY',           cargo:'11', co:'4', phone:'3108140166' },
      { id:'132', ced:'18008467',   fn:'JHON',           ln:'ORELLANO ALTAMIRANO',    cargo:'12', co:'4', phone:'3152043508' },
      { id:'133', ced:'18009045',   fn:'WELINTON',       ln:'CARDALES HERNANDEZ',     cargo:'12', co:'4', phone:'3187654070' },
      { id:'134', ced:'40990369',   fn:'DORIS',          ln:'BLANCO DE LA ASUNCION',  cargo:'8',  co:'4', phone:'3127750925' },
      { id:'135', ced:'1002331225', fn:'YEISON',         ln:'CRUZ PINEDA',            cargo:'12', co:'2', phone:'3123508432' },
      { id:'136', ced:'1002397120', fn:'DAYANA',         ln:'MOLINA DIAGAMA',         cargo:'13', co:'2', phone:'3209793140' },
      { id:'137', ced:'1007333113', fn:'ANGIE',          ln:'VARGAS MONTENEGRO',      cargo:'13', co:'2', email:'supermercadosboyaca@licodistribuciones.com', phone:'3102782630' },
      { id:'138', ced:'1049630058', fn:'ANDRES',         ln:'GUEVARA CASTIBALANCO',   cargo:'16', co:'2', phone:'3177146690' },
      { id:'139', ced:'1052313923', fn:'LADY',           ln:'ALFONSO PINZON',         cargo:'15', co:'2', phone:'3138181604' },
      { id:'140', ced:'1052837676', fn:'DARLIN',         ln:'AGUILAR ROJAS',          cargo:'14', co:'2', phone:'3228859078' },
      { id:'141', ced:'1057591382', fn:'MARIA ALEJANDRA',ln:'NONTOA RINCON',           cargo:'15', co:'2', phone:'3107964311' },
      { id:'142', ced:'33369566',   fn:'YENNY',          ln:'ROJAS PEÑA',             cargo:'14', co:'2', phone:'3112233283' },
      { id:'143', ced:'4251952',    fn:'JORGE',          ln:'SANABRIA GALLO',         cargo:'12', co:'2', phone:'3108803757' },
      { id:'144', ced:'7176714',    fn:'JENRY',          ln:'FERRUCHO GARCIA',        cargo:'12', co:'2', phone:'3138917163' },
      { id:'145', ced:'7177126',    fn:'JOHN',           ln:'TORRES SIZA',            cargo:'12', co:'2', phone:'3103336853' },
      { id:'146', ced:'74333745',   fn:'ABDENAGO',       ln:'HERNANDEZ QUEMBA',       cargo:'12', co:'2', phone:'3115487541' },
      { id:'147', ced:'79547934',   fn:'LUIS',           ln:'RUSSI GARZON',           cargo:'17', co:'2', email:'gerenciaboyaca@licodistribuciones.com', phone:'3003178380' },
    ] as any[]).map((e: any) => {
      const { firstName, lastName } = toName(e.fn, e.ln);
      return {
        id: e.id,
        firstName,
        lastName,
        email: e.email ?? '',
        phone: e.phone ?? '',
        position: CARGOS[e.cargo] ?? 'Colaborador',
        sede: SEDES[e.co] ?? 'Quindío',
        area: AREA_POR_CARGO[e.cargo] ?? 'General',
        status: 'ACTIVE' as const,
        cedula: e.ced,
      };
    }),
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getCurrentUser(): Observable<User> {
    if (!isPlatformBrowser(this.platformId)) return of(null as unknown as User);
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username: string = payload.username ?? '';
        const found = this.mockUsers.find(
          u => `${u.firstName}.${u.lastName.split(' ')[0]}`.toLowerCase() === username
        );
        if (found) return of({ ...found, loginTime: new Date().toISOString() } as User);
      } catch {}
    }
    return of({ id:'2', firstName:'Jorge', lastName:'Barbosa', email:'sistemas@licodistribuciones.com', loginTime: new Date().toISOString() } as User);
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
