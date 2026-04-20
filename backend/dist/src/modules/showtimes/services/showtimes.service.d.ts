import { SeatLockService } from '../../bookings/services/seat-lock.service';
export declare class ShowtimesService {
    private readonly seatLockService;
    constructor(seatLockService: SeatLockService);
    getSeats(showtimeId: number): Promise<{
        seatId: string;
        status: string;
    }[]>;
}
//# sourceMappingURL=showtimes.service.d.ts.map