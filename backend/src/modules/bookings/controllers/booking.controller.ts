import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { BookingService } from '../services/booking.service';
import { PrismaService } from '../../../../prisma/prisma.service';

@Controller('booking')
export class BookingController {
  constructor(
    private bookingService: BookingService,
    private prisma: PrismaService,
  ) {}

  // ✅ API lấy ghế theo showtime
  @Get('showtimes/:id/seats')
  async getSeats(@Param('id') id: string) {
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: BigInt(id) },
    });

    if (!showtime) return [];

    const seats = await this.prisma.seat.findMany({
      where: { roomId: showtime.roomId },
      orderBy: { seatNumber: 'asc' },
    });

    return seats.map((s) => ({
      id: s.seatNumber,
      seatNumber: s.seatNumber,
    }));
  }

  @Post('confirm')
  async confirm(@Body() body: any, @Req() req: any) {
    const userId = body.userId || 1;
    return this.bookingService.confirmBooking(userId, body.showtimeId, body.seats);
  }
}