import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';
import { FixedAssetRequest, FixedAssetResponse } from '../models/fixed-asset.model';

@Injectable({
  providedIn: 'root'
})
export class FixedAssetsService {

  private baseUrl = API_ENDPOINTS.fixedAssets;

  constructor(private http: HttpClient) {}

  getAll(): Observable<FixedAssetResponse[]> {
    return this.http.get<FixedAssetResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<FixedAssetResponse> {
    return this.http.get<FixedAssetResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: FixedAssetRequest): Observable<FixedAssetResponse> {
    return this.http.post<FixedAssetResponse>(this.baseUrl, data);
  }

  update(id: string, data: FixedAssetRequest): Observable<FixedAssetResponse> {
    return this.http.put<FixedAssetResponse>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getByStatus(status: string): Observable<FixedAssetResponse[]> {
    return this.http.get<FixedAssetResponse[]>(`${this.baseUrl}/status/${status}`);
  }

  getByArea(areaId: number): Observable<FixedAssetResponse[]> {
    return this.http.get<FixedAssetResponse[]>(`${this.baseUrl}/area/${areaId}`);
  }

  getByAssignedUser(userId: string): Observable<FixedAssetResponse[]> {
    return this.http.get<FixedAssetResponse[]>(`${this.baseUrl}/assigned/${userId}`);
  }

  getUnassigned(): Observable<FixedAssetResponse[]> {
    return this.http.get<FixedAssetResponse[]>(`${this.baseUrl}/unassigned`);
  }

  search(query: string): Observable<FixedAssetResponse[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<FixedAssetResponse[]>(`${this.baseUrl}/search`, { params });
  }
}