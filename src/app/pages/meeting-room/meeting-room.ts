import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  purpose: string;
  attendees: number;
  room: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
}

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

  rooms = ['Sala Principal', 'Sala de Capacitación', 'Sala Virtual'];
  timeSlots = ['07:00','07:30','08:00','08:30','09:00','09:30','10:00','10:30',
    '11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30',
    '15:00','15:30','16:00','16:30','17:00','17:30','18:00'];

  newReservation: Partial<Reservation> = {};
  conflictError = '';
  successMessage = '';

  reservations: Reservation[] = [
    { id: '1', date: '2026-03-23', startTime: '09:00', endTime: '10:30', bookedBy: 'Jorge Barbosa', purpose: 'Reunión de directivos', attendees: 8, room: 'Sala Principal', status: 'confirmada' },
    { id: '2', date: '2026-03-24', startTime: '14:00', endTime: '16:00', bookedBy: 'Marcela Arias', purpose: 'Capacitación RRHH', attendees: 20, room: 'Sala de Capacitación', status: 'confirmada' },
    { id: '3', date: '2026-03-25', startTime: '10:00', endTime: '11:00', bookedBy: 'Dilson Otalvaro', purpose: 'Revisión operativa', attendees: 5, room: 'Sala Principal', status: 'pendiente' },
  ];

  ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.selectedDate = this.minDate;
  }

  get todayReservations(): Reservation[] {
    return this.reservations.filter(r => r.date === this.selectedDate && r.status !== 'cancelada')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  get allUpcoming(): Reservation[] {
    return this.reservations
      .filter(r => r.date >= this.minDate && r.status !== 'cancelada')
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.conflictError = '';
    if (!this.showForm) this.newReservation = {};
    else this.newReservation = { date: this.selectedDate, room: 'Sala Principal', attendees: 1 };
  }

  bookRoom() {
    const r = this.newReservation;
    if (!r.date || !r.startTime || !r.endTime || !r.purpose || !r.room) return;
    if (r.startTime! >= r.endTime!) { this.conflictError = '⚠️ La hora de fin debe ser posterior a la de inicio.'; return; }

    const conflict = this.reservations.find(existing =>
      existing.room === r.room && existing.date === r.date &&
      existing.status !== 'cancelada' &&
      r.startTime! < existing.endTime && r.endTime! > existing.startTime
    );

    if (conflict) {
      this.conflictError = `⚠️ Conflicto: ya existe una reserva de ${conflict.startTime} a ${conflict.endTime} en esta sala.`;
      return;
    }

    const userName = this.getUserName();
    this.reservations.push({
      id: crypto.randomUUID(),
      date: r.date!, startTime: r.startTime!, endTime: r.endTime!,
      bookedBy: userName, purpose: r.purpose!, attendees: r.attendees ?? 1,
      room: r.room!, status: 'confirmada'
    });

    this.successMessage = '✅ Sala reservada exitosamente.';
    this.conflictError = '';
    this.newReservation = {};
    this.showForm = false;
    setTimeout(() => this.successMessage = '', 3000);
  }

  cancelReservation(id: string) {
    const r = this.reservations.find(r => r.id === id);
    if (r) r.status = 'cancelada';
  }

  isSlotBooked(slot: string, room: string): boolean {
    return this.reservations.some(r =>
      r.date === this.selectedDate && r.room === room &&
      r.status !== 'cancelada' &&
      slot >= r.startTime && slot < r.endTime
    );
  }

  getSlotReservation(slot: string, room: string): Reservation | undefined {
    return this.reservations.find(r =>
      r.date === this.selectedDate && r.room === room &&
      r.status !== 'cancelada' &&
      slot === r.startTime
    );
  }

  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const date = new Date(y, m-1, d);
    return `${days[date.getDay()]} ${d} ${months[m-1]} ${y}`;
  }

  private getUserName(): string {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'Usuario';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.username as string).split('.').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } catch { return 'Usuario'; }
  }
}
