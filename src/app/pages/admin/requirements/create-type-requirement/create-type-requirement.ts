import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface RequirementType {
  id: string;
  area: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-create-type-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <h2>📂 Tipos de Requerimiento</h2>

      <!-- Formulario nuevo tipo -->
      <div class="form-card">
        <h3>Agregar tipo de requerimiento</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Área *</label>
            <select [(ngModel)]="newType.area" class="form-input">
              <option value="">Seleccionar área...</option>
              <option value="TI">TI</option>
              <option value="TH">Talento Humano</option>
              <option value="FACTURACIÓN">Facturación</option>
              <option value="OPERACIONES">Operaciones</option>
              <option value="COMERCIAL">Comercial</option>
            </select>
          </div>
          <div class="form-group">
            <label>Nombre del tipo *</label>
            <input type="text" [(ngModel)]="newType.name"
              placeholder="Ej: Cambio de equipo" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <input type="text" [(ngModel)]="newType.description"
            placeholder="Descripción breve del tipo de requerimiento" class="form-input" />
        </div>
        <div class="form-actions">
          <button class="btn-save" (click)="addType()"
            [disabled]="!newType.area || !newType.name">
            Agregar tipo
          </button>
        </div>
      </div>

      <!-- Lista de tipos existentes -->
      <div class="types-list">
        @for (area of groupedAreas; track area.name) {
          <div class="area-group">
            <div class="area-header">{{ area.name }}</div>
            @for (t of area.types; track t.id) {
              <div class="type-row">
                <div class="type-info">
                  <span class="type-name">{{ t.name }}</span>
                  @if (t.description) {
                    <span class="type-desc">{{ t.description }}</span>
                  }
                </div>
                <button class="btn-delete" (click)="removeType(t.id)">✕</button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 800px; margin: 0 auto; }
    h2 { font-family: var(--font-title); color: var(--color-primary); margin-bottom: 24px; &::after{display:none;} }
    h3 { font-family: var(--font-title); color: var(--color-primary); margin-bottom: 16px; font-size: 17px; &::after{display:none;} }
    .form-card { background: #fff; border: 2px solid var(--color-accent); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;
      label { font-size: 13px; font-weight: 600; color: var(--color-primary); }
      .form-input { border: 1.5px solid var(--color-border); border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: var(--font-body); outline: none;
        &:focus { border-color: var(--color-accent); }
      }
    }
    .form-actions { display: flex; justify-content: flex-end; }
    .btn-save { background: var(--color-accent); color: #fff; border: none; border-radius: 8px; padding: 10px 24px; cursor: pointer; font-weight: 600; font-family: var(--font-body);
      &:disabled { background: var(--color-beige); cursor: not-allowed; }
      &:not(:disabled):hover { background: #b34415; }
    }
    .types-list { display: flex; flex-direction: column; gap: 16px; }
    .area-group { background: #fff; border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden; }
    .area-header { background: var(--color-primary); color: var(--color-beige); padding: 10px 16px; font-weight: 600; font-size: 13px; letter-spacing: 0.05em; }
    .type-row { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f5f0ea;
      &:last-child { border-bottom: none; }
      &:hover { background: #fdf9f5; }
    }
    .type-info { flex: 1; }
    .type-name { font-size: 14px; font-weight: 500; color: var(--color-primary); }
    .type-desc { font-size: 12px; color: var(--color-text-soft); margin-left: 8px; }
    .btn-delete { background: transparent; border: 1px solid #e0d8cc; border-radius: 6px; color: #999; cursor: pointer; padding: 4px 10px; font-size: 12px;
      &:hover { background: #ffebee; color: #c62828; border-color: #ef9a9a; }
    }
  `]
})
export class CreateTypeRequirementComponent {
  newType: Partial<RequirementType> = {};

  types: RequirementType[] = [
    { id:'1', area:'TI',          name:'Cambio de equipo',          description:'Solicitud de reemplazo de hardware' },
    { id:'2', area:'TI',          name:'Asignación de usuario',     description:'Creación de cuenta o accesos' },
    { id:'3', area:'TI',          name:'Soporte técnico',           description:'Fallas o incidentes de TI' },
    { id:'4', area:'TH',          name:'Solicitud de certificado',  description:'Certificados laborales' },
    { id:'5', area:'TH',          name:'Vacaciones',                description:'Solicitud de período vacacional' },
    { id:'6', area:'TH',          name:'Permisos',                  description:'Permisos remunerados o no remunerados' },
    { id:'7', area:'FACTURACIÓN', name:'Reembolso',                 description:'Reembolso de gastos' },
    { id:'8', area:'FACTURACIÓN', name:'Certificación de pagos',    description:'Soporte de pagos a proveedores' },
  ];

  get groupedAreas() {
    const areas = [...new Set(this.types.map(t => t.area))];
    return areas.map(a => ({ name: a, types: this.types.filter(t => t.area === a) }));
  }

  addType() {
    if (!this.newType.area || !this.newType.name) return;
    this.types.push({ id: crypto.randomUUID(), area: this.newType.area!, name: this.newType.name!, description: this.newType.description });
    this.newType = {};
  }

  removeType(id: string) {
    this.types = this.types.filter(t => t.id !== id);
  }
}
