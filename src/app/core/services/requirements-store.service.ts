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
  createdBy: { name: string; email: string; };
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RequirementsStoreService {
  private nextId = 10;

  private _requirements: Requirement[] = [
    {
      id: 1, area: 'TI', type: 'Soporte técnico',
      description: 'El equipo portátil CP-LICO-0003 no enciende luego de una actualización de Windows. Se requiere revisión urgente.',
      status: 'en_proceso', priority: 'ALTA',
      attachments: ['foto_pantalla_azul.jpg'],
      createdBy: { name: 'Darlin Aguilar', email: 'darlinaguilar269@gmail.com' },
      createdAt: '2026-03-10',
    },
    {
      id: 2, area: 'TH', type: 'Solicitud de certificado',
      description: 'Solicito certificado laboral con salario para trámite bancario. Requiero con firma y sello físico.',
      status: 'completado', priority: 'MEDIA',
      attachments: [],
      createdBy: { name: 'Angie Vargas', email: 'supermercadosboyaca@licodistribuciones.com' },
      createdAt: '2026-03-08',
    },
    {
      id: 3, area: 'TI', type: 'Asignación de usuario',
      description: 'Nuevo colaborador requiere cuenta de correo corporativo y acceso al sistema ERP. Área: Ventas — Sede Quindío.',
      status: 'pendiente', priority: 'ALTA',
      attachments: ['formato_nuevo_usuario.pdf'],
      createdBy: { name: 'Dilson Otalvaro', email: 'talentohumano@licodistribuciones.com' },
      createdAt: '2026-03-15',
    },
    {
      id: 4, area: 'FACTURACIÓN', type: 'Reembolso',
      description: 'Reembolso de gastos de transporte por visita a cliente en Tunja — $85.000. Adjunto soporte.',
      status: 'pendiente', priority: 'BAJA',
      attachments: ['recibo_transporte.pdf'],
      createdBy: { name: 'Oscar Pérez', email: 'kam@licodistribuciones.com' },
      createdAt: '2026-03-18',
    },
    {
      id: 5, area: 'TH', type: 'Vacaciones',
      description: 'Solicito período de vacaciones del 7 al 18 de abril de 2026. Ya coordiné con mi jefe directo.',
      status: 'en_proceso', priority: 'MEDIA',
      attachments: ['formato_vacaciones_firmado.pdf'],
      createdBy: { name: 'Lady Alfonso', email: 'CONT.TATIANA.AP@GMAIL.COM' },
      createdAt: '2026-03-20',
    },
    {
      id: 6, area: 'TI', type: 'Soporte técnico',
      description: 'La impresora IMP-LICO-0003 (Kyocera — Bodega Boyacá) está mostrando error de papel aunque está llena. Ya se reinició sin éxito.',
      status: 'pendiente', priority: 'MEDIA',
      attachments: [],
      createdBy: { name: 'Luis Russi', email: 'gerenciaboyaca@licodistribuciones.com' },
      createdAt: '2026-03-22',
    },
    {
      id: 7, area: 'TH', type: 'Permisos',
      description: 'Solicito permiso remunerado de medio día el 28 de marzo para cita médica especializada.',
      status: 'completado', priority: 'BAJA',
      attachments: ['cita_medica.pdf'],
      createdBy: { name: 'Jackeline Cuta', email: 'recepcion@licodistribuciones.com' },
      createdAt: '2026-03-21',
    },
    {
      id: 8, area: 'FACTURACIÓN', type: 'Certificación de pagos',
      description: 'Requiero certificación de pagos realizados al proveedor Distribuidora El Éxito S.A.S. durante 2025.',
      status: 'en_proceso', priority: 'ALTA',
      attachments: [],
      createdBy: { name: 'Harold Roldán', email: 'consumo@licodistribuciones.com' },
      createdAt: '2026-03-19',
    },
    {
      id: 9, area: 'TI', type: 'Cambio de equipo',
      description: 'El equipo CP-LICO-0021 asignado a Jhon Orellano tiene el disco duro con fallas físicas. Se requiere reemplazo urgente para no perder información.',
      status: 'pendiente', priority: 'CRITICA',
      attachments: ['reporte_diagnostico.pdf', 'foto_disco.jpg'],
      createdBy: { name: 'Jorge Barbosa', email: 'sistemas@licodistribuciones.com' },
      createdAt: '2026-03-25',
    },
  ];

  private requirementsSubject = new BehaviorSubject<Requirement[]>(this._requirements);
  requirements$ = this.requirementsSubject.asObservable();

  add(req: Omit<Requirement, 'id'>): void {
    const newReq: Requirement = { ...req, id: this.nextId++ };
    this._requirements = [newReq, ...this._requirements];
    this.requirementsSubject.next([...this._requirements]);
  }

  updateStatus(id: number, status: RequirementStatus): void {
    const req = this._requirements.find(r => r.id === id);
    if (req) {
      req.status = status;
      this.requirementsSubject.next([...this._requirements]);
    }
  }

  getAll(): Requirement[] { return this._requirements; }
}
