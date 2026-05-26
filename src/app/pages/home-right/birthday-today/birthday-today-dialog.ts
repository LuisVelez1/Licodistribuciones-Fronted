import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Birthday {
  name: string;
  date: Date;
  sede: string;
}

@Component({
  selector: 'app-birthday-today-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="today-dialog">

      <div class="confetti-header">
        <span class="emoji">🎂</span>
        <h2>¡Hoy es un día especial!</h2>
        <p class="subtitle">Estos compañeros están de cumpleaños hoy</p>
      </div>

      <mat-dialog-content>
        <div class="birthday-list">
          @for (b of data.birthdays; track b.name) {
            <div class="birthday-item">
              <div class="avatar">{{ b.name[0] }}</div>
              <div class="info">
                <span class="name">{{ b.name }}</span>
                <span class="sede">{{ b.sede }}</span>
              </div>
              <span class="cake">🎉</span>
            </div>
          }
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="center">
        <button mat-flat-button color="primary" (click)="close()">
          ¡Felicitarlos!
        </button>
      </mat-dialog-actions>

    </div>
  `,
  styles: [`
    .today-dialog {
      border-radius: 16px;
      overflow: hidden;
    }

    .confetti-header {
      text-align: center;
      padding: 28px 24px 16px;
      background: linear-gradient(135deg, #006c38, #00a35a);
      color: white;

      .emoji {
        font-size: 48px;
        display: block;
        margin-bottom: 8px;
      }

      h2 {
        margin: 0 0 6px;
        font-size: 20px;
        font-weight: 700;
      }

      .subtitle {
        margin: 0;
        font-size: 13px;
        opacity: 0.85;
      }
    }

    mat-dialog-content {
      padding: 16px 24px;
      max-height: 320px;
      overflow-y: auto;
    }

    .birthday-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .birthday-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 10px;
      background: #f9f9f9;
      border: 1px solid #efefef;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #006c38;
        color: white;
        font-weight: 700;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .name {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .sede {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }
      }

      .cake { font-size: 20px; }
    }

    mat-dialog-actions {
      padding: 12px 24px 20px;
      justify-content: center;

      button {
        background: #006c38 !important;
        color: white !important;
        border-radius: 8px;
        padding: 0 32px;
        font-weight: 600;
      }
    }
  `]
})
export class BirthdayTodayDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BirthdayTodayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { birthdays: Birthday[] }
  ) {}

  close() {
    this.dialogRef.close();
  }
}