import { BookingService } from '../services/booking.service';
export declare class BookingController {
    private bookingService;
    constructor(bookingService: BookingService);
    confirm(body: any, req: any): Promise<{
        bookingId: any;
        totalPrice: number;
    }>;
}
//# sourceMappingURL=booking.controller.d.ts.map