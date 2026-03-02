import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AreaService } from '../../../../core/services/area.service';
import { AreaResponse } from '../../../../core/models/area.model';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-area-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltip],
  templateUrl: './area-list.html',
  styleUrls: ['./area-list.scss']
})
export class AreaListComponent implements OnInit {

  areas: AreaResponse[] = [];
  loading = false;
  selectedArea?: AreaResponse;
  showDeleteModal = false;
  deleting = false;


  constructor(
    private areaService: AreaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas() {
    this.loading = true;
    this.areaService.findAll().subscribe({
      next: (data) => {
        this.areas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  edit(area: AreaResponse) {
    this.router.navigate(['/admin/areas/edit', area.id]);
  }

  openDeleteModal(area: AreaResponse) {
  this.selectedArea = area;
  this.showDeleteModal = true;
}

closeDeleteModal() {
  this.showDeleteModal = false;
  this.selectedArea = undefined;
}

confirmDelete() {
  if (!this.selectedArea) return;

  this.deleting = true;

  this.areaService.delete(this.selectedArea.id).subscribe({
    next: () => {
      this.closeDeleteModal();
      this.loadAreas();
      this.deleting = false;
    },
    error: () => {
      this.deleting = false;
    }
  });
}

}
