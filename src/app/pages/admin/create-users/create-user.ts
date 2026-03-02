import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-create-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.scss']
})
export class CreateUsersComponent {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;
  success: string | null = null;


  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    ]],
    role: ['MANAGER', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
    position: ['', Validators.required],
    sede: ['', Validators.required],
    area: ['', Validators.required],
    birthday: ['', Validators.required],
  });

  submit() {
    if (this.loading) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.userService.createAdminUser(this.form.getRawValue()).subscribe({
            next: () => {
        this.loading = false;
        this.success = 'Usuario creado correctamente';
        this.form.reset({
            role: 'MANAGER'
        });
        },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = err?.error?.message || 'Error al crear el usuario';
      }
    });
  }
}
