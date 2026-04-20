import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { SeatLockService } from './seat-lock.service';
import { BookingGateway } from '../../../gateways/booking.gateway';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly seatLockService: SeatLockService,
    @Inject(forwardRef(() => BookingGateway))
    private readonly bookingGateway: BookingGateway,
  ) {}

  async confirmBooking(userId: number, showtimeId: number, seatLabels: string[]) {
    // 1. Kiểm tra Redis
    for (const seatId of seatLabels) {
      const owner = await this.seatLockService.isSeatLocked(showtimeId, seatId);
      if (!owner) throw new BadRequestException(`Ghế ${seatId} chưa được giữ`);
      if (owner !== String(userId)) throw new BadRequestException(`Ghế ${seatId} không thuộc về bạn`);
    }

    // 2. Lấy showtime + room
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: BigInt(showtimeId) },
    });
    if (!showtime) throw new BadRequestException('Showtime không tồn tại');

    // 3. Lấy seat ids từ seatNumber (A1, A2...)
    const seats = await this.prisma.seat.findMany({
      where: {
        roomId: showtime.roomId,
        seatNumber: { in: seatLabels },
      },
    });
    if (seats.length !== seatLabels.length) {
      throw new BadRequestException('Một số ghế không tồn tại trong phòng');
    }

    // 4. Tạo booking + BookingSeat
    const booking = await this.prisma.booking.create({
      data: {
        userId: BigInt(userId),
        showtimeId: BigInt(showtimeId),
        totalPrice: showtime.price * seatLabels.length,
        status: 'CONFIRMED',
        seats: {
          create: seats.map((s) => ({ seatId: s.id })),
        },
      },
    });

    // 5. Unlock Redis
    for (const seatLabel of seatLabels) {
      await this.seatLockService.unlockSeat(showtimeId, seatLabel, userId);
    }

    // 6. Notify realtime
    this.bookingGateway.server
      .to(`showtime_${showtimeId}`)
      .emit('seat_booked', { seatIds: seatLabels, userId });

    return {
      bookingId: booking.id.toString(),
      totalPrice: booking.totalPrice,
    };
  }
}