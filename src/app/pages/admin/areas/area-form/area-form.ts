import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AreaService } from '../../../../core/services/area.service';
import { AreaUpdateRequest } from '../../../../core/models/area.model';

@Component({
  selector: 'app-area-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './area-form.html',
  styleUrls: ['./area-form.scss']
})
export class AreaFormComponent implements OnInit {

  isEditMode = false;
  areaId?: number;
  loading = false;

  form!: ReturnType<typeof this.fb.group>;

  constructor(
    private fb: FormBuilder,
    private areaService: AreaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.areaId = +id;
      this.loadArea(this.areaId);
    }
  }

  loadArea(id: number) {
    this.loading = true;
    this.areaService.findById(id).subscribe({
      next: (area) => {
        this.form.patchValue({
          name: area.name,
          active: area.active
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/admin/areas']);
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.areaId) {
      const request: AreaUpdateRequest = this.form.value as AreaUpdateRequest;

      this.areaService.update(this.areaId, request).subscribe({
        next: () => this.router.navigate(['/admin/areas']),
        error: () => this.loading = false
      });

    } else {
      this.areaService.create({ name: this.form.value.name! }).subscribe({
        next: () => this.router.navigate(['/admin/areas']),
        error: () => this.loading = false
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/areas']);
  }
}
