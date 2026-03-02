import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AreaAgent } from "../models/area-agent.model";
import { API_ENDPOINTS } from "../constants/api.constants";

@Injectable({ providedIn: 'root' })
export class AreaAgentService {

  private readonly API = `${API_ENDPOINTS.requirements}/area-agents`;

  constructor(private http: HttpClient) {}

  assign(data: any) {
    return this.http.post<AreaAgent>(this.API, data);
  }

  findByArea(areaId: number) {
    return this.http.get<AreaAgent[]>(`${this.API}/area/${areaId}`);
  }

  update(id: number, data: any) {
    return this.http.put<AreaAgent>(`${this.API}/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
