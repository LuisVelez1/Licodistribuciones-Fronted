import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../../core/services/user.service';
import { UserA } from '../../../core/models/user-admin.model';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class UsersComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);

  users: UserA[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllAdminUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  createUser() {
    this.router.navigate(['/admin/create-user']);
  }

  editUser(id: string) {
    this.router.navigate(['/admin/edit-user', id]);
  }

  changePassword(id: string) {
    this.router.navigate(['/admin/change-password'], {
      queryParams: { userId: id }
    });
  }

  deleteUser(id: string) {
    if (!confirm('¿Seguro que deseas desactivar este usuario?')) return;

    this.userService.deleteAdminUser(id).subscribe({
      next: () => this.loadUsers(),
      error: err => {
        console.error('Error eliminando usuario', err);
        alert('Error al desactivar usuario');
      }
    });
  }

}

