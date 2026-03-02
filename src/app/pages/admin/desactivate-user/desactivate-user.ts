import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-deactivate-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './desactivate-user.html',
  styleUrls: ['./desactivate-user.scss']
})
export class DesactivateUserComponent {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  loading = false;
  success: string | null = null;
  error: string | null = null;
  confirm = false;

  form = this.fb.nonNullable.group({
    userId: ['', Validators.required]
  });

  submit() {
    if (this.loading) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.confirm = true;
  }

  confirmDeactivate() {
    const { userId } = this.form.getRawValue();

    this.loading = true;
    this.success = null;
    this.error = null;

    this.userService.deleteAdminUser(userId).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Usuario desactivado correctamente';
        this.confirm = false;
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = err?.error?.message || 'Error al desactivar usuario';
        this.confirm = false;
      }
    });
  }

  cancelConfirm() {
    this.confirm = false;
  }
}
