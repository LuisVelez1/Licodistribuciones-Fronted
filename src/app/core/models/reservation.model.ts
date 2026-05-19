export interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedById: string;
  bookedBy: string;
  purpose: string;
  attendees: number;
  room: string;
  status: 'confirmada' | 'pendiente' | 'cancelada';
}

export interface ReservationRequest {
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  attendees: number;
  room: string;
}