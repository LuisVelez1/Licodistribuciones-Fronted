import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Agent {
  id: number;
  name: string;
  cedula: string;
  phone: string;
  area: string;
  assigned: number;
  active: boolean;
}

@Component({
  standalone: true,
  selector: 'app-agents',
  imports: [CommonModule],
  templateUrl: './agents.html',
  styleUrl: './agents.scss'
})
export class AgentsComponent {

  isDrawerOpen: boolean = false;

  openDrawer() {
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  agents: Agent[] = [
    {
      id: 1,
      name: 'Carlos Pérez',
      cedula: '1234567890',
      phone: '3001234567',
      area: 'TI',
      assigned: 5,
      active: true
    },
    {
      id: 2,
      name: 'Laura Gómez',
      cedula: '0987654321',
      phone: '3009876543',
      area: 'TH',
      assigned: 2,
      active: true
    },
    {
      id: 3,
      name: 'Andrés Ruiz',
      cedula: '1122334455',
      phone: '3001122334',
      area: 'Facturación',
      assigned: 0,
      active: false
    }
  ];

}
