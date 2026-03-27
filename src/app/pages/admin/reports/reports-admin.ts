import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequirementsStoreService, Requirement } from '../../../core/services/requirements-store.service';
import { BirthdayService, BirthdayResponse } from '../../../core/services/birthday.service';

@Component({
  selector: 'app-reports-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="report-container">
      <h2>📊 Reportes del Sistema</h2>

      <!-- Requerimientos por estado -->
      <div class="report-section">
        <h3>Requerimientos por estado</h3>
        <div class="stats-grid">
          @for (s of reqStats; track s.label) {
            <div class="stat-box" [class]="s.css">
              <span class="stat-n">{{ s.count }}</span>
              <span class="stat-l">{{ s.label }}</span>
            </div>
          }
        </div>
        <table class="report-table">
          <thead><tr><th>#</th><th>Área</th><th>Tipo</th><th>Solicitante</th><th>Prioridad</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            @for (r of reqs; track r.id) {
              <tr>
                <td>#{{ r.id }}</td>
                <td>{{ r.area }}</td>
                <td>{{ r.type }}</td>
                <td>{{ r.createdBy.name }}</td>
                <td><span class="prio {{ r.priority }}">{{ r.priority }}</span></td>
                <td><span class="status {{ r.status }}">{{ r.status }}</span></td>
                <td>{{ r.createdAt | date:'dd/MM/yyyy' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Cumpleaños del mes -->
      <div class="report-section">
        <h3>🎂 Cumpleaños de este mes ({{ currentMonthName }})</h3>
        <div class="bday-list">
          @if (monthBirthdays.length === 0) {
            <p class="empty">No hay cumpleaños registrados este mes.</p>
          }
          @for (b of monthBirthdays; track b.firstName) {
            <div class="bday-row">
              <div class="bday-avatar">{{ b.firstName[0] }}</div>
              <div>
                <div class="bday-name">{{ b.firstName }} {{ b.lastName }}</div>
                <div class="bday-date">{{ formatBday(b.birthdayDate) }} · {{ b.sede }}</div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .report-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
    h2 { font-family: var(--font-title); color: var(--color-primary); margin-bottom: 24px; &::after{display:none;} }
    h3 { font-family: var(--font-title); color: var(--color-primary); margin-bottom: 16px; font-size: 18px; &::after{display:none;} }
    .report-section { background:#fff; border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 20px; }
    .stat-box { border-radius: 10px; padding: 14px; text-align: center; border: 1px solid #e0d8cc;
      .stat-n { display: block; font-size: 28px; font-weight: 700; }
      .stat-l { font-size: 12px; color: #888; }
      &.pendiente { background:#fff8e1; color:#e65100; }
      &.en_proceso { background:#e3f2fd; color:#1565c0; }
      &.completado { background:#e8f5e9; color:#2e7d32; }
      &.cancelado { background:#fce4ec; color:#c62828; }
    }
    .report-table { width: 100%; border-collapse: collapse; font-size: 13px;
      th { background: var(--color-primary); color: var(--color-beige); padding: 10px 12px; text-align: left; font-size: 12px; }
      td { padding: 10px 12px; border-top: 1px solid #f0ebe3; }
      tr:hover td { background: #fdf9f5; }
    }
    .prio { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600;
      &.BAJA { background:#e8f5e9; color:#2e7d32; } &.MEDIA { background:#fff8e1; color:#e65100; }
      &.ALTA { background:#fff3e0; color:#e65100; } &.CRITICA { background:#ffebee; color:#c62828; }
    }
    .status { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600;
      &.pendiente { background:#fff8e1; color:#e65100; } &.en_proceso { background:#e3f2fd; color:#1565c0; }
      &.completado { background:#e8f5e9; color:#2e7d32; } &.cancelado { background:#fce4ec; color:#c62828; }
    }
    .bday-list { display: flex; flex-direction: column; gap: 10px; }
    .bday-row { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 8px; background: #fdf9f5; }
    .bday-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--color-accent); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .bday-name { font-weight: 600; font-size: 14px; }
    .bday-date { font-size: 12px; color: #888; }
    .empty { color: #aaa; font-style: italic; }
  `]
})
export class ReportsAdminComponent implements OnInit {
  reqs: Requirement[] = [];
  reqStats: any[] = [];
  monthBirthdays: BirthdayResponse[] = [];
  currentMonthName = '';

  constructor(
    private reqStore: RequirementsStoreService,
    private bdayService: BirthdayService
  ) {}

  ngOnInit() {
    this.reqs = this.reqStore.getAll();
    const counts = { pendiente: 0, en_proceso: 0, completado: 0, cancelado: 0 };
    this.reqs.forEach(r => { if (r.status in counts) (counts as any)[r.status]++; });
    this.reqStats = [
      { label: 'Pendiente',   count: counts.pendiente,   css: 'pendiente' },
      { label: 'En proceso',  count: counts.en_proceso,  css: 'en_proceso' },
      { label: 'Completado',  count: counts.completado,  css: 'completado' },
      { label: 'Cancelado',   count: counts.cancelado,   css: 'cancelado' },
    ];
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const now = new Date();
    this.currentMonthName = months[now.getMonth()];
    this.bdayService.getAllBirthdays().subscribe(data => {
      this.monthBirthdays = data.filter(b => {
        const m = parseInt(b.birthdayDate.split('-')[1]) - 1;
        return m === now.getMonth();
      });
    });
  }

  formatBday(d: string): string {
    const [,m,day] = d.split('-');
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${parseInt(day)} de ${months[parseInt(m)-1]}`;
  }
}
