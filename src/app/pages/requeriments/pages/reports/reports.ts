import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Status = 'pendiente' | 'en_proceso' | 'aprobado' | 'rechazado';

interface ReportItem {
  id: number;
  area: string;
  description: string;
  status: Status;
  createdAt: string;
}

@Component({
  standalone: true,
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class ReportsComponent {

  requeriments: ReportItem[] = [
    { id: 1, area: 'TI', description: 'No puedo acceder', status: 'pendiente', createdAt: '2026-02-01' },
    { id: 2, area: 'TH', description: 'Solicitud vacaciones', status: 'aprobado', createdAt: '2026-01-28' }
  ];


  downloadCSV() {

    const headers = ['ID', 'Area', 'Descripción', 'Estado', 'Fecha'];

    const rows = this.requeriments.map(r => [
      r.id,
      r.area,
      r.description,
      r.status,
      r.createdAt
    ]);

    const csvContent =
      [headers, ...rows]
        .map(e => e.join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reporte_requerimientos.csv';

    link.click();
  }

  downloadPDF() {

  const html = `
    <html>
      <head>
        <title>Reporte Requerimientos</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background: #f3f4f6; }
          </style>
        </head>
        <body>

          <h2>Reporte Requerimientos</h2>

          <table>
            <tr>
              <th>ID</th>
              <th>Area</th>
              <th>Descripcion</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>

            ${this.requeriments.map(r => `
              <tr>
                <td>${r.id}</td>
                <td>${r.area}</td>
                <td>${r.description}</td>
                <td>${r.status}</td>
                <td>${r.createdAt}</td>
              </tr>
            `).join('')}

          </table>

        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const win = window.open(url, '_blank');

    win?.addEventListener('load', () => {
      win.print();
    });
  }
}
