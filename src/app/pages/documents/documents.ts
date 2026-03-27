import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface DocFile {
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
  fileData?: string;       // base64 o URL blob
  fileType?: string;       // mime type
  previewUrl?: SafeResourceUrl;
}

interface NewDocForm {
  name: string; category: string; area: string;
  version: string; description: string;
  fileName: string; fileSize: string; file: File | null;
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
  previewDoc: DocFile | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  newDoc: NewDocForm = this.emptyForm();

  documents: DocFile[] = [
    { id:'1', name:'Reglamento Interno de Trabajo', category:'Reglamentos', area:'RRHH', version:'v2.1',
      description:'Reglamento interno vigente para todos los colaboradores.',
      fileName:'reglamento_interno.pdf', uploadedAt:'15 Ene 2026', uploadedBy:'Dilson Otalvaro' },
    { id:'2', name:'Manual de Procedimientos Operativos', category:'Manuales', area:'Operaciones', version:'v1.3',
      description:'Guía de procedimientos estándar para operaciones.',
      fileName:'manual_operaciones.pdf', uploadedAt:'10 Feb 2026', uploadedBy:'Dilson Otalvaro' },
    { id:'3', name:'Política de Seguridad de la Información', category:'Políticas', area:'Sistemas', version:'v1.0',
      description:'Lineamientos de seguridad digital para todos los usuarios.',
      fileName:'politica_seguridad.pdf', uploadedAt:'05 Mar 2026', uploadedBy:'Jorge Barbosa' },
    { id:'4', name:'Formato de Solicitud de Vacaciones', category:'Formatos', area:'RRHH',
      description:'Formato oficial para solicitar vacaciones.',
      fileName:'formato_vacaciones.docx', uploadedAt:'20 Mar 2026', uploadedBy:'Dilson Otalvaro' },
    { id:'5', name:'Política de Protección de Datos Personales', category:'Políticas', area:'Jurídico', version:'v1.0',
      description:'Tratamiento y protección de datos personales — Ley 1581.',
      fileName:'politica_datos.pdf', uploadedAt:'01 Mar 2026', uploadedBy:'Jorge Barbosa' },
    { id:'6', name:'Contrato de Confidencialidad', category:'Contratos', area:'RRHH',
      description:'Acuerdo de confidencialidad para nuevos colaboradores.',
      fileName:'contrato_confidencialidad.docx', uploadedAt:'10 Ene 2026', uploadedBy:'Dilson Otalvaro' },
  ];

  filteredDocuments: DocFile[] = [...this.documents];

  private emptyForm(): NewDocForm {
    return { name:'', category:'', area:'', version:'', description:'', fileName:'', fileSize:'', file:null };
  }

  toggleUploadForm() {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) this.newDoc = this.emptyForm();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      this.newDoc.file = file;
      this.newDoc.fileName = file.name;
      this.newDoc.fileSize = this.formatFileSize(file.size);
    }
  }

  uploadDocument() {
    if (!this.newDoc.name || !this.newDoc.category || !this.newDoc.file) return;
    const file = this.newDoc.file!;
    const reader = new FileReader();
    reader.onload = (e) => {
      const doc: DocFile = {
        id: crypto.randomUUID(),
        name: this.newDoc.name, category: this.newDoc.category,
        area: this.newDoc.area || undefined, version: this.newDoc.version || undefined,
        description: this.newDoc.description || undefined,
        fileName: this.newDoc.fileName, fileSize: this.newDoc.fileSize,
        uploadedAt: new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' }),
        uploadedBy: 'Usuario Actual',
        fileData: e.target?.result as string,
        fileType: file.type,
      };
      this.documents.unshift(doc);
      this.filterDocuments();
      this.newDoc = this.emptyForm();
      this.showUploadForm = false;
    };
    reader.readAsDataURL(file);
  }

  filterDocuments() {
    const text = this.searchText.toLowerCase();
    this.filteredDocuments = this.documents.filter(d => {
      const matchText = !text || d.name.toLowerCase().includes(text) || (d.description ?? '').toLowerCase().includes(text);
      const matchCat = !this.filterCategory || d.category === this.filterCategory;
      return matchText && matchCat;
    });
  }

  previewDocument(doc: DocFile) {
    if (doc.fileData) {
      doc.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(doc.fileData);
    } else {
      // Para docs mock sin archivo real, mostrar placeholder
      doc.previewUrl = undefined;
    }
    this.previewDoc = doc;
  }

  closePreview() { this.previewDoc = null; }

  downloadDocument(doc: DocFile) {
    if (doc.fileData) {
      const a = document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.fileName;
      a.click();
    } else {
      // Mock: generar un PDF de texto simple
      const content = `LICO DISTRIBUCIONES S.A.S.\n\n${doc.name}\n\nDocumento de muestra.\nVersión: ${doc.version ?? 'N/A'}\nÁrea: ${doc.area ?? 'General'}\n\n${doc.description ?? ''}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = doc.fileName; a.click();
      URL.revokeObjectURL(url);
    }
  }

  isPreviewable(doc: DocFile): boolean {
    if (doc.fileData) return true;
    return false; // mock docs sin archivo real no son previewable, se descarga
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const icons: Record<string,string> = {
      pdf:'📄', doc:'📝', docx:'📝', xls:'📊', xlsx:'📊',
      ppt:'📋', pptx:'📋', zip:'🗜️', jpg:'🖼️', png:'🖼️'
    };
    return icons[ext ?? ''] ?? '📁';
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/(1024*1024)).toFixed(1)} MB`;
  }
}
