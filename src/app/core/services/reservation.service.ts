import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation, ReservationRequest } from '../models/reservation.model';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = API_ENDPOINTS.reservations;

  constructor(private http: HttpClient) {}

  getByDate(date: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/by-date`, {
      params: new HttpParams().set('date', date)
    });
  }

  getUpcoming(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/upcoming`);
  }

  create(dto: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, dto);
  }

  cancel(id: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/cancel`, {});
  }
}