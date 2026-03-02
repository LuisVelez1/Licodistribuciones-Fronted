import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { BirthdayListDialogComponent } from './birthday/birthday-dialog';
import { BirthdayService, BirthdayResponse } from '../../core/services/birthday.service'; 
import { DirectoryDialogComponent } from './directory/directory-dialog';


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
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatBadgeModule
  ]
})
export class HomeRightComponent implements OnInit {
  birthdays: Birthday[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private dialog: MatDialog,
    private birthdayService: BirthdayService 
  ) {}

  ngOnInit() {
    this.loadBirthdaysFromApi();

    setInterval(() => {
      this.birthdays = [...this.birthdays];
    }, 60 * 1000);
  }

  loadBirthdaysFromApi() {
  this.birthdayService.getAllBirthdays().subscribe({
    next: (data: BirthdayResponse[]) => {
      this.birthdays = data.map(b => {
        
        const [year, month, day] = b.birthdayDate.split('-').map(Number);
        const birthday = new Date(year, month - 1, day);

        return {
          name: `${b.firstName} ${b.lastName}`,
          sede: b.sede,
          date: birthday
        };
      });

      this.birthdays.sort((a, b) => {
        if (a.date.getMonth() !== b.date.getMonth()) {
          return a.date.getMonth() - b.date.getMonth();
        }
        return a.date.getDate() - b.date.getDate();
      });
    },
    error: (err) => {
      console.error('Error cargando cumpleaños:', err);
    }
  });
}


  openBirthdayListDialog(): void {
    this.dialog.open(BirthdayListDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: {
        birthdays: this.birthdays,
        onDelete: () => {},
        onAdd: () => {}
      }
    });
  }

   getLimitedBirthdays(): Birthday[] {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const currentMonthBirthdays = this.birthdays.filter(b => {
    return (
      b.date.getMonth() === currentMonth &&
      b.date.getDate() >= currentDay
    );
  });

  const sorted = currentMonthBirthdays.sort((a, b) => a.date.getDate() - b.date.getDate());

  return sorted.slice(0, 3);
}

  formatDate(date: Date): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                   'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  }

    openDirectoryDialog(): void {
    this.dialog.open(DirectoryDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
    });
  }
}
