import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SeatLockService } from '../modules/bookings/services/seat-lock.service';
import { BookingService } from '../modules/bookings/services/booking.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class BookingGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly seatLockService: SeatLockService,
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
  ) {}

  @SubscribeMessage('join_showtime')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() showtimeId: number,
  ) {
    client.join(`showtime_${showtimeId}`);
    console.log(`Client ${client.id} joined showtime_${showtimeId}`);
  }

  @SubscribeMessage('select_seat')
  async handleSelectSeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number; seatId: string; userId: number },
  ) {
    // ✅ Ép kiểu — dữ liệu từ socket.io có thể bị serialize sai kiểu
    const showtimeId = Number(data.showtimeId);
    const userId = Number(data.userId);
    const { seatId } = data;

    console.log(`[select_seat] showtimeId=${showtimeId} seatId=${seatId} userId=${userId}`);

    const locked = await this.seatLockService.isSeatLocked(showtimeId, seatId);

    if (locked) {
      client.emit('seat_error', { seatId, message: 'Ghế đã có người giữ' });
      return;
    }

    const success = await this.seatLockService.lockSeat(showtimeId, seatId, userId);

    console.log(`[select_seat] lockSeat result=${success}`);

    if (!success) {
      client.emit('seat_error', { seatId, message: 'Không thể giữ ghế, vui lòng thử lại' });
      return;
    }

    this.server.to(`showtime_${showtimeId}`).emit('seat_locked', { seatId, userId });
  }

  @SubscribeMessage('unselect_seat')
  async handleUnselectSeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number; seatId: string; userId: number },
  ) {
    const showtimeId = Number(data.showtimeId);
    const userId = Number(data.userId);
    const { seatId } = data;

    const success = await this.seatLockService.unlockSeat(showtimeId, seatId, userId);

    if (!success) {
      client.emit('seat_error', { seatId, message: 'Không thể bỏ ghế (ghế không thuộc về bạn)' });
      return;
    }

    this.server.to(`showtime_${showtimeId}`).emit('seat_unlocked', { seatId });
  }

  @SubscribeMessage('confirm_booking')
  async handleConfirmBooking(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number; seatIds: string[]; userId: number },
  ) {
    // ✅ Ép kiểu
    const showtimeId = Number(data.showtimeId);
    const userId = Number(data.userId);
    const { seatIds } = data;

    console.log(`[confirm_booking] showtimeId=${showtimeId} userId=${userId} seatIds=${seatIds}`);

    try {
      const result = await this.bookingService.confirmBooking(userId, showtimeId, seatIds);

      console.log('[confirm_booking] success:', result);

      client.emit('booking_success', {
        bookingId: result.bookingId,
        totalPrice: result.totalPrice,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đặt vé thất bại, vui lòng thử lại';
      console.error('[confirm_booking] error:', message);
      client.emit('booking_error', { message });
    }
  }
}