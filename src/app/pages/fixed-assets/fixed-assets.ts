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
  serial?: string;
  location: string;
  sede: string;
  area: string;
  assignedTo?: string;
  status: 'activo' | 'en_mantenimiento' | 'dado_de_baja' | 'disponible';
  acquisitionDate: string;
  acquisitionValue?: number;
  description?: string;
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
  filterSede = '';

  categories = [
    'Portátil','PC de Escritorio','PC Mini / All-in-One','Monitor',
    'Impresora','Router / Access Point','UPS','DVR / NVR',
    'Celular / Teléfono','Videobeam / Proyector'
  ];
  sedes = ['Quindío','Boyacá','Chocó','San Andrés'];
  areas = ['Sistemas','Talento Humano','Administrativa','Logística','Ventas','Contabilidad','Cartera','Comercial','General'];

  newAsset: Partial<FixedAsset> & { acquisitionValueStr?: string } = {};

  assets: FixedAsset[] = [
    { id: '1', code: 'CP-LICO-0001', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: 'PW-OBL48N', location: 'Quindío', area: 'Sistemas', assignedTo: 'Jorge Barbosa', status: 'activo', acquisitionDate: '2025-03-15', acquisitionValue: 4000000, description: 'EQUIPO PORTATIL NUEVO', sede: 'Quindío' },
    { id: '2', code: 'MON-LICO-0001', name: 'Dahua — Monitor', category: 'Monitor', brand: 'Dahua', serial: 'BAD01916301150396', location: 'Quindío', area: 'Sistemas', assignedTo: 'Jorge Barbosa', status: 'activo', acquisitionDate: '2025-10-20', acquisitionValue: 520000, description: 'MONITOR 27\"', sede: 'Quindío' },
    { id: '3', code: 'CP-LICO-0002', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '565L344', location: 'Quindío', area: 'Sistemas', assignedTo: 'Dilson Otalvaro', status: 'activo', acquisitionDate: '2025-10-22', acquisitionValue: 3500000, description: 'EQUIPO NUEVO TALENTO HUMANO', sede: 'Quindío' },
    { id: '4', code: 'MON-LICO-0002', name: 'Dahua — Monitor', category: 'Monitor', brand: 'Dahua', serial: 'BAD01916301150234', location: 'Quindío', area: 'Sistemas', assignedTo: 'Dilson Otalvaro', status: 'activo', acquisitionDate: '2025-10-22', acquisitionValue: 550000, description: 'MONITOR 27\" DAHUA', sede: 'Quindío' },
    { id: '5', code: 'TC-LICO-0001', name: 'Samsung — Celular / Teléfono', category: 'Celular / Teléfono', brand: 'Samsung', serial: 'RF8X20TW9LX', location: 'Quindío', area: 'General', assignedTo: 'Dilson Otalvaro', status: 'activo', acquisitionDate: '2025-10-22', acquisitionValue: 600000, description: 'CELULAR LÍNEA 3206682609', sede: 'Quindío' },
    { id: '6', code: 'CP-LICO-0003', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CG11585F3', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Darlin Aguilar', status: 'activo', acquisitionDate: '2024-10-28', acquisitionValue: 3500000, description: 'EQUIPO PORTATIL REASIGNADO', sede: 'Boyacá' },
    { id: '7', code: 'ROU-LICO-0001', name: 'TP-Link — Router / Access Point', category: 'Router / Access Point', brand: 'TP-Link', serial: '224B889001769', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Luis Russi', status: 'activo', acquisitionDate: '2025-10-28', acquisitionValue: 750000, description: 'ACCESS POINT BODEGA BOYACÁ', sede: 'Boyacá' },
    { id: '8', code: 'CP-LICO-0004', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CG024F5H6', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Capacitación', status: 'activo', acquisitionDate: '2023-10-29', acquisitionValue: 3000000, description: 'EQUIPO CONTINGENCIA / CAPACITACIONES', sede: 'Quindío' },
    { id: '9', code: 'CP-LICO-0005', name: 'Acer — Portátil', category: 'Portátil', brand: 'Acer', serial: 'NXHS6AL162040F7173400', location: 'Quindío', area: 'Sistemas', assignedTo: 'Jackeline Cuta', status: 'activo', acquisitionDate: '2023-10-29', acquisitionValue: 3000000, description: 'Disco: 512 GB HDD, RAM: 8 GB DDR4, CPU: CORE I3-1011 2.1GHZ', sede: 'Quindío' },
    { id: '10', code: 'VB-LICO-0001', name: 'Epson — Videobeam / Proyector', category: 'Videobeam / Proyector', brand: 'Epson', serial: 'X8B74Z01550', location: 'Quindío', area: 'General', assignedTo: 'Jorge Barbosa', status: 'activo', acquisitionDate: '2025-11-05', acquisitionValue: 3500000, description: 'VIDEOBEAM EPSON H983A POWERLITE W49', sede: 'Quindío' },
    { id: '11', code: 'IMP-LICO-0001', name: 'Epson — Videobeam / Proyector', category: 'Videobeam / Proyector', brand: 'Epson', serial: 'XAH2359522', location: 'Chocó', area: 'General', assignedTo: 'Colaborador Istmina', status: 'activo', acquisitionDate: '2025-11-05', acquisitionValue: 1100000, description: 'IMPRESORA SUCURSAL ISTMINA / CHOCÓ', sede: 'Chocó' },
    { id: '12', code: 'CP-LICO-0006', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CD9387CFB', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Armenia 3', status: 'activo', acquisitionDate: '2024-11-11', acquisitionValue: 3000000, description: 'Disco: 256 GB SDD, RAM: 8 GB DDR4, CPU: CORE I3-1011 2.1GHZ', sede: 'Quindío' },
    { id: '13', code: 'MON-LICO-0003', name: 'HP — Monitor', category: 'Monitor', brand: 'HP', serial: 'LS19A330NHLXZL', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Darlin Aguilar', status: 'activo', acquisitionDate: '2024-11-11', acquisitionValue: 500000, description: '', sede: 'Boyacá' },
    { id: '14', code: 'CP-LICO-0007', name: 'Asus — Portátil', category: 'Portátil', brand: 'Asus', serial: 'PF9XB5516250', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Maria Alejandra Nontoa', status: 'activo', acquisitionDate: '2024-11-11', acquisitionValue: 2800000, description: 'Disco: 256 GB SDD, RAM: 16 GB DDR4, CPU: AMD RYZEN 5 7520U', sede: 'Boyacá' },
    { id: '15', code: 'IMP-LICO-0002', name: 'Epson — Impresora', category: 'Impresora', brand: 'Epson', serial: 'LZK6871424', location: 'Boyacá', area: 'General', assignedTo: 'Lady Alfonso', status: 'activo', acquisitionDate: '2024-11-11', acquisitionValue: 0, description: '', sede: 'Boyacá' },
    { id: '16', code: 'IMP-LICO-0003', name: 'Kyocera — Impresora', category: 'Impresora', brand: 'Kyocera', serial: 'VND3C60928', location: 'Boyacá', area: 'General', assignedTo: 'Luis Russi', status: 'activo', acquisitionDate: '2024-11-11', acquisitionValue: 4500000, description: '', sede: 'Boyacá' },
    { id: '17', code: 'CE-LICO-0001', name: 'Lenovo — PC Mini / All-in-One', category: 'PC Mini / All-in-One', brand: 'Lenovo', serial: 'MJPLELV', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Darlin Aguilar', status: 'activo', acquisitionDate: '2023-11-11', acquisitionValue: 2800000, description: 'Disco: 256 GB SDD, RAM: 4 GB , CPU: CORE I5-2400S', sede: 'Boyacá' },
    { id: '18', code: 'MON-LICO-0004', name: 'LG — Monitor', category: 'Monitor', brand: 'LG', serial: 'J1913LE1104011631', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Darlin Aguilar', status: 'activo', acquisitionDate: '2023-11-11', acquisitionValue: 600000, description: '', sede: 'Boyacá' },
    { id: '19', code: 'CP-LICO-0008', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CG142C8DW', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Armenia 2', status: 'activo', acquisitionDate: '2024-11-11', acquisitionValue: 3000000, description: 'Disco: 256 GB SDD, RAM: 4 GB DDR4, CPU: CORE I3 10110U', sede: 'Quindío' },
    { id: '20', code: 'CP-LICO-0009', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CD9515WMX', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Jorge Sanabria', status: 'activo', acquisitionDate: '2024-11-11', acquisitionValue: 3200000, description: 'Disco: 256 GB SDD, RAM: 4 GB DDR4, CPU: CORE I3-1011 2.1GHZ', sede: 'Boyacá' },
    { id: '21', code: 'CP-LICO-0010', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: 'CND2341QPV', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Luis Russi', status: 'activo', acquisitionDate: '2024-11-11', acquisitionValue: 3500000, description: 'Disco: 256 GB SDD, RAM: 12 GB DDR4, CPU: CORE I3-1011 2.1GHZ', sede: 'Boyacá' },
    { id: '22', code: 'DVR-LICO-001', name: 'Dahua — DVR / NVR', category: 'DVR / NVR', brand: 'Dahua', serial: 'GA8777548', location: 'Boyacá', area: 'General', assignedTo: 'Luis Russi', status: 'activo', acquisitionDate: '2025-11-14', acquisitionValue: 2500000, description: 'NVR 16 PUERTOS IP/POE - DISCO 4TB - BODEGA TUNJA', sede: 'Boyacá' },
    { id: '23', code: 'IMP-LICO-0005', name: 'Epson — Impresora', category: 'Impresora', brand: 'Epson', serial: 'X644706867', location: 'Boyacá', area: 'General', assignedTo: 'Luis Russi', status: 'activo', acquisitionDate: '2024-11-14', acquisitionValue: 1500000, description: 'IMPRESORA BANCO DE TINTA', sede: 'Boyacá' },
    { id: '24', code: 'MON-LICO-0005', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW800259F', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Dayana Molina', status: 'activo', acquisitionDate: '2025-11-14', acquisitionValue: 0, description: 'MONITOR CON BRAZO ERGONÓMICO', sede: 'Boyacá' },
    { id: '25', code: 'IMP-LICO-0004', name: 'Epson — Impresora', category: 'Impresora', brand: 'Epson', serial: 'XAGZG04195', location: 'Boyacá', area: 'General', assignedTo: 'Dayana Molina', status: 'activo', acquisitionDate: '2025-11-14', acquisitionValue: 1500000, description: 'IMPRESORA MERCADEO', sede: 'Boyacá' },
    { id: '26', code: 'VB-LICO-0002', name: 'Byintek — Videobeam / Proyector', category: 'Videobeam / Proyector', brand: 'Byintek', serial: 'HY300 PRO', location: 'Boyacá', area: 'General', assignedTo: 'Darlin Aguilar', status: 'activo', acquisitionDate: '2025-11-14', acquisitionValue: 1500000, description: 'VIDEO PROYECTOR SEDE BOYACÁ', sede: 'Boyacá' },
    { id: '27', code: 'CP-LICO-0011', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CG5104Y14', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Angie Vargas', status: 'activo', acquisitionDate: '2024-11-14', acquisitionValue: 0, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: AMD RYZEN 3 7520U', sede: 'Boyacá' },
    { id: '28', code: 'T1-LICO-001', name: 'Lenovo — PC de Escritorio', category: 'PC de Escritorio', brand: 'Lenovo', serial: '10BD004DLS', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Armenia', status: 'activo', acquisitionDate: '2023-11-14', acquisitionValue: 2800000, description: 'Disco: 256 GB SDD, RAM: 4 GB DDR4, CPU: PENTIUM G3220', sede: 'Quindío' },
    { id: '29', code: 'IMP-LICO-0006', name: 'Canon — Impresora', category: 'Impresora', brand: 'Canon', serial: 'U67271D4N530216', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Quindío', status: 'activo', acquisitionDate: '2025-11-25', acquisitionValue: 900000, description: 'IMPRESORA ÁREA CARTERA - QUINDÍO', sede: 'Quindío' },
    { id: '30', code: 'CP-LICO-0012', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '4XTD894', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Lady Alfonso', status: 'activo', acquisitionDate: '2025-12-12', acquisitionValue: 0, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 13 GENERACION', sede: 'Boyacá' },
    { id: '31', code: 'CP-LICO-0013', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CG32114NC', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Dayana Molina', status: 'activo', acquisitionDate: '2025-11-13', acquisitionValue: 2800000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 13 GENERACION', sede: 'Boyacá' },
    { id: '32', code: 'TC-LICO-0002', name: 'Samsung — Celular / Teléfono', category: 'Celular / Teléfono', brand: 'Samsung', serial: 'RF8X20TXJVE', location: 'San Andrés', area: 'General', assignedTo: 'Colaborador San Andrés', status: 'activo', acquisitionDate: '2025-12-23', acquisitionValue: 700000, description: 'CELULAR 3206174559', sede: 'San Andrés' },
    { id: '33', code: 'MON-LICO-0006', name: 'Hyundai — Monitor', category: 'Monitor', brand: 'Hyundai', serial: '51065/256100087749', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Colaborador Hyundai', status: 'activo', acquisitionDate: '2025-12-30', acquisitionValue: 550000, description: '', sede: 'Boyacá' },
    { id: '34', code: 'MON-LICO-0007', name: 'Hyundai — Monitor', category: 'Monitor', brand: 'Hyundai', serial: '51065/256100087773', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Colaborador Hyundai', status: 'activo', acquisitionDate: '2025-12-30', acquisitionValue: 550000, description: '', sede: 'Boyacá' },
    { id: '35', code: 'CP-LICO-0014', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '4X3PQ74', location: 'San Andrés', area: 'Sistemas', assignedTo: 'Doris Blanco', status: 'activo', acquisitionDate: '2025-12-30', acquisitionValue: 2800000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 13 GENERACION', sede: 'San Andrés' },
    { id: '36', code: 'MON-LICO-0008', name: 'Dell — Monitor', category: 'Monitor', brand: 'Dell', serial: 'CN-0HN22V-FCC00-1B7CA9B', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Maria Alejandra Nontoa', status: 'activo', acquisitionDate: '2026-01-06', acquisitionValue: 400000, description: 'MONITOR 19\" BASE', sede: 'Boyacá' },
    { id: '37', code: 'MON-LICO-0009', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW8002072E', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Darlin Aguilar', status: 'activo', acquisitionDate: '2026-01-01', acquisitionValue: 450000, description: '', sede: 'Boyacá' },
    { id: '38', code: 'IMP-LICO-0007', name: 'Kyocera — Impresora', category: 'Impresora', brand: 'Kyocera', serial: 'WDS5671357', location: 'Quindío', area: 'General', assignedTo: 'Dilson Otalvaro', status: 'activo', acquisitionDate: '2026-01-19', acquisitionValue: 6000000, description: 'IMPRESORA ÁREA CONTABLE', sede: 'Quindío' },
    { id: '39', code: 'MON-LICO-0010', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: 'LS22D310EANXZA', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Lady Alfonso', status: 'activo', acquisitionDate: '2026-01-22', acquisitionValue: 420000, description: 'MONITOR 22\" NUEVO', sede: 'Boyacá' },
    { id: '40', code: 'MON-LICO-0011', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW801550A', location: 'Quindío', area: 'Sistemas', assignedTo: 'Oscar Pérez', status: 'activo', acquisitionDate: '2026-01-22', acquisitionValue: 420000, description: 'MONITOR BRAZO ERGONÓMICO', sede: 'Quindío' },
    { id: '41', code: 'MON-LICO-0012', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '6Q46H9PYA04056', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Financiero', status: 'activo', acquisitionDate: '2026-01-22', acquisitionValue: 420000, description: 'MONITOR 22\" BRAZO ERGONÓMICO', sede: 'Quindío' },
    { id: '42', code: 'CP-LICO-0015', name: 'Asus — Portátil', category: 'Portátil', brand: 'Asus', serial: 'PF5P2EH2', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Nuevo', status: 'activo', acquisitionDate: '2026-01-28', acquisitionValue: 2800000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: AMD RYZEN 5 7520U', sede: 'Quindío' },
    { id: '43', code: 'MON-LICO-0013', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '6Q46H9PYA03217', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Ventas', status: 'activo', acquisitionDate: '2026-01-28', acquisitionValue: 420000, description: 'MONITOR 22\" NUEVO', sede: 'Quindío' },
    { id: '44', code: 'TC-LICO-0003', name: 'Motorola — Celular / Teléfono', category: 'Celular / Teléfono', brand: 'Motorola', serial: 'R58YA126H2A', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Nuevo', status: 'activo', acquisitionDate: '2026-01-29', acquisitionValue: 700000, description: 'CELULAR NUEVO - MÓVIL 3102805393', sede: 'Quindío' },
    { id: '45', code: 'CP-LICO-0016', name: 'Samsung — Portátil', category: 'Portátil', brand: 'Samsung', serial: 'R9N0CX02P2393CB', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Externo 2', status: 'activo', acquisitionDate: '2024-02-04', acquisitionValue: 2800000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '46', code: 'MON-LICO-0014', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW802248L', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Externo 2', status: 'activo', acquisitionDate: '2025-02-04', acquisitionValue: 420000, description: '', sede: 'Quindío' },
    { id: '47', code: 'TC-LICO-0004', name: 'Samsung — Celular / Teléfono', category: 'Celular / Teléfono', brand: 'Samsung', serial: 'R58TB1SJWOK', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Externo 2', status: 'activo', acquisitionDate: '2024-02-04', acquisitionValue: 700000, description: 'CELULAR', sede: 'Quindío' },
    { id: '48', code: 'CP-LICO-0017', name: 'Samsung — Portátil', category: 'Portátil', brand: 'Samsung', serial: 'S8NOCX13X47435A', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2025-02-04', acquisitionValue: 2800000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Chocó' },
    { id: '49', code: 'TC-LICO-0005', name: 'Samsung — Celular / Teléfono', category: 'Celular / Teléfono', brand: 'Samsung', serial: '354704217528339', location: 'Chocó', area: 'General', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2025-02-04', acquisitionValue: 700000, description: '', sede: 'Chocó' },
    { id: '50', code: 'CP-LICO-0018', name: 'Toshiba — Portátil', category: 'Portátil', brand: 'Toshiba', serial: 'QFBBB21919800410', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Toshiba', status: 'activo', acquisitionDate: '2025-02-04', acquisitionValue: 3000000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: AMD RYZEN 7', sede: 'Quindío' },
    { id: '51', code: 'T1-LICO-002', name: 'Lenovo — PC de Escritorio', category: 'PC de Escritorio', brand: 'Lenovo', serial: 'PALC311050077', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Archivo', status: 'activo', acquisitionDate: '2022-02-05', acquisitionValue: 0, description: 'Disco: 256 GB SDD, RAM: 4 GB DDR4, CPU: CORE I3-1011 2.1GHZ', sede: 'Quindío' },
    { id: '52', code: 'T1-LICO-003', name: 'HP — PC de Escritorio', category: 'PC de Escritorio', brand: 'HP', serial: '8CC3213334', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Colaborador Boyacá 3', status: 'activo', acquisitionDate: '2025-02-05', acquisitionValue: 3000000, description: 'Disco: 256 GB SDD, RAM: 8 GB DDR4, CPU: INTEL CELERON J4025', sede: 'Boyacá' },
    { id: '53', code: 'T1-LICO-004', name: 'Lenovo — PC de Escritorio', category: 'PC de Escritorio', brand: 'Lenovo', serial: 'MXL4501XB0', location: 'San Andrés', area: 'Sistemas', assignedTo: 'Colaborador San Andrés 2', status: 'activo', acquisitionDate: '2022-02-05', acquisitionValue: 3000000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: CORE I7-2400S', sede: 'San Andrés' },
    { id: '54', code: 'CP-LICO-0019', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: 'F6G6754', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Contabilidad', status: 'activo', acquisitionDate: '2025-02-05', acquisitionValue: 3000000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Chocó' },
    { id: '55', code: 'IMP-LICO-0008', name: 'Brother — Impresora', category: 'Impresora', brand: 'Brother', serial: 'THBGT7903P', location: 'Chocó', area: 'General', assignedTo: 'Colaborador Contabilidad', status: 'activo', acquisitionDate: '2025-02-05', acquisitionValue: 3200000, description: 'ÁREA CONTABILIDAD QUIBDÓ', sede: 'Chocó' },
    { id: '56', code: 'T1-LICO-005', name: 'Lenovo — PC de Escritorio', category: 'PC de Escritorio', brand: 'Lenovo', serial: '7831689800151', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó 2', status: 'activo', acquisitionDate: '2025-02-05', acquisitionValue: 3200000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4', sede: 'Chocó' },
    { id: '57', code: 'IMP-LICO-0009', name: 'Brother — Impresora', category: 'Impresora', brand: 'Brother', serial: 'VNB3D87743', location: 'Chocó', area: 'General', assignedTo: 'Colaborador Quibdó 2', status: 'activo', acquisitionDate: '2025-02-05', acquisitionValue: 800000, description: 'IMPRESORA LÁSER FACTURACIÓN QUIBDÓ', sede: 'Chocó' },
    { id: '58', code: 'MON-LICO-0015', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW801765R', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Contabilidad', status: 'activo', acquisitionDate: '2026-02-05', acquisitionValue: 420000, description: '', sede: 'Chocó' },
    { id: '59', code: 'T1-LICO-006', name: 'Lenovo — PC de Escritorio', category: 'PC de Escritorio', brand: 'Lenovo', serial: 'MP1Z6KYQ', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó 3', status: 'activo', acquisitionDate: '2025-02-05', acquisitionValue: 3200000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: AMD RYZEN 5 7520U', sede: 'Chocó' },
    { id: '60', code: 'CP-LICO-0020', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '4227D74', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador RRHH 2', status: 'activo', acquisitionDate: '2025-02-06', acquisitionValue: 3200000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '61', code: 'MON-LICO-0016', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H4TW200173B', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador RRHH 2', status: 'activo', acquisitionDate: '2025-02-06', acquisitionValue: 420000, description: '', sede: 'Quindío' },
    { id: '62', code: 'CP-LICO-0021', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CD2486H02', location: 'San Andrés', area: 'Sistemas', assignedTo: 'Jhon Orellano', status: 'activo', acquisitionDate: '2023-02-16', acquisitionValue: 0, description: 'Disco: 256 GB SDD, RAM: 8 GB DDR4, CPU: INTEL CELERON J4025', sede: 'San Andrés' },
    { id: '63', code: 'CP-LICO-0022', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '4GSL344', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Externo', status: 'activo', acquisitionDate: '2025-09-10', acquisitionValue: 2800000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '64', code: 'MON-LICO-0017', name: 'Dahua — Monitor', category: 'Monitor', brand: 'Dahua', serial: 'BAD01916301150396', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Externo', status: 'activo', acquisitionDate: '2025-09-16', acquisitionValue: 450000, description: 'Monitor 27\"', sede: 'Quindío' },
    { id: '65', code: 'UPS-LICO-001', name: 'APC — UPS', category: 'UPS', brand: 'APC', serial: 'E1910800124', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 0, description: 'UPS 3000V MONOFÁSICA - QUIBDÓ 3 PISO', sede: 'Chocó' },
    { id: '66', code: 'IMP-LICO-0010', name: 'Brother — Impresora', category: 'Impresora', brand: 'Brother', serial: 'VNB6P00696', location: 'Chocó', area: 'General', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2023-02-01', acquisitionValue: 700000, description: 'IMPRESORA LÁSER PUESTO TRABAJO QUIBDÓ', sede: 'Chocó' },
    { id: '67', code: 'T1-LICO-007', name: 'HP — PC de Escritorio', category: 'PC de Escritorio', brand: 'HP', serial: '1CZ10209MF', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Punto Venta', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 1400000, description: 'Disco: 128 GB SDD, RAM: 4 GB DDR4, CPU: INTEL PENTIUM', sede: 'Quindío' },
    { id: '68', code: 'CP-LICO-0023', name: 'Asus — Portátil', category: 'Portátil', brand: 'Asus', serial: 'PF4VRBCQ', location: 'Boyacá', area: 'Sistemas', assignedTo: 'Colaborador Boyacá 2', status: 'activo', acquisitionDate: '2024-04-13', acquisitionValue: 2400000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Boyacá' },
    { id: '69', code: 'MON-LICO-0018', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW800280J', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Medios', status: 'activo', acquisitionDate: '2024-06-02', acquisitionValue: 450000, description: '', sede: 'Quindío' },
    { id: '70', code: 'CP-LICO-0024', name: 'Acer — Portátil', category: 'Portátil', brand: 'Acer', serial: 'NXK6SAL00H322046B63400', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Medios', status: 'activo', acquisitionDate: '2023-07-16', acquisitionValue: 2400000, description: 'Disco: 512 GB SDD, RAM: 8 GB', sede: 'Quindío' },
    { id: '71', code: 'IMP-LICO-0011', name: 'Epson — Impresora', category: 'Impresora', brand: 'Epson', serial: 'XBBV025882', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Medios', status: 'activo', acquisitionDate: '2023-01-01', acquisitionValue: 1200000, description: 'INYECCIÓN DE TINTA', sede: 'Quindío' },
    { id: '72', code: 'IMP-LICO-0012', name: 'Epson — Impresora', category: 'Impresora', brand: 'Epson', serial: 'XAH2201731', location: 'Chocó', area: 'General', assignedTo: 'Colaborador Chocó', status: 'activo', acquisitionDate: '2023-01-01', acquisitionValue: 1200000, description: '', sede: 'Chocó' },
    { id: '73', code: 'MON-LICO-0019', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW802197V', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Chocó', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 1200000, description: '', sede: 'Chocó' },
    { id: '74', code: 'CP-LICO-0025', name: 'Asus — Portátil', category: 'Portátil', brand: 'Asus', serial: 'PF4MH83C', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Chocó', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 2600000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: AMD RYZEN 5 7520U', sede: 'Chocó' },
    { id: '75', code: 'MON-LICO-0020', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW802201J', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Quindío 2', status: 'activo', acquisitionDate: '2025-07-07', acquisitionValue: 450000, description: '', sede: 'Quindío' },
    { id: '76', code: 'CP-LICO-0026', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '2RS6754', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Quindío 2', status: 'activo', acquisitionDate: '2025-08-05', acquisitionValue: 2800000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '77', code: 'T1-LICO-008', name: 'Lenovo — PC de Escritorio', category: 'PC de Escritorio', brand: 'Lenovo', serial: 'MP1ZGGKP', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Ventas 2', status: 'activo', acquisitionDate: '2024-09-13', acquisitionValue: 2600000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '78', code: 'CP-LICO-0027', name: 'Asus — Portátil', category: 'Portátil', brand: 'Asus', serial: 'PF2DK8FZ', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Operaciones', status: 'activo', acquisitionDate: '2024-05-01', acquisitionValue: 2600000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: AMD RYZEN 5 7520U', sede: 'Quindío' },
    { id: '79', code: 'MON-LICO-0021', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H4TW400423J', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Operaciones', status: 'activo', acquisitionDate: '2024-09-08', acquisitionValue: 450000, description: '', sede: 'Quindío' },
    { id: '80', code: 'MON-LICO-0022', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW801717P', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Comercial', status: 'activo', acquisitionDate: '2024-11-10', acquisitionValue: 450000, description: '', sede: 'Quindío' },
    { id: '81', code: 'CP-LICO-0028', name: 'Samsung — Portátil', category: 'Portátil', brand: 'Samsung', serial: 'SANOCV158531449', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Comercial', status: 'activo', acquisitionDate: '2024-06-04', acquisitionValue: 2600000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '82', code: 'MON-LICO-0023', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H9DW802316F', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Chocó 3', status: 'activo', acquisitionDate: '2024-10-02', acquisitionValue: 450000, description: '', sede: 'Chocó' },
    { id: '83', code: 'CP-LICO-0029', name: 'Samsung — Portátil', category: 'Portátil', brand: 'Samsung', serial: 'SBNOCV00J704448', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Chocó 3', status: 'activo', acquisitionDate: '2024-03-29', acquisitionValue: 2600000, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: AMD RYZEN 5 7520U', sede: 'Chocó' },
    { id: '84', code: 'MON-LICO-0024', name: 'Samsung — Monitor', category: 'Monitor', brand: 'Samsung', serial: '5E73H4TW200668E', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Chocó 2', status: 'activo', acquisitionDate: '2024-12-09', acquisitionValue: 450000, description: '', sede: 'Chocó' },
    { id: '85', code: 'IMP-LICO-0013', name: 'Kyocera — Impresora', category: 'Impresora', brand: 'Kyocera', serial: 'MXFCH2Q01H', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Facturación', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 0, description: 'IMPRESORA LÁSER FACTURACIÓN', sede: 'Quindío' },
    { id: '86', code: 'IMP-LICO-0014', name: 'HP — Impresora', category: 'Impresora', brand: 'HP', serial: 'MXBCJCJOS6', location: 'Quindío', area: 'General', assignedTo: 'Jackeline Cuta', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 0, description: 'IMPRESORA RECEPCIÓN', sede: 'Quindío' },
    { id: '87', code: 'CP-LICO-0030', name: 'HP — Portátil', category: 'Portátil', brand: 'HP', serial: '5CG024F4VB', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Facturación', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 0, description: 'Disco: 256 GB SDD, RAM: 4 GB DDR4, CPU: AMD RYZEN 3 7520U', sede: 'Quindío' },
    { id: '88', code: 'CP-LICO-0031', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '7RY6754', location: 'Quindío', area: 'Sistemas', assignedTo: 'Oscar Pérez', status: 'activo', acquisitionDate: '2025-06-01', acquisitionValue: 3200000, description: 'CON CARGADOR ORIGINAL', sede: 'Quindío' },
    { id: '89', code: 'CP-LICO-0032', name: 'Samsung — Portátil', category: 'Portátil', brand: 'Samsung', serial: 'RBN0LP00T351453', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Sistemas', status: 'activo', acquisitionDate: '2025-01-01', acquisitionValue: 0, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I7 12 GENERACION', sede: 'Quindío' },
    { id: '90', code: 'IMP-LICO-0015', name: 'Epson — Impresora', category: 'Impresora', brand: 'Epson', serial: 'XAGB324925', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Sistemas', status: 'activo', acquisitionDate: '2025-01-01', acquisitionValue: 0, description: 'IMPRESORA INYECCIÓN DE TINTA', sede: 'Quindío' },
    { id: '91', code: 'T1-LICO-009', name: 'HP — PC de Escritorio', category: 'PC de Escritorio', brand: 'HP', serial: '8CC1295QGW', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Logística', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 0, description: 'LOGÍSTICA DE DESPACHO', sede: 'Quindío' },
    { id: '92', code: 'IMP-LICO-0016', name: 'Brother — Impresora', category: 'Impresora', brand: 'Brother', serial: 'VNB4314262', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Logística', status: 'activo', acquisitionDate: '2025-01-01', acquisitionValue: 300000, description: 'COMPRADA DE SEGUNDA', sede: 'Quindío' },
    { id: '93', code: 'CP-LICO-0033', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '69SSD74', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Bodega', status: 'activo', acquisitionDate: '2025-04-18', acquisitionValue: 0, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '94', code: 'IMP-LICO-0017', name: 'Epson — Impresora', category: 'Impresora', brand: 'Epson', serial: 'CNG9D6R04H', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Bodega', status: 'activo', acquisitionDate: '2024-02-18', acquisitionValue: 0, description: 'IMPRESORA JEFE DE BODEGA', sede: 'Quindío' },
    { id: '95', code: 'CP-LICO-0034', name: 'Samsung — Portátil', category: 'Portátil', brand: 'Samsung', serial: 'SANOCV15A89544D', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Cartera', status: 'activo', acquisitionDate: '2025-02-20', acquisitionValue: 0, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '96', code: 'CP-LICO-0035', name: 'Samsung — Portátil', category: 'Portátil', brand: 'Samsung', serial: 'S8NOCV184697355', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Financiero', status: 'activo', acquisitionDate: '2025-03-11', acquisitionValue: 0, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: CORE I5 12 GENERACION', sede: 'Quindío' },
    { id: '97', code: 'IMP-LICO-0018', name: 'Epson — Impresora', category: 'Impresora', brand: 'Epson', serial: 'X644708920', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Financiero', status: 'activo', acquisitionDate: '2024-01-01', acquisitionValue: 0, description: 'IMPRESORA FINANCIERA', sede: 'Quindío' },
    { id: '98', code: 'CE-LICO-0002', name: 'Lenovo — PC Mini / All-in-One', category: 'PC Mini / All-in-One', brand: 'Lenovo', serial: '42Y98R2', location: 'Quindío', area: 'Sistemas', assignedTo: 'Colaborador Financiero', status: 'activo', acquisitionDate: '2025-09-10', acquisitionValue: 0, description: 'SOFTWARE CONTABLE AURORA', sede: 'Quindío' },
    { id: '99', code: 'CP-LICO-0036', name: 'Lenovo — Portátil', category: 'Portátil', brand: 'Lenovo', serial: '8JD25D4', location: 'Quindío', area: 'Sistemas', assignedTo: 'Harold Roldán', status: 'activo', acquisitionDate: '2026-02-25', acquisitionValue: 2800000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 13 GENERACION', sede: 'Quindío' },
    { id: '100', code: 'CP-LICO-0037', name: 'Acer — Portátil', category: 'Portátil', brand: 'Acer', serial: 'NXHGAAL00402509DF62N00', location: 'San Andrés', area: 'Sistemas', assignedTo: 'Jhon Orellano', status: 'activo', acquisitionDate: '2022-03-03', acquisitionValue: 0, description: 'Disco: 512 GB SDD, RAM: 8 GB DDR4, CPU: INTEL CELERON J4025', sede: 'San Andrés' },
    { id: '101', code: 'TC-LICO-0006', name: 'Samsung — Celular / Teléfono', category: 'Celular / Teléfono', brand: 'Samsung', serial: 'R58TB0DNAHD', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Armenia 2', status: 'activo', acquisitionDate: '2026-03-06', acquisitionValue: 0, description: 'CELULAR 3106086451', sede: 'Quindío' },
    { id: '102', code: 'CP-LICO-0038', name: 'HP — PC Mini / All-in-One', category: 'PC Mini / All-in-One', brand: 'HP', serial: '8CC6372Y1J', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2026-03-09', acquisitionValue: 3200000, description: 'Disco: 512 GB SDD, RAM: 16 GB , CPU: CORE I5 13 GENERACION', sede: 'Chocó' },
    { id: '103', code: 'CP-LICO-0039', name: 'HP — PC Mini / All-in-One', category: 'PC Mini / All-in-One', brand: 'HP', serial: '8CC5372Y18', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2026-03-09', acquisitionValue: 3200000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR4, CPU: CORE I5 13 GENERACION', sede: 'Chocó' },
    { id: '104', code: 'CP-LICO-0040', name: 'HP — PC Mini / All-in-One', category: 'PC Mini / All-in-One', brand: 'HP', serial: '8CC5372XW1', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2026-03-09', acquisitionValue: 3200000, description: 'Disco: 512 GB SDD, RAM: 16 GB DDR5, CPU: CORE I5 13 GENERACION', sede: 'Chocó' },
    { id: '105', code: 'MON-LICO-0025', name: 'HP — Monitor', category: 'Monitor', brand: 'HP', serial: '1H35171775', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2026-03-09', acquisitionValue: 0, description: 'MONITOR 24\" EQUIPOS MINI HP', sede: 'Chocó' },
    { id: '106', code: 'MON-LICO-0026', name: 'HP — Monitor', category: 'Monitor', brand: 'HP', serial: '1H3517176N', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2026-03-09', acquisitionValue: 0, description: 'MONITOR 24\" COMPLEMENTO HP MINI', sede: 'Chocó' },
    { id: '107', code: 'MON-LICO-0027', name: 'HP — Monitor', category: 'Monitor', brand: 'HP', serial: '1H35170ZXT', location: 'Chocó', area: 'Sistemas', assignedTo: 'Colaborador Quibdó', status: 'activo', acquisitionDate: '2026-03-09', acquisitionValue: 0, description: 'MONITOR 24\" COMPLEMENTO HP MINI', sede: 'Chocó' },
    { id: '108', code: 'TC-LICO-0007', name: 'Motorola — Celular / Teléfono', category: 'Celular / Teléfono', brand: 'Motorola', serial: 'R8YYC07ST3R', location: 'Quindío', area: 'General', assignedTo: 'Colaborador Operaciones', status: 'activo', acquisitionDate: '2026-03-09', acquisitionValue: 700000, description: 'CELULAR 3157806647', sede: 'Quindío' },
  ];

  filteredAssets: FixedAsset[] = [];

  ngOnInit() { this.filterAssets(); }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.newAsset = {};
  }

  saveAsset() {
    if (!this.newAsset.name || !this.newAsset.category || !this.newAsset.sede) return;
    const last = this.assets.length + 1;
    const asset: FixedAsset = {
      id: String(last + 200),
      code: `AF-LICO-${String(last).padStart(4,'0')}`,
      name: this.newAsset.name!,
      category: this.newAsset.category!,
      brand: this.newAsset.brand,
      serial: this.newAsset.serial,
      location: this.newAsset.sede!,
      sede: this.newAsset.sede!,
      area: this.newAsset.area || 'General',
      assignedTo: this.newAsset.assignedTo,
      status: (this.newAsset.status as FixedAsset['status']) || 'activo',
      acquisitionDate: this.newAsset.acquisitionDate || new Date().toISOString().split('T')[0],
      acquisitionValue: this.newAsset.acquisitionValueStr
        ? parseInt(this.newAsset.acquisitionValueStr.replace(/\D/g,''))
        : undefined,
      description: this.newAsset.description,
    };
    this.assets.unshift(asset);
    this.filterAssets();
    this.newAsset = {};
    this.showForm = false;
  }

  filterAssets() {
    const text = this.searchText.toLowerCase();
    this.filteredAssets = this.assets.filter(a => {
      const matchText = !text ||
        a.name.toLowerCase().includes(text) ||
        a.code.toLowerCase().includes(text) ||
        (a.serial ?? '').toLowerCase().includes(text) ||
        (a.assignedTo ?? '').toLowerCase().includes(text);
      const matchCat    = !this.filterCategory || a.category === this.filterCategory;
      const matchStatus = !this.filterStatus   || a.status   === this.filterStatus;
      const matchSede   = !this.filterSede     || a.sede     === this.filterSede;
      return matchText && matchCat && matchStatus && matchSede;
    });
  }

  getStatusLabel(s: string): string {
    return { activo:'Activo', en_mantenimiento:'En mantenimiento', dado_de_baja:'Dado de baja', disponible:'Disponible' }[s] ?? s;
  }

  getCategoryIcon(cat: string): string {
    const icons: Record<string,string> = {
      'Portátil':'💻','PC de Escritorio':'🖥️','PC Mini / All-in-One':'🖥️',
      'Monitor':'🖵','Impresora':'🖨️','Router / Access Point':'📡',
      'UPS':'🔋','DVR / NVR':'📹','Celular / Teléfono':'📱',
      'Videobeam / Proyector':'📽️'
    };
    return icons[cat] ?? '📦';
  }

  formatCurrency(v?: number): string {
    if (!v) return '—';
    return new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(v);
  }


  getSedeCss(sede: string): string {
    return sede.toLowerCase().replace(' ','-').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }
  get totalValue(): number {
    return this.assets.reduce((s,a) => s + (a.acquisitionValue ?? 0), 0);
  }
}
