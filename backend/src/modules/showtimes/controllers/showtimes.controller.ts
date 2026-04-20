import { Controller, Get, Param } from '@nestjs/common';
import { SeatLockService } from '../../bookings/services/seat-lock.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private seatLockService: SeatLockService) {}

  @Get(':id/seats')
  async getSeats(@Param('id') id: number) {
    const locked = await this.seatLockService.getLockedSeats(id);

    // fake danh sách ghế
    const seats = [];

    const rows = ['A', 'B', 'C'];
    for (let row of rows) {
      for (let i = 1; i <= 5; i++) {
        const seatId = `${row}${i}`;

        const found = locked.find(s => s.seatId === seatId);

        seats.push({
          seatId,
          status: found ? 'locked' : 'available',
        });
      }
    }

    return seats;
  }
}