import { BookingService } from '../services/booking.service';
import { PrismaService } from '../../../../prisma/prisma.service';
export declare class BookingController {
    private bookingService;
    private prisma;
    constructor(bookingService: BookingService, prisma: PrismaService);
    getSeats(id: string): Promise<{
        id: string;
        seatNumber: string;
    }[]>;
    confirm(body: any, req: any): Promise<{
        bookingId: string;
        totalPrice: number;
    }>;
}
//# sourceMappingURL=booking.controller.d.ts.map