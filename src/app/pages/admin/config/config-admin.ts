import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="config-container">
      <h2>⚙️ Configuración General</h2>
      <div class="config-card">
        <h3>Información de la empresa</h3>
        <div class="form-row">
          <div class="form-group"><label>Nombre</label><input type="text" value="Lico Distribuciones S.A.S." class="form-input" /></div>
          <div class="form-group"><label>NIT</label><input type="text" value="830.000.000-0" class="form-input" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Teléfono soporte</label><input type="text" value="3223392856" class="form-input" /></div>
          <div class="form-group"><label>Correo soporte</label><input type="text" value="sistemas@licodistribuciones.com" class="form-input" /></div>
        </div>
      </div>
      <div class="config-card">
        <h3>Sedes activas</h3>
        <div class="sede-list">
          @for (s of sedes; track s.name) {
            <div class="sede-row">
              <span class="sede-dot" [style.background]="s.color"></span>
              <div><div class="sede-name">{{ s.name }}</div><div class="sede-info">{{ s.region }}</div></div>
              <span class="sede-status">{{ s.active ? 'Activa' : 'Inactiva' }}</span>
            </div>
          }
        </div>
      </div>
      <div class="config-note">💡 Las funcionalidades de configuración completas estarán disponibles cuando el backend esté activo.</div>
    </div>
  `,
  styles: [`
    .config-container { padding: 24px; max-width: 800px; margin: 0 auto; }
    h2 { font-family: var(--font-title); color: var(--color-primary); margin-bottom: 24px; &::after{display:none;} }
    h3 { font-family: var(--font-title); color: var(--color-primary); margin-bottom: 16px; font-size: 17px; &::after{display:none;} }
    .config-card { background:#fff; border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;
      label { font-size: 12px; font-weight: 600; color: #555; }
      .form-input { border: 1.5px solid var(--color-border); border-radius: 8px; padding: 9px 12px; font-size: 14px; outline: none; &:focus { border-color: var(--color-accent); } }
    }
    .sede-list { display: flex; flex-direction: column; gap: 10px; }
    .sede-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #fdf9f5; border-radius: 8px; }
    .sede-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .sede-name { font-weight: 600; font-size: 14px; }
    .sede-info { font-size: 12px; color: #888; }
    .sede-status { margin-left: auto; font-size: 12px; font-weight: 600; color: #2e7d32; background: #e8f5e9; padding: 2px 10px; border-radius: 20px; }
    .config-note { background: #e3f2fd; color: #1565c0; padding: 14px 16px; border-radius: 8px; font-size: 13px; border-left: 4px solid #1976d2; }
  `]
})
export class ConfigAdminComponent {
  sedes = [
    { name: 'Quindío',    region: 'Eje Cafetero — Sede Principal', color: '#CC521B', active: true },
    { name: 'Boyacá',     region: 'Centro — Tunja', color: '#1976d2', active: true },
    { name: 'Chocó',      region: 'Pacífico — Quibdó', color: '#2e7d32', active: true },
    { name: 'San Andrés', region: 'Caribe — San Andrés Isla', color: '#7b1fa2', active: true },
  ];
}
