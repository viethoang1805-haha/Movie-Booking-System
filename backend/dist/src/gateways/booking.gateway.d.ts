import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { SeatLockService } from '../modules/bookings/services/seat-lock.service';
import { BookingService } from '../modules/bookings/services/booking.service';
export declare class BookingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly seatLockService;
    private readonly jwtService;
    private readonly bookingService;
    server: Server;
    constructor(seatLockService: SeatLockService, jwtService: JwtService, bookingService: BookingService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, showtimeId: number): Promise<void>;
    handleSelectSeat(client: Socket, data: {
        showtimeId: number;
        seatId: string;
    }): Promise<void>;
    handleUnselectSeat(client: Socket, data: {
        showtimeId: number;
        seatId: string;
    }): Promise<void>;
    handleConfirmBooking(client: Socket, data: {
        showtimeId: number;
        seatIds: string[];
    }): Promise<void>;
}
//# sourceMappingURL=booking.gateway.d.ts.map