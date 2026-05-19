import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequirementsService, RequirementType } from '../../../../core/services/requriments.service';

@Component({
  selector: 'app-create-type-requirement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-type-requirement.html',
  styleUrl: './create-type-requirement.scss'
})
export class CreateTypeRequirementComponent implements OnInit {

  types: RequirementType[] = [];
  newType = { name: '', description: '' };
  saving = false;
  errorMessage = '';

  constructor(private requirementsService: RequirementsService) {}

  ngOnInit(): void {
    this.loadTypes();
  }

  loadTypes(): void {
    this.requirementsService.getTypes().subscribe({
      next: (data) => this.types = data,
      error: (err) => console.error('Error cargando tipos', err)
    });
  }

  addType(): void {
    if (!this.newType.name) return;
    this.saving = true;

    this.requirementsService.createType({
      name: this.newType.name,
      description: this.newType.description || undefined
    }).subscribe({
      next: (created) => {
        this.types.push(created);
        this.newType = { name: '', description: '' };
        this.saving = false;
      },
      error: (err) => {
        console.error('Error creando tipo', err);
        this.saving = false;
      }
    });
  }

  removeType(id: number): void {
    this.requirementsService.deleteType(id).subscribe({
      next: () => {
        this.types = this.types.filter(t => t.id !== id);
      },
      error: (err) => console.error('Error eliminando tipo', err)
    });
  }
}