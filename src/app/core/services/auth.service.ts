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

  // MOCK — usuario: primernombre.primerapellido | contraseña: número de identificación
  private mockUsers = [
    // Armenia (centro_op: 1)
    { username: 'soporte.tic',       password: '900150462',   role: 'SUPER_ADMIN' },
    { username: 'jorge.barbosa',     password: '17341621',    role: 'ADMIN'       },
    { username: 'oscar.perez',       password: '13745876',    role: 'USER'        },
    { username: 'harold.roldan',     password: '14566777',    role: 'USER'        },
    { username: 'jackeline.cuta',    password: '1097400835',  role: 'USER'        },
    { username: 'dilson.otalvaro',   password: '1094910114',  role: 'USER'        },
    { username: 'martin.pineda',     password: '1121706393',  role: 'USER'        },
    // Costa Atlántica (centro_op: 4)
    { username: 'jair.guardo',       password: '1123627688',  role: 'USER'        },
    { username: 'jim.oneill',        password: '18004466',    role: 'USER'        },
    { username: 'jhon.orellano',     password: '18008467',    role: 'USER'        },
    { username: 'welinton.cardales', password: '18009045',    role: 'USER'        },
    { username: 'doris.blanco',      password: '40990369',    role: 'USER'        },
    // Boyacá (centro_op: 2)
    { username: 'yeison.cruz',       password: '1002331225',  role: 'USER'        },
    { username: 'dayana.molina',     password: '1002397120',  role: 'USER'        },
    { username: 'angie.vargas',      password: '1007333113',  role: 'USER'        },
    { username: 'andres.guevara',    password: '1049630058',  role: 'USER'        },
    { username: 'lady.alfonso',      password: '1052313923',  role: 'USER'        },
    { username: 'darlin.aguilar',    password: '1052837676',  role: 'USER'        },
    { username: 'maria.nontoa',      password: '1057591382',  role: 'USER'        },
    { username: 'yenny.rojas',       password: '33369566',    role: 'USER'        },
    { username: 'jorge.sanabria',    password: '4251952',     role: 'USER'        },
    { username: 'jenry.ferrucho',    password: '7176714',     role: 'USER'        },
    { username: 'john.torres',       password: '7177126',     role: 'USER'        },
    { username: 'abdenago.hernandez',password: '74333745',    role: 'USER'        },
    { username: 'luis.russi',        password: '79547934',    role: 'USER'        },
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginCredentials): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of(null);

    // TODO: cuando el backend esté listo, eliminar el mock y descomentar:
    // return this.http.post(`${this.apiUrl}/login`, credentials);

    const found = this.mockUsers.find(
      u =>
        u.username === credentials.email.toLowerCase().trim() &&
        u.password === credentials.password.trim()
    );

    if (found) {
      const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: found.username,
        username: found.username,
        role: found.role,
        exp: Math.floor(Date.now() / 1000) + 3600
      }));
      return of({ token: `${header}.${payload}.mock-signature` });
    }

    return throwError(() => ({
      status: 400,
      error: { message: 'Usuario o contraseña incorrectos' }
    }));
  }

  changePassword(credentials: PasswordCredentials): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) return of(null);
    return of({ message: 'Contraseña actualizada correctamente' });
  }
}
