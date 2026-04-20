import { SeatLockService } from '../../bookings/services/seat-lock.service';
export declare class ShowtimesController {
    private seatLockService;
    constructor(seatLockService: SeatLockService);
    getSeats(id: number): Promise<{
        seatId: string;
        status: string;
    }[]>;
}
//# sourceMappingURL=showtimes.controller.d.ts.map