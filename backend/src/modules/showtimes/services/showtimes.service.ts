import { Injectable } from '@nestjs/common';
import { SeatLockService } from '../../bookings/services/seat-lock.service';

@Injectable()
export class ShowtimesService {
  constructor(private readonly seatLockService: SeatLockService) {}

  async getSeats(showtimeId: number) {
    const lockedSeats = await this.seatLockService.getLockedSeats(showtimeId);

    const result = [];
    const rows = ['A', 'B', 'C', 'D'];

    for (const row of rows) {
      for (let i = 1; i <= 5; i++) {
        const seatId = `${row}${i}`;

        const isLocked = lockedSeats.find(
          (s) => s.seatId === seatId,
        );

        result.push({
          seatId,
          status: isLocked ? 'locked' : 'available',
        });
      }
    }

    return result;
  }
}