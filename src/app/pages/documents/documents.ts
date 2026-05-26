import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  DocumentResponse,
  DocumentsService
} from '../../core/services/document.service';
import { UserService } from '../../core/services/user.service';
import { AreaResponse } from '../../core/models/area.model';
import { AreaService } from '../../core/services/area.service';

export interface DocFile {
  uploadedById?: string;
  id: string;
  name: string;
  category: string;
  area?: string;
  version?: string;
  description?: string;
  fileName: string;
  fileSize?: string;
  uploadedAt: string;
  uploadedBy: string;
  fileData?: string;
  fileType?: string;
  previewUrl?: SafeResourceUrl;
}

interface NewDocForm {
  name: string;
  category: string;
  areaId: number | null;
  version: string;
  description: string;
  fileName: string;
  fileSize: string;
  file: File | null;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class DocumentsComponent implements OnInit {

  showUploadForm = false;
  searchText = '';
  filterCategory = '';
  previewDoc: DocFile | null = null;
  areas: AreaResponse[] = [];
  documents: DocFile[] = [];
  filteredDocuments: DocFile[] = [];
  userLoaded = false;
  editMode = false;
  editForm: any = {};
  viewMode: 'list' | 'folders' = 'list';
  selectedArea: string | null = null;
  newDoc: NewDocForm = this.emptyForm();
  
  currentUserId = '';


  constructor(
    private sanitizer: DomSanitizer,
    private documentsService: DocumentsService,
    private userService: UserService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadDocuments();
    this.loadAreas();
  }

  loadAreas(): void {
  this.areaService.findAll().subscribe({
    next: (data) => this.areas = data,
    error: (err) => console.error('Error cargando áreas', err)
  });
}

openEditMode(): void {
  this.editForm = {
    title: this.previewDoc!.name,
    category: this.previewDoc!.category,
    description: this.previewDoc!.description ?? '',
    version: this.previewDoc!.version ?? '',
    areaId: null,
    isPublic: true,
    isActive: true,
  };
  this.editMode = true;
}

closeEditMode(): void {
  this.editMode = false;
  this.editForm = {};
}

saveEdit(): void {
  if (!this.previewDoc) return;

  this.documentsService
    .update(this.previewDoc.id, this.editForm, this.currentUserId)
    .subscribe({
      next: (doc) => {
        const idx = this.documents.findIndex(d => d.id === doc.id);
        if (idx !== -1) this.documents[idx] = this.mapToUi(doc);
        this.applyFilter();
        this.previewDoc = this.documents.find(d => d.id === doc.id) ?? null;
        this.editMode = false;
      },
      error: (err) => console.error('Error actualizando documento', err)
    });
}


loadCurrentUser(): void {
  this.userService.getCurrentUser().subscribe({
    next: (user) => {
      this.currentUserId = user.id;
      this.userLoaded = true;
    },
    error: (err) => console.error('Error obteniendo usuario actual', err)
  });
}


  loadDocuments(): void {
    this.documentsService.getAll().subscribe({
      next: (data) => {
        this.documents = data.map(d => this.mapToUi(d));
        this.applyFilter();
      },
      error: (err) => console.error('Error cargando documentos', err)
    });
  }

  mapToUi(d: DocumentResponse): DocFile {
  const fechaRaw = d.createdAt ? new Date(d.createdAt) : null;
  const uploadedAt = fechaRaw && !isNaN(fechaRaw.getTime())
    ? fechaRaw.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Fecha desconocida';

  return {
    id: d.id,
    name: d.title,
    category: d.category,
    area: d.areaName ?? undefined,
    version: d.version ?? undefined,
    description: d.description ?? undefined,
    fileName: d.originalFileName,
    fileSize: this.formatFileSize(d.fileSize),
    uploadedAt,
    uploadedBy: d.uploadedBy,
    uploadedById: d.uploadedById,
  };
}

get areaFolders(): { name: string; count: number }[] {
  const map = new Map<string, number>();

  this.documents.forEach(d => {
    const area = d.area?.trim() || 'General';
    map.set(area, (map.get(area) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

toggleView(): void {
  this.viewMode = this.viewMode === 'list' ? 'folders' : 'list';
  this.selectedArea = null;
  this.applyFilter();
}

openFolder(areaName: string): void {
  this.selectedArea = areaName;
  this.applyFilter();
}

backToFolders(): void {
  this.selectedArea = null;
  this.applyFilter();
}


  private emptyForm(): NewDocForm {
    return {
      name: '', category: '', areaId: null, version: '',
      description: '', fileName: '', fileSize: '', file: null
    };
  }

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) this.newDoc = this.emptyForm();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      this.newDoc.file = file;
      this.newDoc.fileName = file.name;
      this.newDoc.fileSize = this.formatFileSize(file.size);
    }
  }


  uploadDocument(): void {
  if (!this.newDoc.name || !this.newDoc.category || !this.newDoc.file) return;
  if (!this.currentUserId) {
    console.error('Usuario no cargado aún, intenta de nuevo');
    return;
  }

  const payload = {
    title: this.newDoc.name,
    category: this.newDoc.category,
    description: this.newDoc.description || null,
    version: this.newDoc.version || null,
    areaId: this.newDoc.areaId,
    isPublic: true,
  };

  this.documentsService
    .upload(payload, this.newDoc.file, this.currentUserId)
    .subscribe({
      next: (doc) => {
        this.documents.unshift(this.mapToUi(doc));
        this.applyFilter();
        this.newDoc = this.emptyForm();
        this.showUploadForm = false;
      },
      error: (err) => console.error('Error subiendo documento', err)
    });
}


  filterDocuments(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    const text = this.searchText.toLowerCase();

    this.filteredDocuments = this.documents.filter(d => {

      const matchText =
        !text ||
        d.name.toLowerCase().includes(text) ||
        (d.description ?? '').toLowerCase().includes(text);

      const matchCat =
        !this.filterCategory || d.category === this.filterCategory;

      let matchArea = true;

      if (this.viewMode === 'folders' && this.selectedArea !== null) {
        const docArea = d.area?.trim() || 'General';
        matchArea = docArea === this.selectedArea;
      }

      return matchText && matchCat && matchArea;
    });
  }


  previewDocument(doc: DocFile): void {
  this.previewDoc = doc;
}

  closePreview(): void {
  this.previewDoc = null;
  this.editMode = false;
  this.editForm = {};
}

  downloadDocument(doc: DocFile): void {
  this.documentsService.download(doc.id).subscribe({
    next: (blob) => {
      const ext = doc.fileName.split('.').pop()?.toLowerCase() ?? '';
      const mimeTypes: Record<string, string> = {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ppt: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        zip: 'application/zip',
        jpg: 'image/jpeg',
        png: 'image/png',
      };
      const mime = mimeTypes[ext] ?? 'application/octet-stream';
      const typedBlob = new Blob([blob], { type: mime });

      const url = URL.createObjectURL(typedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      a.click();
      URL.revokeObjectURL(url);
    },
    error: (err) => console.error('Error al descargar', err)
  });
}

  isPreviewable(doc: DocFile): boolean {
    return !!doc.fileData || !!doc.previewUrl;
  }

  getFileIcon(fileName: string): string {
    const ext = fileName?.split('.').pop()?.toLowerCase() ?? '';
    const icons: Record<string, string> = {
      pdf: '📄', doc: '📝', docx: '📝',
      xls: '📊', xlsx: '📊',
      ppt: '📋', pptx: '📋',
      zip: '🗜️', jpg: '🖼️', png: '🖼️'
    };
    return icons[ext] ?? '📁';
  }

  private formatFileSize(bytes: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

showDeleteConfirm = false;
docToDelete: DocFile | null = null;

openDeleteConfirm(doc: DocFile): void {
  this.docToDelete = doc;
  this.showDeleteConfirm = true;
}

cancelDelete(): void {
  this.docToDelete = null;
  this.showDeleteConfirm = false;
}

confirmDelete(): void {
  if (!this.docToDelete) return;

  this.documentsService.delete(this.docToDelete.id).subscribe({
    next: () => {
      this.documents = this.documents.filter(d => d.id !== this.docToDelete!.id);
      this.applyFilter();
      this.closePreview();
      this.cancelDelete();
    },
    error: (err) => console.error('Error eliminando documento', err)
  });
}
}