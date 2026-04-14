import { Injectable, BadRequestException } from '@nestjs/common';
import { SeatLockService } from './seat-lock.service';

@Injectable()
export class BookingService {
  constructor(private readonly seatLockService: SeatLockService) {}

  async confirmBooking(
    userId: number,
    showtimeId: number,
    seats: string[],
  ) {
    // 🔥 kiểm tra Redis
    for (const seatId of seats) {
      const lock = await this.seatLockService.isSeatLocked(
        showtimeId,
        seatId,
      );

      if (!lock) {
        throw new BadRequestException(
          `Ghế ${seatId} đã hết hạn`,
        );
      }
    }

    // 👉 TODO: lưu DB (Prisma)
    // create booking + booking_seats

    // 🔥 xoá Redis
    for (const seatId of seats) {
      await this.seatLockService.unlockSeat(showtimeId, seatId);
    }

    return {
      message: 'Đặt vé thành công',
    };
  }
}