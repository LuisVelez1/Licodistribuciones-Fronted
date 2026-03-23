import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementsStoreService, Requirement } from '../../../../core/services/requirements-store.service';

@Component({
  standalone: true,
  selector: 'app-my-requeriments',
  imports: [CommonModule],
  templateUrl: './my-requeriments.html',
  styleUrl: './my-requeriments.scss'
})
export class MyRequerimentsComponent implements OnInit {
  requeriments: Requirement[] = [];

  constructor(private store: RequirementsStoreService) {}

  ngOnInit() {
    this.store.requirements$.subscribe(reqs => {
      this.requeriments = reqs;
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      en_proceso: 'En proceso',
      completado: 'Completado',
      cancelado: 'Cancelado'
    };
    return labels[status] ?? status;
  }

  getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      BAJA: '🟢', MEDIA: '🟡', ALTA: '🟠', CRITICA: '🔴'
    };
    return icons[priority] ?? '⚪';
  }
}
