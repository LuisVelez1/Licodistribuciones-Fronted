import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { isPlatformBrowser } from '@angular/common';

export interface BirthdayResponse {
  firstName: string;
  lastName: string;
  sede: string;
  birthdayDate: string;
}

@Injectable({ providedIn: 'root' })
export class BirthdayService {
  private readonly apiUrl = `${API_ENDPOINTS.birthdays}`;

  // MOCK - cumpleaños de usuarios reales (fechas aproximadas para presentación)
  private mockBirthdays: BirthdayResponse[] = [
    { firstName: 'Jorge',   lastName: 'Barbosa',  birthdayDate: '1985-03-18', sede: 'Bogotá'   },
    { firstName: 'Dilson',  lastName: 'Otalvaro', birthdayDate: '1990-03-22', sede: 'Bogotá'   },
    { firstName: 'Marcela', lastName: 'Arias',    birthdayDate: '1992-04-05', sede: 'Medellín' },
    { firstName: 'Julián',  lastName: 'Valencia', birthdayDate: '1988-05-14', sede: 'Cali'     },
    { firstName: 'Juan',    lastName: 'Giraldo',  birthdayDate: '1994-06-30', sede: 'Bogotá'   },
    { firstName: 'Sara',    lastName: 'Botero',   birthdayDate: '1997-07-11', sede: 'Medellín' },
    { firstName: 'Viviana', lastName: 'Arias',    birthdayDate: '1993-08-25', sede: 'Bogotá'   },
    { firstName: 'Carlos',  lastName: 'Muriel',   birthdayDate: '1989-09-03', sede: 'Cali'     },
    { firstName: 'Yuliana', lastName: 'Guzmán',   birthdayDate: '1995-10-17', sede: 'Bogotá'   },
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllBirthdays(): Observable<BirthdayResponse[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);

    // TODO: cuando el monolito esté listo, eliminar el mock y descomentar:
    // return this.http.get<BirthdayResponse[]>(this.apiUrl);

    return of(this.mockBirthdays);
  }
}