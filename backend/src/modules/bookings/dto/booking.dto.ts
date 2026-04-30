
export class ConfirmBookingDto {
  userId!: number;
  showtimeId!: number;
  seatIds!: string[];
}

export class BookingQueryDto {
  userId?: number;
  showtimeId?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}