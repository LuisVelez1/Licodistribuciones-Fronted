import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Component } from "@angular/core";

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
    TI: [
      'Cambio de equipo',
      'Asignación de usuario',
      'Soporte técnico'
    ],
    TH: [
      'Solicitud de certificado',
      'Vacaciones',
      'Permisos'
    ],
    FACTURACIÓN: [
      'Reembolso',
      'Certificación de pagos'
    ]
  };

  requestTypes: string[] = [];
  attachments: File[] = [];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
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
    if (input.files) {
      this.attachments = Array.from(input.files);
    }
  }

    submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value,
      attachments: this.attachments,
      createdBy: {
        id: 1,
        name: 'Usuario Mock',
        email: 'usuario@empresa.com'
      }
    };

    console.log('Payload:', payload);

    this.form.reset();
    this.attachments = [];
    this.requestTypes = [];
  }
}
