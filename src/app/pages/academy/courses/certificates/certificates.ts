import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Certificate } from '../../../../core/models/certificate.model';
import { CertificateService } from '../../../../core/services/certificate-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificates.html',
  styleUrls: ['./certificates.scss']
})
export class CertificatesComponent implements OnInit, OnDestroy {

  certificates: Certificate[] = [];
  loading = true;

  private destroy$ = new Subject<void>();

  constructor(private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.loading = true;

    this.certificateService.getMyCertificates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.certificates = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  openCertificate(courseId: number): void {
    this.certificateService.openCertificate(courseId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
