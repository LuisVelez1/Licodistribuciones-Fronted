import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';

interface Birthday {
  name: string;
  date: Date;
}

@Component({
  selector: 'app-birthday-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <div class="filter-section">
          <mat-form-field appearance="outline">
            <mat-label>Filtrar por mes</mat-label>
            <mat-select  [(ngModel)]="selectedMonth" (selectionChange)="filterBirthdays()" 
              [panelClass]="'my-select-panel'">
              <mat-option [value]="null">Todos los meses</mat-option>
              @for (month of months; track month.value) {
                <mat-option [value]="month.value">{{ month.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <div class="stats">
          <span class="stat-item">
            <mat-icon>calendar_today</mat-icon>
            Total: {{ data.birthdays.length }}
          </span>
          @if (selectedMonth !== null) {
            <span class="stat-item filtered">
              <mat-icon>filter_list</mat-icon>
              Filtrados: {{ filteredBirthdays.length }}
            </span>
          }
        </div>

        <mat-divider></mat-divider>

        @if (filteredBirthdays.length === 0) {
          <div class="empty-state">
            <mat-icon>sentiment_dissatisfied</mat-icon>
            <p>{{ selectedMonth !== null ? 'No hay cumpleaños en este mes' : 'No hay cumpleaños registrados' }}</p>
          </div>
        } @else {
          <mat-list class="birthday-list">
            @for (birthday of filteredBirthdays; track birthday; let i = $index) {
              <mat-list-item class="birthday-item">
                <div class="birthday-content">
                  <div class="birthday-icon">
                    <mat-icon [style.color]="getMonthColor(birthday.date.getMonth())">
                      celebration
                    </mat-icon>
                  </div>
                  <div class="birthday-info">
                    <div class="name">{{ birthday.name }}</div>
                    <div class="date">
                      <mat-icon class="small-icon">event</mat-icon>
                      {{ formatDate(birthday.date) }}
                    </div>
                  </div>
                </div>
              </mat-list-item>
              @if (i < filteredBirthdays.length - 1) {
                <mat-divider></mat-divider>
              }
            }
          </mat-list>
        }
      </mat-dialog-content>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      background-color: white
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px 0;

      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 20px;
        font-weight: 500;

        mat-icon {
          color: #ff9800;
        }
      }
    }

    mat-dialog-content {
      padding: 20px 24px;
      overflow-y: auto;
      flex: 1;
    }

    .filter-section {
      margin-bottom: 16px;

      mat-form-field {
        width: 100%;
      }
    }

    .stats {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 8px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #666;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        &.filtered {
          color: #1976d2;
          font-weight: 500;
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      color: #999;
      text-align: center;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      p {
        margin: 0;
        font-size: 16px;
      }
    }

    .birthday-list {
      padding: 0;

      .birthday-item {
        height: auto !important;
        padding: 12px 0;

        &:hover {
          background-color: #f9f9f9;
        }
      }
    }

    .birthday-content {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
      padding: 8px;

      .birthday-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #fff3e0;

        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
      }

      .birthday-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .name {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          color: #666;

          .small-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    mat-dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
    }

    ::ng-deep .mat-mdc-list-item-unscoped-content {
      width: 100%;
    }

    ::ng-deep .mat-mdc-form-field-infix {
      margin-left: 7px;
      margin-right: 7px;
    }
  `]
})
export class BirthdayListDialogComponent {
  selectedMonth: number | null = null;
  filteredBirthdays: Birthday[] = [];

  months = [
    { value: 0, name: 'Enero' },
    { value: 1, name: 'Febrero' },
    { value: 2, name: 'Marzo' },
    { value: 3, name: 'Abril' },
    { value: 4, name: 'Mayo' },
    { value: 5, name: 'Junio' },
    { value: 6, name: 'Julio' },
    { value: 7, name: 'Agosto' },
    { value: 8, name: 'Septiembre' },
    { value: 9, name: 'Octubre' },
    { value: 10, name: 'Noviembre' },
    { value: 11, name: 'Diciembre' }
  ];

  constructor(
    public dialogRef: MatDialogRef<BirthdayListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { birthdays: Birthday[], onDelete: (index: number) => void, onAdd: () => void }
  ) {
    this.filteredBirthdays = [...data.birthdays];
  }

  filterBirthdays() {
    if (this.selectedMonth === null) {
      this.filteredBirthdays = [...this.data.birthdays];
    } else {
      this.filteredBirthdays = this.data.birthdays.filter(
        b => b.date.getMonth() === this.selectedMonth
      );
    }
  }


  formatDate(date: Date): string {
  const localDate = new Date(date);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const fixedDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);

  return `${fixedDate.getDate()} de ${months[fixedDate.getMonth()]}`;
}


  getMonthColor(month: number): string {
    const colors = [
      '#1976d2', '#d32f2f', '#388e3c', '#f57c00', 
      '#7b1fa2', '#0097a7', '#c2185b', '#5d4037',
      '#303f9f', '#689f38', '#e64a19', '#455a64'
    ];
    return colors[month];
  }

  openAddDialog() {
    this.data.onAdd();
  }

  close() {
    this.dialogRef.close();
  }
}