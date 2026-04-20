import { RedisService } from '../../../redis/redis.service';
export declare class SeatLockService {
    private readonly redisService;
    constructor(redisService: RedisService);
    lockSeat(showtimeId: number, seatId: string, userId: number): Promise<boolean>;
    unlockSeat(showtimeId: number, seatId: string, userId: number): Promise<boolean>;
    isSeatLocked(showtimeId: number, seatId: string): Promise<string | null>;
    getLockedSeats(showtimeId: number): Promise<{
        seatId: string;
        userId: string;
    }[]>;
}
//# sourceMappingURL=seat-lock.service.d.ts.map