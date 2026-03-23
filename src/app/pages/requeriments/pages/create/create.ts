import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { RequirementsStoreService, Priority, RequirementStatus } from "../../../../core/services/requirements-store.service";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
  standalone: true,
  selector: 'app-create-requeriment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrl: './create.scss'
})
export class CreateRequerimentComponent {

  areas = ['TI', 'TH', 'FACTURACIÓN'];

  requestTypesByArea: Record<string, string[]> = {
    TI: ['Cambio de equipo', 'Asignación de usuario', 'Soporte técnico'],
    TH: ['Solicitud de certificado', 'Vacaciones', 'Permisos'],
    FACTURACIÓN: ['Reembolso', 'Certificación de pagos']
  };

  requestTypes: string[] = [];
  attachments: File[] = [];
  successMessage = '';

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private requirementsStore: RequirementsStoreService,
    private router: Router
  ) {
    this.form = this.fb.group({
      priority: ['', Validators.required],
      area: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onAreaChange(area: string) {
    this.requestTypes = this.requestTypesByArea[area] || [];
    this.form.patchValue({ type: '' });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.attachments = Array.from(input.files);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Obtener nombre del usuario desde el token JWT mock
    const userName = this.getUserNameFromToken();

    this.requirementsStore.add({
      ...this.form.value,
      priority: this.form.value.priority as Priority,
      status: 'pendiente' as RequirementStatus,
      attachments: this.attachments.map(f => f.name),
      createdBy: { name: userName, email: '' },
      createdAt: new Date().toISOString().split('T')[0]
    });

    this.successMessage = '✅ Requerimiento creado exitosamente.';
    this.form.reset();
    this.attachments = [];
    this.requestTypes = [];

    setTimeout(() => {
      this.successMessage = '';
      this.router.navigate(['/requeriments/my-requeriments']);
    }, 1500);
  }

  private getUserNameFromToken(): string {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'Usuario';
      const payload = JSON.parse(atob(token.split('.')[1]));
      // username viene como "jorge.barbosa" → convertir a "Jorge Barbosa"
      return (payload.username as string)
        .split('.')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    } catch {
      return 'Usuario';
    }
  }
}
