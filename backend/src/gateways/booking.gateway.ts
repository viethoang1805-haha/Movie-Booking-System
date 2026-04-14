import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SeatLockService } from '../modules/bookings/services/seat-lock.service';
import { Server, Socket } from 'socket.io';

// 🔥 Realtime booking gateway
@WebSocketGateway({
  cors: { origin: '*' },
})
export class BookingGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly seatLockService: SeatLockService) {}

  // -------------------------
  // Join phòng theo showtime
  // -------------------------
  @SubscribeMessage('join_showtime')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() showtimeId: number,
  ) {
    client.join(`showtime_${showtimeId}`);
  }

  // -------------------------
  // Chọn ghế (lock seat)
  // -------------------------
  @SubscribeMessage('select_seat')
  async handleSelectSeat(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { showtimeId: number; seatId: string; userId: number },
  ) {
    const { showtimeId, seatId, userId } = data;

    const locked = await this.seatLockService.isSeatLocked(
      showtimeId,
      seatId,
    );

    if (locked) {
      client.emit('seat_error', {
        seatId,
        message: 'Ghế đã có người giữ',
      });
      return;
    }

    await this.seatLockService.lockSeat(showtimeId, seatId, userId);

    // Notify tất cả client trong phòng showtime
    this.server.to(`showtime_${showtimeId}`).emit('seat_locked', {
      seatId,
      userId,
    });
  }

  // -------------------------
  // Bỏ ghế (unlock seat)
  // -------------------------
  @SubscribeMessage('unselect_seat')
  async handleUnselectSeat(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { showtimeId: number; seatId: string },
  ) {
    const { showtimeId, seatId } = data;

    await this.seatLockService.unlockSeat(showtimeId, seatId);

    this.server.to(`showtime_${showtimeId}`).emit('seat_unlocked', {
      seatId,
    });
  }
}