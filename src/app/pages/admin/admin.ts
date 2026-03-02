import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, MatIcon],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class AdminComponent {

  menuOpen = false;

  openSection: string | null = 'usuarios';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleSection(sectionKey: string) {
    this.openSection =
      this.openSection === sectionKey ? null : sectionKey;
  }

  sections = [
    {
      key: 'usuarios',
      label: 'Usuarios',
      icon: 'group',
      children: [
        { label: 'Ver usuarios', route: '/admin/users', icon: 'list' },
        { label: 'Crear usuario', route: '/admin/users/create', icon: 'person_add' },
        { label: 'Cambiar email', route: '/admin/users/change-email', icon: 'edit' },
        { label: 'Cambiar contraseña', route: '/admin/users/change-password', icon: 'lock' },
        { label: 'Desactivar usuario', route: '/admin/users/deactivate', icon: 'person_off' },
      ]
    },
    {
      key: 'areas',
      label: 'Áreas',
      icon: 'apartment',
      children: [
        { label: 'Listado', route: '/admin/areas', icon: 'list'},
        { label: 'Crear área', route: '/admin/areas/create', icon: 'add_business'}
      ]
    },
    {
      key: 'requerimientos',
      label: 'Requerimientos',
      icon: 'assignment',
      children: [
        { label: 'Listado', route: '/admin/requirements', icon: 'list_alt' },
        { label: 'Crear tipo de requerimiento', route: '/admin/requirements/create', icon: 'add' }
      ]
    },
    
  ];
}
