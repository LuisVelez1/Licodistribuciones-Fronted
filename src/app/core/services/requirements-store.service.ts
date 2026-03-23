import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type RequirementStatus = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
export type Priority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface Requirement {
  id: number;
  area: string;
  type: string;
  description: string;
  status: RequirementStatus;
  priority: Priority;
  attachments: string[];
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RequirementsStoreService {
  private nextId = 2;

  private _requirements: Requirement[] = [
    {
      id: 1,
      area: 'TI',
      type: 'Soporte técnico',
      description: 'No puedo acceder al sistema desde mi equipo de trabajo.',
      status: 'pendiente',
      priority: 'ALTA',
      attachments: ['error.png'],
      createdBy: { name: 'Carlos Muriel', email: 'carlos.muriel@licodist.com' },
      createdAt: '2026-02-01'
    }
  ];

  private requirementsSubject = new BehaviorSubject<Requirement[]>(this._requirements);
  requirements$ = this.requirementsSubject.asObservable();

  add(req: Omit<Requirement, 'id'>): void {
    const newReq: Requirement = { ...req, id: this.nextId++ };
    this._requirements = [newReq, ...this._requirements];
    this.requirementsSubject.next(this._requirements);
  }

  getAll(): Requirement[] {
    return this._requirements;
  }
}
