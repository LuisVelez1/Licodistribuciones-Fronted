import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { isPlatformBrowser } from '@angular/common';

export interface BirthdayResponse {
  firstName: string;
  lastName: string;
  sede: string;
  birthDate: string;
  position: string;
}

@Injectable({ providedIn: 'root' })
export class BirthdayService {
  private readonly apiUrl = API_ENDPOINTS.birthdays;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAllBirthdays(): Observable<BirthdayResponse[]> {
    if (!isPlatformBrowser(this.platformId)) {
      return of([]);
    }
    
    return this.http.get<BirthdayResponse[]>(this.apiUrl);
  }
}