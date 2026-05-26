import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { RequirementsService, RequirementResponse, RequirementUpdateRequest } from '../../../../core/services/requriments.service';
import { User } from '../../../../core/models/user.model';

@Component({
  standalone: true,
  selector: 'app-area-requirements',
  imports: [CommonModule, FormsModule],
  templateUrl: './area-requirements.html',
  styleUrl: './area-requirements.scss'
})
export class AreaRequirementsComponent implements OnInit {

  currentUser: User | null = null;
  requirements: RequirementResponse[] = [];
  loading = true;

  // Modal edición
  editingReq: RequirementResponse | null = null;
  editForm: RequirementUpdateRequest = {};

  constructor(
    private userService: UserService,
    private requirementsService: RequirementsService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user.areaId) {
          this.loadAreaRequirements(user.areaId);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando usuario', err);
        this.loading = false;
      }
    });
  }

  loadAreaRequirements(areaId: number): void {
    this.loading = true;
    this.requirementsService.getByArea(areaId).subscribe({
      next: (data) => {
        this.requirements = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando requerimientos del área', err);
        this.loading = false;
      }
    });
  }

  // Edición
  openEdit(req: RequirementResponse): void {
    this.editingReq = req;
    this.editForm = {
      title: req.title,
      description: req.description,
      priority: req.priority,
      status: req.status,
      dueDate: req.dueDate
    };
  }

  closeEdit(): void {
    this.editingReq = null;
    this.editForm = {};
  }

  saveEdit(): void {
    if (!this.editingReq) return;
    this.requirementsService.update(this.editingReq.id, this.editForm).subscribe({
      next: (updated) => {
        const idx = this.requirements.findIndex(r => r.id === updated.id);
        if (idx !== -1) this.requirements[idx] = updated;
        this.closeEdit();
      },
      error: (err) => console.error('Error actualizando requerimiento', err)
    });
  }

  // Eliminación (soft delete)
  deleteReq(req: RequirementResponse): void {
    if (!confirm(`¿Eliminar el requerimiento "${req.title}"?`)) return;
    this.requirementsService.delete(req.id).subscribe({
      next: () => {
        this.requirements = this.requirements.filter(r => r.id !== req.id);
      },
      error: (err) => console.error('Error eliminando requerimiento', err)
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      PENDING:     '🕐 Pendiente',
      IN_PROGRESS: '⚙️ En proceso',
      COMPLETED:   '✅ Completado',
      REJECTED:    '❌ Rechazado'
    };
    return map[status] ?? status;
  }

  getPriorityLabel(priority: string): string {
    const map: Record<string, string> = {
      BAJA:    '🟢 Baja',
      MEDIA:   '🟡 Media',
      ALTA:    '🟠 Alta',
      CRITICA: '🔴 Crítica'
    };
    return map[priority] ?? priority;
  }
}