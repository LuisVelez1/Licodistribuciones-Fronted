import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Document {
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
  url?: string;
}

interface NewDocForm {
  name: string;
  category: string;
  area: string;
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
export class DocumentsComponent {
  showUploadForm = false;
  searchText = '';
  filterCategory = '';

  newDoc: NewDocForm = this.emptyForm();

  documents: Document[] = [
    {
      id: '1',
      name: 'Reglamento Interno de Trabajo',
      category: 'Reglamentos',
      area: 'RRHH',
      version: 'v2.1',
      description: 'Reglamento interno vigente para todos los colaboradores de Lico Distribuciones.',
      fileName: 'reglamento_interno_2024.pdf',
      uploadedAt: '15 Ene 2026',
      uploadedBy: 'Marcela Arias'
    },
    {
      id: '2',
      name: 'Manual de Procedimientos Operativos',
      category: 'Manuales',
      area: 'Operaciones',
      version: 'v1.3',
      description: 'Guía de procedimientos estándar para el área de operaciones.',
      fileName: 'manual_operaciones.pdf',
      uploadedAt: '10 Feb 2026',
      uploadedBy: 'Dilson Otalvaro'
    },
    {
      id: '3',
      name: 'Política de Seguridad de la Información',
      category: 'Políticas',
      area: 'Sistemas',
      version: 'v1.0',
      description: 'Lineamientos de seguridad digital para todos los usuarios del sistema.',
      fileName: 'politica_seguridad.pdf',
      uploadedAt: '05 Mar 2026',
      uploadedBy: 'Jorge Barbosa'
    },
    {
      id: '4',
      name: 'Formato de Solicitud de Vacaciones',
      category: 'Formatos',
      area: 'RRHH',
      description: 'Formato oficial para solicitar período de vacaciones.',
      fileName: 'formato_vacaciones.docx',
      uploadedAt: '20 Mar 2026',
      uploadedBy: 'Yuliana Guzmán'
    }
  ];

  filteredDocuments: Document[] = [...this.documents];

  private emptyForm(): NewDocForm {
    return { name: '', category: '', area: '', version: '', description: '', fileName: '', fileSize: '', file: null };
  }

  toggleUploadForm() {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) this.newDoc = this.emptyForm();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.newDoc.file = file;
      this.newDoc.fileName = file.name;
      this.newDoc.fileSize = this.formatFileSize(file.size);
    }
  }

  uploadDocument() {
    if (!this.newDoc.name || !this.newDoc.category || !this.newDoc.file) return;
    const doc: Document = {
      id: crypto.randomUUID(),
      name: this.newDoc.name,
      category: this.newDoc.category,
      area: this.newDoc.area || undefined,
      version: this.newDoc.version || undefined,
      description: this.newDoc.description || undefined,
      fileName: this.newDoc.fileName,
      fileSize: this.newDoc.fileSize,
      uploadedAt: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
      uploadedBy: 'Usuario Actual'
    };
    this.documents.unshift(doc);
    this.filterDocuments();
    this.newDoc = this.emptyForm();
    this.showUploadForm = false;
  }

  filterDocuments() {
    const text = this.searchText.toLowerCase();
    this.filteredDocuments = this.documents.filter(d => {
      const matchText = !text || d.name.toLowerCase().includes(text) || (d.description ?? '').toLowerCase().includes(text);
      const matchCat = !this.filterCategory || d.category === this.filterCategory;
      return matchText && matchCat;
    });
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const icons: Record<string, string> = {
      pdf: '📄', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊',
      ppt: '📋', pptx: '📋', zip: '🗜️', rar: '🗜️', jpg: '🖼️',
      jpeg: '🖼️', png: '🖼️'
    };
    return icons[ext ?? ''] ?? '📁';
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
