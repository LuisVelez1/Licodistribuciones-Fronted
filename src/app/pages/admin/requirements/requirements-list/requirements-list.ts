import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { RequirementsService } from '../../../../core/services/requriments.service';
import { AreaService } from '../../../../core/services/area.service';
import { Requirement } from '../../../../core/models/requirement.model';
import { AreaResponse } from '../../../../core/models/area.model';

@Component({
  selector: 'app-requirement-list',
  standalone: true,
  templateUrl: './requirements-list.html',
  styleUrl: './requirements-list.scss',
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, RouterModule]
})
export class RequirementListComponent implements OnInit {

  requirements: Requirement[] = [];
  allRequirements: Requirement[] = [];
  areas: AreaResponse[] = [];

  loading = false;
  filtersForm!: FormGroup;

  constructor(
    private requirementService: RequirementsService,
    private areaService: AreaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRequirements();
    this.loadAreas();
    this.listenFilters();
  }

  initForm() {
    this.filtersForm = this.fb.group({
      area: [''],
      status: [''],
      priority: ['']
    });
  }

  loadRequirements() {
    this.loading = true;
    this.requirementService.getAll().subscribe({
      next: (data) => {
        this.requirements = data;
        this.allRequirements = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadAreas() {
    this.areaService.findAll().subscribe({
      next: (data: AreaResponse[]) => {
        this.areas = data.filter(area => area.active);
      },
      error: (err) => console.error(err)
    });
  }

  listenFilters() {
    this.filtersForm.valueChanges.subscribe(values => {
      this.applyFilters(values);
    });
  }

  applyFilters(filters: any) {
    this.requirements = this.allRequirements.filter(req => {

      const matchArea =
        !filters.area || req.areaId == filters.area;

      const matchStatus =
        !filters.status || req.status === filters.status;

      const matchPriority =
        !filters.priority || req.priority === filters.priority;

      return matchArea && matchStatus && matchPriority;
    });
  }

  clearFilters() {
    this.filtersForm.reset();
    this.requirements = this.allRequirements;
  }

  translateStatus(status: string): string {
    const map: any = {
      PENDING: 'Pendiente',
      IN_PROGRESS: 'En progreso',
      COMPLETED: 'Completado',
      REJECTED: 'Rechazado'
    };
    return map[status] || status;
  }

  translatePriority(priority: string): string {
    const map: any = {
      LOW: 'Baja',
      MEDIUM: 'Media',
      HIGH: 'Alta',
      CRITICAL: 'Crítica'
    };
    return map[priority] || priority;
  }
}
