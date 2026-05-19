import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { UserA } from "../models/user-admin.model";
import { User } from "../models/user.model";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { API_ENDPOINTS } from "../constants/api.constants";

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = API_ENDPOINTS.users; 

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  getAllAdminUsers(): Observable<UserA[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);
    return this.http.get<UserA[]>(`${this.apiUrl}/directory`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllAdminUsersInactive(): Observable<UserA[]> {
    if (!isPlatformBrowser(this.platformId)) return of([]);
    return this.http.get<UserA[]>(`${this.apiUrl}/directoryAll`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile/${id}`, { headers: this.getAuthHeaders() });
  }

  createAdminUser(data: any): Observable<UserA> {
    return this.http.post<UserA>(`${this.apiUrl}/register`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getAreas(): Observable<any[]> {
    return this.http.get<any[]>(API_ENDPOINTS.areas, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateAdminUser(id: string, data: any): Observable<UserA> {
    return this.http.put<UserA>(`${this.apiUrl}/${id}/admin-update`, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateMyProfile(data: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile/update`, data, { headers: this.getAuthHeaders() });
  }

  changeUserStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, {}, {
      params: { status },
      headers: this.getAuthHeaders()
    });
  }

  changePassword(id: string, newPassword: string) {
    return this.http.patch(
      `${this.apiUrl}/${id}/password`,
      { newPassword },
      { headers: this.getAuthHeaders() }
    );
  }

  updateAdminEmail(id: string, email: string): Observable<UserA> {
    return this.http.put<UserA>(`${this.apiUrl}/${id}/admin-update`, { email }, {
      headers: this.getAuthHeaders()
    });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { 
      headers: this.getAuthHeaders() 
    });
  }

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}