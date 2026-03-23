import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { isPlatformBrowser } from '@angular/common';

export interface BirthdayResponse {
  firstName: string;
  lastName: string;
  sede: string;
  birthdayDate: string; // YYYY-MM-DD
}

@Injectable({ providedIn: 'root' })
export class BirthdayService {
  private readonly apiUrl = `${API_ENDPOINTS.birthdays}`;

  // MOCK — fechas de nacimiento reales desde param_empleados
  private mockBirthdays: BirthdayResponse[] = [
    { firstName: 'Soporte',         lastName: 'TIC',                    birthdayDate: '1983-01-17', sede: 'Armenia'         },
    { firstName: 'Jorge',           lastName: 'Barbosa Vargas',          birthdayDate: '1969-08-09', sede: 'Armenia'         },
    { firstName: 'Oscar',           lastName: 'Pérez Acosta',            birthdayDate: '1980-11-04', sede: 'Armenia'         },
    { firstName: 'Harold',          lastName: 'Roldán',                  birthdayDate: '1981-01-31', sede: 'Armenia'         },
    { firstName: 'Jackeline',       lastName: 'Cuta Bernal',             birthdayDate: '1994-01-06', sede: 'Armenia'         },
    { firstName: 'Dilson',          lastName: 'Otalvaro Ortiz',          birthdayDate: '1990-01-16', sede: 'Armenia'         },
    { firstName: 'Martin',          lastName: 'Pineda Álvarez',          birthdayDate: '1985-10-21', sede: 'Armenia'         },
    { firstName: 'Jair',            lastName: 'Guardo Palacios',         birthdayDate: '1991-02-17', sede: 'Costa Atlántica' },
    { firstName: 'Jim',             lastName: 'Oneill Henry',            birthdayDate: '1976-12-29', sede: 'Costa Atlántica' },
    { firstName: 'Jhon',            lastName: 'Orellano Altamirano',     birthdayDate: '1979-01-26', sede: 'Costa Atlántica' },
    { firstName: 'Welinton',        lastName: 'Cardales Hernández',      birthdayDate: '1977-11-07', sede: 'Costa Atlántica' },
    { firstName: 'Doris',           lastName: 'Blanco de la Asunción',   birthdayDate: '1977-09-09', sede: 'Costa Atlántica' },
    { firstName: 'Yeison',          lastName: 'Cruz Pineda',             birthdayDate: '2003-12-18', sede: 'Boyacá'          },
    { firstName: 'Dayana',          lastName: 'Molina Diagama',          birthdayDate: '2002-03-02', sede: 'Boyacá'          },
    { firstName: 'Angie',           lastName: 'Vargas Montenegro',       birthdayDate: '2000-03-08', sede: 'Boyacá'          },
    { firstName: 'Andrés',          lastName: 'Guevara Castiblanco',     birthdayDate: '1992-06-25', sede: 'Boyacá'          },
    { firstName: 'Lady',            lastName: 'Alfonso Pinzón',          birthdayDate: '1994-03-06', sede: 'Boyacá'          },
    { firstName: 'Darlin',          lastName: 'Aguilar Rojas',           birthdayDate: '2005-07-06', sede: 'Boyacá'          },
    { firstName: 'Maria Alejandra', lastName: 'Nontoa Rincón',           birthdayDate: '1995-01-05', sede: 'Boyacá'          },
    { firstName: 'Yenny',           lastName: 'Rojas Peña',              birthdayDate: '1983-07-30', sede: 'Boyacá'          },
    { firstName: 'Jorge',           lastName: 'Sanabria Gallo',          birthdayDate: '1966-06-25', sede: 'Boyacá'          },
    { firstName: 'Jenry',           lastName: 'Ferrucho García',         birthdayDate: '1979-03-02', sede: 'Boyacá'          },
    { firstName: 'John',            lastName: 'Torres Siza',             birthdayDate: '1979-12-11', sede: 'Boyacá'          },
    { firstName: 'Abdenago',        lastName: 'Hernández Quemba',        birthdayDate: '1974-07-27', sede: 'Boyacá'          },
    { firstName: 'Luis',            lastName: 'Russi Garzón',            birthdayDate: '1970-10-18', sede: 'Boyacá'          },
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllBirthdays(): Observable<BirthdayResponse[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);
    // TODO: return this.http.get<BirthdayResponse[]>(this.apiUrl);
    return of(this.mockBirthdays);
  }
}
