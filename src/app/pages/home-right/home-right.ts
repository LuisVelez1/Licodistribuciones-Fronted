import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BirthdayListDialogComponent } from './birthday/birthday-dialog';
import { BirthdayService, BirthdayResponse } from '../../core/services/birthday.service';
import { DirectoryDialogComponent } from './directory/directory-dialog';
import { UserService } from '../../core/services/user.service';
import { UserA } from '../../core/models/user-admin.model';

interface Birthday {
  name: string;
  date: Date;
  sede: string;
}

@Component({
  selector: 'app-home-right',
  standalone: true,
  templateUrl: './home-right.html',
  styleUrls: ['./home-right.scss'],
  imports: [
    CommonModule, MatCardModule, MatButtonModule,
    MatIconModule, MatDialogModule, MatTooltipModule
  ]
})
export class HomeRightComponent implements OnInit {
  birthdays: Birthday[] = [];
  directoryPreview: UserA[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private dialog: MatDialog,
    private birthdayService: BirthdayService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadBirthdaysFromApi();
    this.loadDirectoryPreview();
  }

  loadBirthdaysFromApi() {
    this.birthdayService.getAllBirthdays().subscribe({
      next: (data: BirthdayResponse[]) => {
        this.birthdays = data.map(b => {
          const [year, month, day] = b.birthdayDate.split('-').map(Number);
          return {
            name: `${b.firstName} ${b.lastName}`,
            sede: b.sede,
            date: new Date(year, month - 1, day)
          };
        }).sort((a, b) => {
          if (a.date.getMonth() !== b.date.getMonth())
            return a.date.getMonth() - b.date.getMonth();
          return a.date.getDate() - b.date.getDate();
        });
      },
      error: err => console.error('Error cargando cumpleaños:', err)
    });
  }

  loadDirectoryPreview() {
    this.userService.getAllAdminUsers().subscribe({
      next: (users: UserA[]) => {
        // Mostrar 3 personas: priorizar las que tienen email corporativo
        const withEmail = users.filter(u => u.email && u.id !== '1');
        this.directoryPreview = withEmail.slice(0, 3);
      }
    });
  }

  getLimitedBirthdays(): Birthday[] {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDay   = today.getDate();

    // Calcular días que faltan para cada cumpleaños (circular por año)
    const withDistance = this.birthdays.map(b => {
      const bMonth = b.date.getMonth();
      const bDay   = b.date.getDate();

      // diff en días aproximado (mes*31 + dia): 0 = hoy
      let diff = (bMonth - todayMonth) * 31 + (bDay - todayDay);
      if (diff < 0) diff += 365; // ya pasó este año → aparece el próximo

      return { birthday: b, diff };
    });

    // Los 3 más próximos a partir de hoy
    return withDistance
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3)
      .map(x => x.birthday);
  }

  formatDate(date: Date): string {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const fixed  = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const today  = new Date();

    const sameDay   = fixed.getDate()  === today.getDate()  && fixed.getMonth() === today.getMonth();
    const tomorrow  = fixed.getDate()  === today.getDate() + 1 && fixed.getMonth() === today.getMonth();

    if (sameDay)  return '🎉 ¡Hoy!';
    if (tomorrow) return '🎈 Mañana';
    return `${fixed.getDate()} ${months[fixed.getMonth()]}`;
  }

  openBirthdayListDialog(): void {
    this.dialog.open(BirthdayListDialogComponent, {
      width: '600px', maxHeight: '90vh',
      data: { birthdays: this.birthdays, onDelete: () => {}, onAdd: () => {} }
    });
  }

  openDirectoryDialog(): void {
    this.dialog.open(DirectoryDialogComponent, {
      width: '600px', maxHeight: '90vh', autoFocus: false
    });
  }
}
