import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountByStatusPipe } from './count-by-status.pipe';

export interface FixedAsset {
  id: string;
  code: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serial?: string;
  location: string;
  area: string;
  assignedTo?: string;
  status: 'activo' | 'en_mantenimiento' | 'dado_de_baja' | 'disponible';
  acquisitionDate: string;
  acquisitionValue?: number;
}

@Component({
  selector: 'app-fixed-assets',
  standalone: true,
  imports: [CommonModule, FormsModule, CountByStatusPipe],
  templateUrl: './fixed-assets.html',
  styleUrl: './fixed-assets.scss'
})
export class FixedAssetsComponent {
  showForm = false;
  searchText = '';
  filterCategory = '';
  filterStatus = '';

  categories = ['Equipos de cómputo', 'Muebles y enseres', 'Vehículos', 'Maquinaria', 'Equipos de comunicación', 'Equipos de oficina', 'Otros'];
  areas = ['Sistemas', 'RRHH', 'Operaciones', 'Ventas', 'Finanzas', 'Logística', 'Gerencia'];
  sedes = ['Bogotá', 'Medellín', 'Cali', 'Otras'];

  newAsset: Partial<FixedAsset> & { acquisitionValueStr?: string } = {};

  assets: FixedAsset[] = [
    { id: '1', code: 'AF-001', name: 'Computador Portátil Dell', category: 'Equipos de cómputo', brand: 'Dell', model: 'Latitude 5420', serial: 'SN-DELL-001', location: 'Oficina Principal - Bogotá', area: 'Sistemas', assignedTo: 'Jorge Barbosa', status: 'activo', acquisitionDate: '2023-06-15', acquisitionValue: 4500000 },
    { id: '2', code: 'AF-002', name: 'Escritorio Ejecutivo', category: 'Muebles y enseres', brand: 'Rimax', location: 'Oficina Principal - Bogotá', area: 'Gerencia', assignedTo: 'Dilson Otalvaro', status: 'activo', acquisitionDate: '2022-01-10', acquisitionValue: 850000 },
    { id: '3', code: 'AF-003', name: 'Impresora HP LaserJet', category: 'Equipos de oficina', brand: 'HP', model: 'LaserJet Pro M404n', serial: 'SN-HP-003', location: 'Piso 2 - Bogotá', area: 'RRHH', status: 'en_mantenimiento', acquisitionDate: '2021-03-22', acquisitionValue: 1200000 },
    { id: '4', code: 'AF-004', name: 'Servidor de Aplicaciones', category: 'Equipos de cómputo', brand: 'HP', model: 'ProLiant DL380', serial: 'SN-SRV-004', location: 'Centro de datos', area: 'Sistemas', status: 'activo', acquisitionDate: '2022-08-01', acquisitionValue: 18000000 },
    { id: '5', code: 'AF-005', name: 'Camioneta de Distribución', category: 'Vehículos', brand: 'Chevrolet', model: 'N300', serial: 'CHV-N300-2023', location: 'Parqueadero Medellín', area: 'Logística', assignedTo: 'Carlos Muriel', status: 'activo', acquisitionDate: '2023-02-14', acquisitionValue: 65000000 },
  ];

  filteredAssets: FixedAsset[] = [...this.assets];

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.newAsset = {};
  }

  saveAsset() {
    if (!this.newAsset.name || !this.newAsset.category || !this.newAsset.area || !this.newAsset.location) return;

    const asset: FixedAsset = {
      id: crypto.randomUUID(),
      code: `AF-${String(this.assets.length + 1).padStart(3, '0')}`,
      name: this.newAsset.name!,
      category: this.newAsset.category!,
      brand: this.newAsset.brand,
      model: this.newAsset.model,
      serial: this.newAsset.serial,
      location: this.newAsset.location!,
      area: this.newAsset.area!,
      assignedTo: this.newAsset.assignedTo,
      status: (this.newAsset.status as FixedAsset['status']) || 'activo',
      acquisitionDate: this.newAsset.acquisitionDate || new Date().toISOString().split('T')[0],
      acquisitionValue: this.newAsset.acquisitionValueStr ? parseInt(this.newAsset.acquisitionValueStr.replace(/\D/g,'')) : undefined
    };

    this.assets.unshift(asset);
    this.filterAssets();
    this.newAsset = {};
    this.showForm = false;
  }

  filterAssets() {
    const text = this.searchText.toLowerCase();
    this.filteredAssets = this.assets.filter(a => {
      const matchText = !text || a.name.toLowerCase().includes(text) || a.code.toLowerCase().includes(text) || (a.assignedTo ?? '').toLowerCase().includes(text);
      const matchCat = !this.filterCategory || a.category === this.filterCategory;
      const matchStatus = !this.filterStatus || a.status === this.filterStatus;
      return matchText && matchCat && matchStatus;
    });
  }

  getStatusLabel(s: string): string {
    return { activo: 'Activo', en_mantenimiento: 'En mantenimiento', dado_de_baja: 'Dado de baja', disponible: 'Disponible' }[s] ?? s;
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string, string> = {
      'Equipos de cómputo': '💻', 'Muebles y enseres': '🪑', 'Vehículos': '🚐',
      'Maquinaria': '⚙️', 'Equipos de comunicación': '📡', 'Equipos de oficina': '🖨️', 'Otros': '📦'
    };
    return icons[cat] ?? '📦';
  }

  formatCurrency(v?: number): string {
    if (!v) return '—';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
  }
}
