import { BookingService } from '../services/booking.service';
import { BookingQueryDto, ConfirmBookingDto } from '../dto/booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    findAll(query: BookingQueryDto): Promise<{
        id: any;
        totalPrice: any;
        status: any;
        createdAt: any;
        userId: any;
        showtimeId: any;
        user: any;
        showtime: {
            id: any;
            startTime: any;
            price: any;
            movie: any;
            room: {
                id: any;
                name: any;
                theater: any;
            } | undefined;
        } | undefined;
        seats: any;
        payment: any;
    }[]>;
    findByUser(userId: string): Promise<{
        id: any;
        totalPrice: any;
        status: any;
        createdAt: any;
        userId: any;
        showtimeId: any;
        user: any;
        showtime: {
            id: any;
            startTime: any;
            price: any;
            movie: any;
            room: {
                id: any;
                name: any;
                theater: any;
            } | undefined;
        } | undefined;
        seats: any;
        payment: any;
    }[]>;
    getSeats(id: string): Promise<{
        id: string;
        seatNumber: string;
        status: string;
    }[]>;
    findOne(id: string): Promise<{
        id: any;
        totalPrice: any;
        status: any;
        createdAt: any;
        userId: any;
        showtimeId: any;
        user: any;
        showtime: {
            id: any;
            startTime: any;
            price: any;
            movie: any;
            room: {
                id: any;
                name: any;
                theater: any;
            } | undefined;
        } | undefined;
        seats: any;
        payment: any;
    }>;
    confirm(dto: ConfirmBookingDto): Promise<{
        bookingId: string;
        totalPrice: number;
    }>;
    cancel(id: string, body: {
        userId: number;
    }): Promise<{
        id: string;
        message: string;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        userId: bigint;
        showtimeId: bigint;
    }>;
}
//# sourceMappingURL=booking.controller.d.ts.map