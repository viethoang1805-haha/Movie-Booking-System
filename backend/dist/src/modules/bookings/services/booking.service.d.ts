import { SeatLockService } from './seat-lock.service';
import { BookingGateway } from '../../../gateways/booking.gateway';
import { PrismaService } from '../../../../prisma/prisma.service';
export declare class BookingService {
    private readonly prisma;
    private readonly seatLockService;
    private readonly bookingGateway;
    constructor(prisma: PrismaService, seatLockService: SeatLockService, bookingGateway: BookingGateway);
    confirmBooking(userId: number, showtimeId: number, seatLabels: string[]): Promise<{
        bookingId: string;
        totalPrice: number;
    }>;
}
//# sourceMappingURL=booking.service.d.ts.map