
import { Injectable } from '@angular/core';
import {
  AreaResponse,
  AreaCreateRequest,
  AreaUpdateRequest
} from '../models/area.model';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class AreaService {

  private readonly API = `${API_ENDPOINTS.areas}`;


  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<AreaResponse[]>(this.API);
  }

  findById(id: number) {
    return this.http.get<AreaResponse>(`${this.API}/${id}`);
  }

  create(request: AreaCreateRequest) {
    return this.http.post<AreaResponse>(this.API, request);
  }

  update(id: number, request: AreaUpdateRequest) {
    return this.http.put<AreaResponse>(`${this.API}/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
