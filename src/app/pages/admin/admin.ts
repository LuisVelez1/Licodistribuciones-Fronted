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

  toggleMenu()  { this.menuOpen = !this.menuOpen; }
  closeMenu()   { this.menuOpen = false; }
  toggleSection(key: string) {
    this.openSection = this.openSection === key ? null : key;
  }

  sections = [
    {
      key: 'usuarios', label: 'Usuarios', icon: 'group',
      children: [
        { label: 'Ver todos los usuarios',  route: '/admin/users',                 icon: 'list' },
        { label: 'Crear usuario',           route: '/admin/users/create',          icon: 'person_add' },
        { label: 'Actualizar usuario',      route: '/admin/users/update',          icon: 'edit'},
        { label: 'Cambiar contraseña',      route: '/admin/users/change-password', icon: 'lock' },
        { label: 'Cambiar estado',          route: '/admin/users/change-status',      icon: 'person_off' },
      ]
    },
    {
      key: 'areas', label: 'Áreas y Cargos', icon: 'apartment',
      children: [
        { label: 'Listado de áreas',    route: '/admin/areas',        icon: 'list' },
        { label: 'Crear área',          route: '/admin/areas/create', icon: 'add_business' },
      ]
    },
    {
      key: 'requerimientos', label: 'Requerimientos', icon: 'assignment',
      children: [
        { label: 'Todos los requerimientos', route: '/admin/requirements',        icon: 'list_alt' },
        { label: 'Tipos de requerimiento',   route: '/admin/requirements/create', icon: 'category' },
      ]
    },
    {
      key: 'activos', label: 'Activos Fijos', icon: 'inventory_2',
      children: [
        { label: 'Ver inventario',     route: '/fixed-assets',              icon: 'list' },
      ]
    }
  ];
}
