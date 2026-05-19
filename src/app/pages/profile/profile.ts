import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { ProfileFormComponent } from './profile-form';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, ProfileFormComponent],
  template: `
    @if (user) {
    <div class="profile-container">
      <mat-card class="profile-card">
        <div class="profile-header">
          <h2>{{ user.firstName }} {{ user.lastName }}</h2>
          <p>{{ user.email }}</p>
          <span class="role">{{ user.position || 'Empleado' }}</span>
          <p class="alert-message">SI VAS A MODIFICAR LOS NOMBRES O LOS APELLIDOS VUELVE A INICIAR SESION</p>
        </div>

        <mat-tab-group>
          <mat-tab label="Información">
            <app-profile-form
              [user]="user"
              (save)="updateProfile($event)">
            </app-profile-form>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  }
  `,
  styleUrls: ['./profile.scss']
})

export class ProfilePageComponent implements OnInit {
  user!: User;

  constructor(private userService: UserService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      this.userService.getCurrentUser().subscribe({
        next: (data) => (this.user = data),
        error: (err) => console.error('Error cargando perfil:', err),
      });
    }
  }

  updateProfile(changes: Partial<User>) {
    this.userService.updateMyProfile(changes).subscribe({
      next: (updated) => {
        this.user = { ...this.user, ...updated };
        this.notify('✅ Perfil actualizado con éxito', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.notify('❌ No se pudo actualizar el perfil', 'error');
      },
    });
  }

  private notify(msg: string, type: string) {
    this.snackBar.open(msg, '', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['snackbar-success'] : ['snackbar-error'],
    });
  }
}
