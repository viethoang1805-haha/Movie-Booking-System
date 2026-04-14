import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../redis/redis.service';
import { REDIS_KEYS } from '../../../redis/redis.constants';

@Injectable()
export class SeatLockService {
  constructor(private readonly redisService: RedisService) {}

  async lockSeat(showtimeId: number, seatId: string, userId: number) {
    const key = REDIS_KEYS.SEAT(showtimeId, seatId);

    // TTL = 5 phút
    return await this.redisService.set(key, userId, 300);
  }

  async unlockSeat(showtimeId: number, seatId: string) {
    const key = REDIS_KEYS.SEAT(showtimeId, seatId);
    return await this.redisService.del(key);
  }

  async isSeatLocked(showtimeId: number, seatId: string) {
    const key = REDIS_KEYS.SEAT(showtimeId, seatId);
    return await this.redisService.get(key);
  }

  async getLockedSeats(showtimeId: number) {
    const keys = await this.redisService.keys(`seat:${showtimeId}:*`);

    const result = [];

    for (const key of keys) {
      const seatId = key.split(':')[2];
      const userId = await this.redisService.get(key);

      result.push({ seatId, userId });
    }

    return result;
  }
}