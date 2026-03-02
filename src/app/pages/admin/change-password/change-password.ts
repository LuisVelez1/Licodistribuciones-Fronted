import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

export interface PasswordCredentials {
    email: string;
    newPassword: string;
}

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePasswordComponent {

  email: string = '';
  newPassword: string = '';
  message: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit() {
    const body = {
      email: this.email,
      newPassword: this.newPassword
    };

    this.authService.changePassword(body).subscribe({
      next: () => {
        this.message = 'Contraseña actualizada exitosamente';
      },
      error: (err) => {
        console.log('ERROR:', err);

        if (err.status === 404) {
          this.message = 'Usuario no encontrado';
        } else {
          this.message = 'Error al actualizar la contraseña';
        }
      }
    });
  }
}
