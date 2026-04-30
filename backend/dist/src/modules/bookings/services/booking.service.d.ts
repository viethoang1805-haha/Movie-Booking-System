import { PrismaService } from '../../../../prisma/prisma.service';
import { SeatLockService } from './seat-lock.service';
import { BookingGateway } from '../../../gateways/booking.gateway';
import { BookingQueryDto } from '../dto/booking.dto';
export declare class BookingService {
    private readonly prisma;
    private readonly seatLockService;
    private readonly bookingGateway;
    constructor(prisma: PrismaService, seatLockService: SeatLockService, bookingGateway: BookingGateway);
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
    findOne(id: number): Promise<{
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
    findByUser(userId: number): Promise<{
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
    getSeats(showtimeId: number): Promise<{
        id: string;
        seatNumber: string;
        status: string;
    }[]>;
    confirmBooking(userId: number, showtimeId: number, seatLabels: string[]): Promise<{
        bookingId: string;
        totalPrice: number;
    }>;
    cancel(id: number, userId: number): Promise<{
        id: string;
        message: string;
        totalPrice: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        userId: bigint;
        showtimeId: bigint;
    }>;
    private serialize;
}
//# sourceMappingURL=booking.service.d.ts.map