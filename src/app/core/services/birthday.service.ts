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

  // MOCK - cumpleaños de prueba
  private mockBirthdays: BirthdayResponse[] = [
    { firstName: 'Carlos',    lastName: 'Ramírez',  birthdayDate: '1990-02-18', sede: 'Bogotá' },
    { firstName: 'Valentina', lastName: 'Torres',   birthdayDate: '1995-02-22', sede: 'Medellín' },
    { firstName: 'Andrés',    lastName: 'Gómez',    birthdayDate: '1988-03-05', sede: 'Cali' },
    { firstName: 'Laura',     lastName: 'Martínez', birthdayDate: '1993-03-15', sede: 'Bogotá' },
    { firstName: 'Miguel',    lastName: 'Herrera',  birthdayDate: '1991-04-10', sede: 'Barranquilla' },
    { firstName: 'Sofía',     lastName: 'Castro',   birthdayDate: '1996-05-20', sede: 'Bogotá' },
    { firstName: 'Juan',      lastName: 'Pérez',    birthdayDate: '1985-12-01', sede: 'Medellín' },
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