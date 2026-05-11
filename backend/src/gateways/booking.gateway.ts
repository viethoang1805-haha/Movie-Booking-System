// src/gateways/booking.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { SeatLockService } from '../modules/bookings/services/seat-lock.service';
import { BookingService } from '../modules/bookings/services/booking.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class BookingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly seatLockService: SeatLockService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
  ) {}

  //  Verify JWT khi client connect
  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        client.emit('auth_error', { message: 'Thiếu token' });
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET ?? 'supersecret',
      });

      // ✅ Lưu userId vào socket data để dùng sau
      client.data.userId = Number(payload.sub);
      client.data.role = payload.role;

      console.log(`Client ${client.id} connected — userId=${client.data.userId}`);
    } catch {
      client.emit('auth_error', { message: 'Token không hợp lệ' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('join_showtime')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() showtimeId: number,
  ) {
    client.join(`showtime_${showtimeId}`);
    console.log(`Client ${client.id} joined showtime_${showtimeId}`);

    // Gửi lại danh sách ghế đang locked cho client vừa join
    const lockedSeats = await this.seatLockService.getLockedSeats(showtimeId);
    for (const seat of lockedSeats) {
      client.emit('seat_locked', { seatId: seat.seatId, userId: seat.userId });
    }
  }

  @SubscribeMessage('select_seat')
  async handleSelectSeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number; seatId: string },
  ) {
    const showtimeId = Number(data.showtimeId);
    const userId = client.data.userId; // Lấy từ token, không nhận từ client
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
    @MessageBody() data: { showtimeId: number; seatId: string },
  ) {
    const showtimeId = Number(data.showtimeId);
    const userId = client.data.userId; //  Lấy từ token
    const { seatId } = data;

    const success = await this.seatLockService.unlockSeat(showtimeId, seatId, userId);
    if (!success) {
      client.emit('seat_error', { seatId, message: 'Không thể bỏ ghế' });
      return;
    }

    this.server.to(`showtime_${showtimeId}`).emit('seat_unlocked', { seatId });
  }

  @SubscribeMessage('confirm_booking')
  async handleConfirmBooking(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number; seatIds: string[] },
  ) {
    const showtimeId = Number(data.showtimeId);
    const userId = client.data.userId; // Lấy từ token
    const { seatIds } = data;

    console.log(`[confirm_booking] showtimeId=${showtimeId} userId=${userId} seatIds=${seatIds}`);

    try {
      const result = await this.bookingService.confirmBooking(userId, showtimeId, seatIds);
      console.log('[confirm_booking] success:', result);
      client.emit('booking_success', { bookingId: result.bookingId, totalPrice: result.totalPrice });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đặt vé thất bại';
      console.error('[confirm_booking] error:', message);
      client.emit('booking_error', { message });
    }
  }
}