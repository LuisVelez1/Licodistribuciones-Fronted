import { Injectable } from "@angular/core";
import { API_ENDPOINTS } from "../constants/api.constants";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Requirement } from "../.././core/models/requirement.model";

@Injectable({ providedIn: 'root' })
export class RequirementsService {

private readonly API = `${API_ENDPOINTS.requirements}`;

constructor(private http: HttpClient) {}

    getAll(): Observable<Requirement[]> {
        return this.http.get<Requirement[]>(this.API);
    }

    getById(id: number): Observable<Requirement> {
        return this.http.get<Requirement>(`${this.API}/${id}`);
    }

    create(data: any): Observable<Requirement> {
        return this.http.post<Requirement>(this.API, data);
    }

    update(id: number, data: any): Observable<Requirement> {
        return this.http.put<Requirement>(`${this.API}/${id}`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API}/${id}`);
    }
}
