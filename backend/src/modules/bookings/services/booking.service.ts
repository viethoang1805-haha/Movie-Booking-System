// src/modules/bookings/services/booking.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { SeatLockService } from './seat-lock.service';
import { BookingGateway } from '../../../gateways/booking.gateway';
import { BookingQueryDto } from '../dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly seatLockService: SeatLockService,
    @Inject(forwardRef(() => BookingGateway))
    private readonly bookingGateway: BookingGateway,
  ) {}

  // Lấy danh sách booking
  async findAll(query: BookingQueryDto) {
    const where: any = {};
    if (query.userId) where.userId = BigInt(query.userId);
    if (query.showtimeId) where.showtimeId = BigInt(query.showtimeId);
    if (query.status) where.status = query.status;

    const bookings = await this.prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        showtime: {
          include: {
            movie: { select: { id: true, title: true, posterUrl: true } },
            room: {
              select: {
                id: true,
                name: true,
                theater: { select: { id: true, name: true, location: true } },
              },
            },
          },
        },
        seats: {
          include: { seat: { select: { id: true, seatNumber: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.serialize(b));
  }

  // Lấy 1 booking
  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        showtime: {
          include: {
            movie: { select: { id: true, title: true, posterUrl: true } },
            room: {
              select: {
                id: true,
                name: true,
                theater: { select: { id: true, name: true, location: true } },
              },
            },
          },
        },
        seats: {
          include: { seat: { select: { id: true, seatNumber: true } } },
        },
        payment: true,
      },
    });

    if (!booking) throw new NotFoundException(`Booking #${id} không tồn tại`);

    return this.serialize(booking);
  }

  // Lấy booking theo userId
  async findByUser(userId: number) {
    return this.findAll({ userId });
  }

  // Lấy ghế theo showtime
async getSeats(showtimeId: number) {
  const showtime = await this.prisma.showtime.findUnique({
    where: { id: BigInt(showtimeId) },
    include: {
      room: {
        include: { seats: true }, // bỏ orderBy, sort thủ công bên dưới
      },
      bookings: {
        where: { status: 'CONFIRMED' },
        include: { seats: { select: { seatId: true } } },
      },
    },
  });

  if (!showtime) return [];

  const bookedSeatIds = showtime.bookings
    .flatMap((b) => b.seats.map((s) => s.seatId.toString()));

  return showtime.room.seats
    .sort((a, b) => {
      const rowA = a.seatNumber.match(/[A-Z]+/)?.[0] ?? '';
      const rowB = b.seatNumber.match(/[A-Z]+/)?.[0] ?? '';
      const numA = parseInt(a.seatNumber.match(/\d+/)?.[0] ?? '0');
      const numB = parseInt(b.seatNumber.match(/\d+/)?.[0] ?? '0');
      return rowA !== rowB ? rowA.localeCompare(rowB) : numA - numB;
    })
    .map((s) => ({
      id: s.seatNumber,
      seatNumber: s.seatNumber,
      status: bookedSeatIds.includes(s.id.toString()) ? 'booked' : 'available',
    }));
}

  // Xác nhận đặt vé
  async confirmBooking(userId: number, showtimeId: number, seatLabels: string[]) {
    // 1. Kiểm tra Redis
    for (const seatId of seatLabels) {
      const owner = await this.seatLockService.isSeatLocked(showtimeId, seatId);
      if (!owner) throw new BadRequestException(`Ghế ${seatId} chưa được giữ`);
      if (owner !== String(userId)) throw new BadRequestException(`Ghế ${seatId} không thuộc về bạn`);
    }

    // 2. Lấy showtime
    const showtime = await this.prisma.showtime.findUnique({
      where: { id: BigInt(showtimeId) },
    });
    if (!showtime) throw new BadRequestException('Showtime không tồn tại');

    // 3. Lấy seat ids từ seatNumber
    const seats = await this.prisma.seat.findMany({
      where: {
        roomId: showtime.roomId,
        seatNumber: { in: seatLabels },
      },
    });
    if (seats.length !== seatLabels.length) {
      throw new BadRequestException('Một số ghế không tồn tại trong phòng');
    }

    // 4. Kiểm tra ghế chưa bị booked
    const alreadyBooked = await this.prisma.bookingSeat.findFirst({
      where: {
        seatId: { in: seats.map((s) => s.id) },
        booking: { showtimeId: BigInt(showtimeId), status: 'CONFIRMED' },
      },
    });
    if (alreadyBooked) throw new BadRequestException('Một số ghế đã được đặt');

    // 5. Tạo booking + BookingSeat
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

    // 6. Unlock Redis
    for (const seatLabel of seatLabels) {
      await this.seatLockService.unlockSeat(showtimeId, seatLabel, userId);
    }

    // 7. Notify realtime
    this.bookingGateway.server
      .to(`showtime_${showtimeId}`)
      .emit('seat_booked', { seatIds: seatLabels, userId });

    return {
      bookingId: booking.id.toString(),
      totalPrice: booking.totalPrice,
    };
  }

  // Hủy booking
  async cancel(id: number, userId: number) {
    const booking = await this.findOne(id);

    if (booking.userId !== String(userId)) {
      throw new BadRequestException('Bạn không có quyền hủy booking này');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking đã bị hủy');
    }

    const updated = await this.prisma.booking.update({
      where: { id: BigInt(id) },
      data: { status: 'CANCELLED' },
    });

    return { ...updated, id: updated.id.toString(), message: 'Đã hủy booking' };
  }

  private serialize(b: any) {
    return {
      id: b.id.toString(),
      totalPrice: b.totalPrice,
      status: b.status,
      createdAt: b.createdAt,
      userId: b.userId.toString(),
      showtimeId: b.showtimeId.toString(),
      user: b.user ? { ...b.user, id: b.user.id.toString() } : undefined,
      showtime: b.showtime
        ? {
            id: b.showtime.id.toString(),
            startTime: b.showtime.startTime,
            price: b.showtime.price,
            movie: b.showtime.movie
              ? { ...b.showtime.movie, id: b.showtime.movie.id.toString() }
              : undefined,
            room: b.showtime.room
              ? {
                  id: b.showtime.room.id.toString(),
                  name: b.showtime.room.name,
                  theater: b.showtime.room.theater
                    ? { ...b.showtime.room.theater, id: b.showtime.room.theater.id.toString() }
                    : undefined,
                }
              : undefined,
          }
        : undefined,
      seats: b.seats
        ? b.seats.map((s: any) => ({
            id: s.seat.id.toString(),
            seatNumber: s.seat.seatNumber,
          }))
        : [],
      payment: b.payment ?? null,
    };
  }
}