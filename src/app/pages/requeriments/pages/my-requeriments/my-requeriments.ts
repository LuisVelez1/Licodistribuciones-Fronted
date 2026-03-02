import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type RequerimentStatus = 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
type Priority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

@Component({
  standalone: true,
  selector: 'app-my-requeriments',
  imports: [CommonModule],
  templateUrl: './my-requeriments.html',
  styleUrl: './my-requeriments.scss'
})
export class MyRequerimentsComponent {
 

  requeriments = [
    {
      id: 1,
      area: 'TI',
      type: 'Soporte técnico',
      description: 'No puedo acceder al sistema',
      status: 'pendiente' as RequerimentStatus,
      priority: 'ALTA' as Priority,
      attachments: ['error.png', 'log.txt'],
      createdBy: {
        name: 'Carlos Pérez',
        email: 'carlos@empresa.com'
      },
      createdAt: '2026-02-01'
    }
  ];
}

