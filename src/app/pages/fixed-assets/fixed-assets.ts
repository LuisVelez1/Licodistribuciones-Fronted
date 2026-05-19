import { FixedAssetRequest, FixedAssetResponse } from '../../core/models/fixed-asset.model';
import { FixedAssetsService } from '../../core/services/fixed-asset.service';
import { UserService } from '../../core/services/user.service';
import { AreaService } from '../../core/services/area.service';
import { UserA } from '../../core/models/user-admin.model';
import { AreaResponse } from '../../core/models/area.model';
import { CountByStatusPipe } from './count-by-status.pipe';
import { AssetsReportComponent } from './assets-report.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AssetForm extends Partial<FixedAssetRequest> {
  ramType?: string;
  storageType?: string;
  hasLicenseWindows?: boolean;
  hasLicenseOffice?: boolean;
  acquisitionValueStr?: string;
}

interface EmployeeOption {
  id: string;
  name: string;
  position: string;
  sede: string;
}

@Component({
  selector: 'app-fixed-assets',
  standalone: true,
  templateUrl: './fixed-assets.html',
  styleUrls: ['./fixed-assets.scss'],
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    CountByStatusPipe,
    AssetsReportComponent
  ]
})
export class FixedAssetsComponent implements OnInit {

  // ── Estado general ──────────────────────────────
  assets: FixedAssetResponse[] = [];
  filteredAssets: FixedAssetResponse[] = [];
  loading = false;
  error = '';

  // ── Tabs ────────────────────────────────────────
  showReports = false;

  // ── Formulario creación ─────────────────────────
  showForm = false;
  newAsset: AssetForm = this.emptyForm();

  // ── Modal detalle / edición ─────────────────────
  previewAsset: FixedAssetResponse | null = null;
  editMode = false;
  editForm: AssetForm = {};

  // ── Auth ────────────────────────────────────────
  currentUserId = '';
  isAdmin = false;

  // ── Búsqueda empleados ──────────────────────────
  employeeSearch = '';
  employeeResults: EmployeeOption[] = [];
  showEmployeeDropdown = false;
  private selectedEmployeeId: string | null = null;
  private allUsers: UserA[] = [];

  // ── Áreas ───────────────────────────────────────
  areaList: AreaResponse[] = [];

  // ── Filtros ─────────────────────────────────────
  searchText = '';
  filterSede = '';
  filterCategory = '';
  filterStatus = '';

  // ── Catálogos ────────────────────────────────────
  readonly categories = [
    'Portátil', 'PC de Escritorio', 'PC Mini / All-in-One',
    'Monitor', 'Impresora', 'Teléfono IP', 'Servidor',
    'Switch / Router', 'UPS', 'Proyector', 'Tablet', 'Otro'
  ];

  readonly sedes = ['Quindío', 'Boyacá', 'Chocó', 'San Andrés'];

  get totalValue(): number {
    return this.assets.reduce((sum, a) => sum + (a.acquisitionValue ?? 0), 0);
  }

  constructor(
    private fixedAssetsService: FixedAssetsService,
    private userService: UserService,
    private areaService: AreaService,
    protected cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAll();
    this.loadUsers();
    this.loadAreas();
  }


  loadCurrentUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.isAdmin = !!(
          user.roles?.includes('ADMIN') || 
          user.roles?.includes('SUPER_ADMIN')
        );
      },
      error: (err) => console.error('Error cargando usuario actual:', err)
    });
  }

  private loadUsers(): void {
    this.userService.getAllAdminUsers().subscribe({
      next: (users) => this.allUsers = users,
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  private loadAreas(): void {
    this.areaService.findAll().subscribe({
      next: (areas) => this.areaList = areas,
      error: (err) => console.error('Error cargando áreas:', err)
    });
  }

  loadAll(): void {
    this.loading = true;
    this.fixedAssetsService.getAll().subscribe({
      next: (data) => {
        this.assets = data;
        this.filteredAssets = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar activos fijos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  saveAsset(): void {
    const payload = this.buildPayload();
    this.fixedAssetsService.create(payload).subscribe({
      next: (nuevo) => {
        this.assets = [nuevo, ...this.assets];
        this.filterAssets();
        this.toggleForm();
      },
      error: (err) => console.error('Error al guardar activo:', err)
    });
  }

  private buildPayload(): FixedAssetRequest {
    const ram     = [this.newAsset.ram,     this.newAsset.ramType    ].filter(Boolean).join(' ');
    const storage = [this.newAsset.storage, this.newAsset.storageType].filter(Boolean).join(' ');
    const toDateTime = (d?: string | null) => d ? `${d}T00:00:00` : null;
    const parseValue = (s?: string): number | null => {
      if (!s) return null;
      const n = parseFloat(s.replace(/\./g, '').replace(',', '.'));
      return isNaN(n) ? null : n;
    };

    return {
      code:             '',
      name:             this.newAsset.name ?? '',
      category:         this.newAsset.category ?? '',
      brand:            this.newAsset.brand ?? '',
      model:            this.newAsset.model ?? '',
      serial:           this.newAsset.serial ?? '',
      location:         this.newAsset.location ?? '',
      sede:             this.newAsset.sede ?? '',
      areaId:           this.newAsset.areaId ?? null,
      assignedToId:     this.selectedEmployeeId,
      status:           this.newAsset.status ?? 'activo',
      acquisitionDate:  toDateTime(this.newAsset.acquisitionDate),
      acquisitionValue: parseValue(this.newAsset.acquisitionValueStr),
      description:      this.newAsset.description ?? '',
      processor:        this.newAsset.processor ?? '',
      ram,
      storage,
      os:               this.newAsset.os ?? '',
      ip:               this.newAsset.ip ?? '',
      mac:              this.newAsset.mac ?? '',
      warrantyDate:     toDateTime(this.newAsset.warrantyDate),
      actaFirmada:      false,
      actaDate:         null
    };
  }

  private resetForm(): void {
    this.newAsset = this.emptyForm();
    this.employeeSearch = '';
    this.selectedEmployeeId = null;
    this.showEmployeeDropdown = false;
    this.employeeResults = [];
  }

  private emptyForm(): AssetForm {
    return {
      name: '', category: '', brand: '', model: '', serial: '',
      location: '', sede: '', areaId: null, status: 'activo', description: '',
      processor: '', ram: '', ramType: '', storage: '', storageType: '',
      os: '', ip: '', mac: '', acquisitionValueStr: '',
      acquisitionDate: '', warrantyDate: '',
      hasLicenseWindows: false, hasLicenseOffice: false
    };
  }

  // ══════════════════════════════════════════════════
  // Modal — Ver detalle
  // ══════════════════════════════════════════════════

  openPreview(asset: FixedAssetResponse): void {
    this.previewAsset = asset;
    this.editMode = false;
    this.editForm = {};
  }

  closePreview(): void {
    this.previewAsset = null;
    this.editMode = false;
    this.editForm = {};
  }

  // ══════════════════════════════════════════════════
  // Modal — Edición (solo ADMIN)
  // ══════════════════════════════════════════════════

  openEditMode(): void {
    if (!this.previewAsset) return;
    const a = this.previewAsset;

    this.editForm = {
      name:                a.name,
      category:            a.category,
      brand:               a.brand,
      model:               a.model,
      serial:              a.serial,
      location:            a.location,
      sede:                a.sede,
      areaId:              a.areaId ?? null,
      status:              a.status,
      description:         a.description,
      processor:           a.processor,
      ram:                 a.ram?.split(' ')[0] ?? '',
      ramType:             a.ram?.split(' ')[1] ?? '',
      storage:             a.storage?.split(' ')[0] ?? '',
      storageType:         a.storage?.split(' ')[1] ?? '',
      os:                  a.os,
      ip:                  a.ip,
      mac:                 a.mac,
      acquisitionValueStr: a.acquisitionValue?.toString() ?? '',
      acquisitionDate:     a.acquisitionDate?.split('T')[0] ?? '',
      warrantyDate:        a.warrantyDate?.split('T')[0] ?? '',
    };

    // Pre-cargar empleado asignado en el buscador
    this.employeeSearch     = a.assignedToFullName ?? '';
    this.selectedEmployeeId = a.assignedToId ?? null;
    this.editMode = true;
  }

  closeEditMode(): void {
    this.editMode = false;
    this.editForm = {};
    this.employeeSearch = '';
    this.selectedEmployeeId = null;
  }

  saveEdit(): void {
    if (!this.previewAsset) return;

    const ram     = [this.editForm.ram,     this.editForm.ramType    ].filter(Boolean).join(' ');
    const storage = [this.editForm.storage, this.editForm.storageType].filter(Boolean).join(' ');
    const toDateTime = (d?: string | null) => d ? `${d}T00:00:00` : null;
    const parseValue = (s?: string): number | null => {
      if (!s) return null;
      const n = parseFloat(s.replace(/\./g, '').replace(',', '.'));
      return isNaN(n) ? null : n;
    };

    const payload: FixedAssetRequest = {
      code:             this.previewAsset.code ?? '',
      name:             this.editForm.name ?? '',
      category:         this.editForm.category ?? '',
      brand:            this.editForm.brand ?? '',
      model:            this.editForm.model ?? '',
      serial:           this.editForm.serial ?? '',
      location:         this.editForm.location ?? '',
      sede:             this.editForm.sede ?? '',
      areaId:           this.editForm.areaId ?? null,
      assignedToId:     this.selectedEmployeeId,
      status:           this.editForm.status ?? 'activo',
      acquisitionDate:  toDateTime(this.editForm.acquisitionDate),
      acquisitionValue: parseValue(this.editForm.acquisitionValueStr),
      description:      this.editForm.description ?? '',
      processor:        this.editForm.processor ?? '',
      ram,
      storage,
      os:               this.editForm.os ?? '',
      ip:               this.editForm.ip ?? '',
      mac:              this.editForm.mac ?? '',
      warrantyDate:     toDateTime(this.editForm.warrantyDate),
      actaFirmada:      this.previewAsset.actaFirmada ?? false,
      actaDate:         null
    };

    this.fixedAssetsService.update(this.previewAsset.id, payload).subscribe({
      next: (updated) => {
        const idx = this.assets.findIndex(a => a.id === updated.id);
        if (idx !== -1) this.assets[idx] = updated;
        this.filterAssets();
        this.previewAsset = updated;
        this.closeEditMode();
      },
      error: (err) => console.error('Error actualizando activo:', err)
    });
  }

  // ══════════════════════════════════════════════════
  // Búsqueda empleados
  // ══════════════════════════════════════════════════

  searchEmployee(query: string): void {
    this.employeeSearch = query;
    this.selectedEmployeeId = null;

    if (query.length < 2) {
      this.showEmployeeDropdown = false;
      this.employeeResults = [];
      return;
    }

    const q = query.toLowerCase();
    this.employeeResults = this.allUsers
      .filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.position?.toLowerCase().includes(q)
      )
      .slice(0, 8)
      .map(u => ({
        id: u.id,
        name: `${u.firstName} ${u.lastName}`,
        position: u.position ?? '',
        sede: u.sede ?? ''
      }));

    this.showEmployeeDropdown = this.employeeResults.length > 0;
  }

  selectEmployee(emp: EmployeeOption): void {
    this.selectedEmployeeId = emp.id;
    this.employeeSearch = emp.name;
    this.showEmployeeDropdown = false;
  }

  clearEmployee(): void {
    this.selectedEmployeeId = null;
    this.employeeSearch = '';
    this.showEmployeeDropdown = false;
  }

  // ══════════════════════════════════════════════════
  // Filtros
  // ══════════════════════════════════════════════════

  filterAssets(): void {
    const q = this.searchText.toLowerCase();
    this.filteredAssets = this.assets.filter(a => {
      const matchSearch = !q || [
        a.name, a.code, a.serial, a.assignedToFullName, a.brand
      ].some(val => val?.toLowerCase().includes(q));

      const matchSede     = !this.filterSede     || a.sede === this.filterSede;
      const matchCategory = !this.filterCategory || a.category === this.filterCategory;
      const matchStatus   = !this.filterStatus   || a.status === this.filterStatus;

      return matchSearch && matchSede && matchCategory && matchStatus;
    });
  }

  // ══════════════════════════════════════════════════
  // Helpers
  // ══════════════════════════════════════════════════

  formatCurrency(value: number | null | undefined): string {
    if (value == null) return '—';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(value);
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Portátil': '💻', 'PC de Escritorio': '🖥️', 'PC Mini / All-in-One': '🖥️',
      'Monitor': '🖥️', 'Impresora': '🖨️', 'Teléfono IP': '☎️',
      'Servidor': '🗄️', 'Switch / Router': '🔌', 'UPS': '🔋',
      'Proyector': '📽️', 'Tablet': '📱', 'Otro': '📦'
    };
    return icons[category] ?? '📦';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'activo': 'Activo', 'disponible': 'Disponible',
      'en_mantenimiento': 'Mantenimiento', 'dado_de_baja': 'Dado de baja'
    };
    return labels[status] ?? status;
  }

  getSedeCss(sede: string): string {
    return sede?.toLowerCase().replace(/\s+/g, '-') ?? '';
  }

  generateActa(asset: FixedAssetResponse): void {
    console.log('Generando acta para:', asset);
  }

  // ── Modal confirmación eliminar ──────────
showDeleteConfirm = false;
assetToDelete: FixedAssetResponse | null = null;

openDeleteConfirm(asset: FixedAssetResponse): void {
  this.assetToDelete = asset;
  this.showDeleteConfirm = true;
}

cancelDelete(): void {
  this.assetToDelete = null;
  this.showDeleteConfirm = false;
}

confirmDelete(): void {
  if (!this.assetToDelete) return;

  this.fixedAssetsService.delete(this.assetToDelete.id).subscribe({
    next: () => {
      this.assets = this.assets.filter(a => a.id !== this.assetToDelete!.id);
      this.filterAssets();
      this.closePreview();
      this.cancelDelete();
    },
    error: (err) => console.error('Error eliminando activo:', err)
  });
}
}