import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'change-email.html',
  styleUrls: ['change-email.scss']
})
export class ChangeEmailComponent {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  loading = false;
  success: string | null = null;
  error: string | null = null;

  form = this.fb.nonNullable.group({
    userId: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  submit() {
    if (this.loading) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.success = null;
    this.error = null;

    const { userId, email } = this.form.getRawValue();

    this.userService.updateAdminEmail(userId, email ).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Correo actualizado correctamente';
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = err?.error?.message || 'Error al actualizar el correo';
      }
    });
  }
}
