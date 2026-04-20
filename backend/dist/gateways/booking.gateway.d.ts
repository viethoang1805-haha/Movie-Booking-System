import { Server, Socket } from 'socket.io';
import { SeatLockService } from '../modules/bookings/services/seat-lock.service';
import { BookingService } from '../modules/bookings/services/booking.service';
export declare class BookingGateway {
    private readonly seatLockService;
    private readonly bookingService;
    server: Server;
    constructor(seatLockService: SeatLockService, bookingService: BookingService);
    handleJoin(client: Socket, showtimeId: number): void;
    handleSelectSeat(client: Socket, data: {
        showtimeId: number;
        seatId: string;
        userId: number;
    }): Promise<void>;
    handleUnselectSeat(client: Socket, data: {
        showtimeId: number;
        seatId: string;
        userId: number;
    }): Promise<void>;
    handleConfirmBooking(client: Socket, data: {
        showtimeId: number;
        seatIds: string[];
        userId: number;
    }): Promise<void>;
}
//# sourceMappingURL=booking.gateway.d.ts.map