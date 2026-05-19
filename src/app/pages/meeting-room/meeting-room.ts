// meeting-room.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../core/services/reservation.service';
import { UserService } from '../../core/services/user.service';
import { Reservation, ReservationRequest } from '../../core/models/reservation.model';

@Component({
  selector: 'app-meeting-room',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meeting-room.html',
  styleUrl: './meeting-room.scss'
})
export class MeetingRoomComponent implements OnInit {
  showForm = false;
  selectedDate = '';
  minDate = '';
  loading = false;

  rooms = ['Sala Principal', 'Sala de Capacitación', 'Sala Virtual'];
  timeSlots = ['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
    '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30',
    '15:00','15:30','16:00','16:30','17:00','17:30','18:00'];

  newReservation: Partial<ReservationRequest> = {};
  conflictError = '';
  successMessage = '';

  reservationsByDate: Reservation[] = [];
  allUpcoming: Reservation[] = [];

  private currentUserId = '';
  private currentUserRoles: string[] = [];

  constructor(private reservationService: ReservationService, private userService: UserService) {}

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.selectedDate = this.minDate;

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.currentUserRoles = user.roles ?? [];
      },
      error: (err) => console.error('Error obteniendo usuario actual:', err)
    });

    this.loadByDate(this.selectedDate);
    this.loadUpcoming();
  }

  onDateChange() {
    this.loadByDate(this.selectedDate);
  }

  private loadByDate(date: string) {
    this.reservationService.getByDate(date).subscribe({
      next: (data) => this.reservationsByDate = data,
      error: (err) => console.error('Error cargando reservas:', err)
    });
  }

  private loadUpcoming() {
    this.reservationService.getUpcoming().subscribe({
      next: (data) => this.allUpcoming = data,
      error: (err) => console.error('Error cargando próximas reservas:', err)
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.conflictError = '';
    if (!this.showForm) {
      this.newReservation = {};
    } else {
      this.newReservation = { date: this.selectedDate, room: 'Sala Principal', attendees: 1 };
    }
  }

  bookRoom() {
    const r = this.newReservation;
    if (!r.date || !r.startTime || !r.endTime || !r.purpose || !r.room) return;
    if (r.startTime >= r.endTime) {
      this.conflictError = '⚠️ La hora de fin debe ser posterior a la de inicio.';
      return;
    }

    this.loading = true;
    this.reservationService.create(r as ReservationRequest).subscribe({
      next: (nueva) => {
        this.allUpcoming = [...this.allUpcoming, nueva]
          .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
        if (nueva.date === this.selectedDate) {
          this.reservationsByDate = [...this.reservationsByDate, nueva];
        }
        this.successMessage = '✅ Sala reservada exitosamente.';
        this.conflictError = '';
        this.newReservation = {};
        this.showForm = false;
        this.loading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.conflictError = '⚠️ ' + (err.error?.message ?? 'Error al reservar. Verifica el horario.');
        this.loading = false;
      }
    });
  }

  cancelReservation(id: string) {
    this.reservationService.cancel(id).subscribe({
      next: (updated) => {
        this.allUpcoming = this.allUpcoming.filter(r => r.id !== id);
        this.reservationsByDate = this.reservationsByDate.filter(r => r.id !== id);
      },
      error: (err) => alert(err.error?.message ?? 'No tienes permiso para cancelar esta reserva.')
    });
  }

  canCancel(res: Reservation): boolean {
  const isSuperAdmin = this.currentUserRoles.some(r =>
    r === 'SUPER_ADMIN' || r === 'ROLE_SUPER_ADMIN'
  );
  return res.bookedById === this.currentUserId || isSuperAdmin;
}

  isSlotBooked(slot: string, room: string): boolean {
    return this.reservationsByDate.some(r =>
      r.room === room && slot >= r.startTime && slot < r.endTime
    );
  }

  getSlotReservation(slot: string, room: string): Reservation | undefined {
    return this.reservationsByDate.find(r =>
      r.room === room && slot === r.startTime
    );
  }

  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const date = new Date(y, m - 1, d);
    return `${days[date.getDay()]} ${d} ${months[m - 1]} ${y}`;
  }
}