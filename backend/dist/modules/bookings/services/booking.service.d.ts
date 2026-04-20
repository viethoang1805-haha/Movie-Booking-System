import { SeatLockService } from './seat-lock.service';
import { BookingGateway } from '../../../gateways/booking.gateway';
export declare class BookingService {
    private readonly seatLockService;
    private readonly bookingGateway;
    constructor(seatLockService: SeatLockService, bookingGateway: BookingGateway);
    confirmBooking(userId: number, showtimeId: number, seats: string[]): Promise<{
        bookingId: any;
        totalPrice: number;
    }>;
}
//# sourceMappingURL=booking.service.d.ts.map