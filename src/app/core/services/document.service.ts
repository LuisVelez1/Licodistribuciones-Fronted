import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api.constants';

export interface DocumentResponse {
  uploadedBy: string;
  id: string;
  title: string;
  description: string;
  category: string;
  documentType: string;
  version: string;
  originalFileName: string;
  fileExtension: string;
  fileSize: number;
  fileUrl: string;
  isPublic: boolean;
  isActive: boolean;
  areaName: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private baseUrl = API_ENDPOINTS.documents;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>(this.baseUrl);
  }

  getById(id: string): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(`${this.baseUrl}/${id}`);
  }

  getByCategory(category: string): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>(
      `${this.baseUrl}/category/${category}`
    );
  }

  upload(form: any, file: File, userId: string): Observable<DocumentResponse> {

    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(form)], { type: 'application/json' })
    );

    formData.append('file', file);
    formData.append('userId', userId);

    return this.http.post<DocumentResponse>(
      `${this.baseUrl}/upload`,
      formData
    );
  }

  update(id: string, data: any, userId: string): Observable<DocumentResponse> {
    return this.http.put<DocumentResponse>(
      `${this.baseUrl}/${id}?userId=${userId}`,
      data
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  download(id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${id}`, {
      responseType: 'blob'
    });
  }
}